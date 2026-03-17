import { ref, readonly } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { calcChunks, delay } from '../utils/format'

export const DEFAULT_CHUNK_SEC = 240 // iMessage 4 min default

const FFMPEG_BASE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'

// Singleton — keeps the FFmpeg instance alive across re-renders
let ffmpegInstance = null

export function useVideoSplitter() {
  const status      = ref('idle')   // idle | loading | processing | done | error
  const progressPct = ref(0)
  const progressMsg = ref('')
  const error       = ref(null)
  const segments    = ref([])       // { name, url, size, duration }[]

  function setProgress(pct, msg = null) {
    progressPct.value = pct
    if (msg !== null) progressMsg.value = msg
  }

  function getVideoDuration(file) {
    return new Promise((resolve) => {
      const v   = document.createElement('video')
      v.preload = 'metadata'
      const url = URL.createObjectURL(file)
      v.src     = url
      const done = (d) => { URL.revokeObjectURL(url); resolve(d) }
      v.onloadedmetadata = () => done(v.duration)
      v.onerror          = () => done(0)
      setTimeout(() => done(0), 6000)
    })
  }

  async function ensureFFmpeg() {
    if (ffmpegInstance) return ffmpegInstance
    ffmpegInstance = new FFmpeg()
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${FFMPEG_BASE}/ffmpeg-core.js`,   'text/javascript'),
      wasmURL: await toBlobURL(`${FFMPEG_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    return ffmpegInstance
  }

  // chunkSec is now passed in at call time so the UI can drive it
  async function split(file, chunkSec = DEFAULT_CHUNK_SEC) {
    reset()
    error.value  = null
    status.value = 'loading'

    // Acquire WakeLock so the screen stays on during processing.
    // Safari iOS 16.4+ supports this — silently ignored on older versions.
    let wakeLock = null
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen')
      }
    } catch (_) { /* WakeLock unavailable — continue without it */ }

    try {
      setProgress(5, 'LOADING FFMPEG ENGINE...')
      const ff = await ensureFFmpeg()

      setProgress(18, 'READING VIDEO FILE...')
      const ext           = (file.name.split('.').pop() || 'mp4').toLowerCase()
      const inputFilename = `input.${ext}`
      await ff.writeFile(inputFilename, await fetchFile(file))

      setProgress(24, 'DETECTING DURATION...')
      const duration = await getVideoDuration(file)
      if (!duration || !isFinite(duration) || duration <= 0) {
        throw new Error(
          'COULD NOT READ VIDEO DURATION.\n\nTRY CONVERTING TO MP4 FIRST,\nOR USE A DIFFERENT FILE.',
        )
      }

      status.value   = 'processing'
      const chunks   = calcChunks(duration, chunkSec)
      const baseName = file.name.replace(/\.[^.]+$/, '')

      setProgress(28, `COMPRESSING + SPLITTING INTO ${chunks.length} PART${chunks.length !== 1 ? 'S' : ''}...`)

      for (const chunk of chunks) {
        const outName  = `out_part${chunk.index}.mp4`
        const pctStart = 28 + ((chunk.index - 1) / chunks.length) * 65
        const pctEnd   = 28 + (chunk.index       / chunks.length) * 65

        setProgress(Math.round(pctStart), `COMPRESSING PART ${chunk.index} OF ${chunks.length}...`)

        const onProgress = ({ progress }) => {
          setProgress(Math.round(pctStart + progress * (pctEnd - pctStart)), null)
        }
        ff.on('progress', onProgress)

        await ff.exec([
          '-ss',  String(chunk.start),
          '-i',   inputFilename,
          '-t',   String(chunk.duration),
          // Re-encode to H.264 1080p — safe on all devices, fixes HEVC memory crash
          '-vf',  'scale=w=1920:h=1080:force_original_aspect_ratio=decrease:flags=lanczos',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',   // fastest encode, still fine quality for sharing
          '-crf',    '23',          // quality factor: 18=high, 23=good, 28=smaller file
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          '-avoid_negative_ts', 'make_zero',
          outName,
        ])

        ff.off('progress', onProgress)

        const raw  = await ff.readFile(outName)
        const blob = new Blob([raw.buffer], { type: 'video/mp4' })
        segments.value.push({
          name:     `${baseName}_part${chunk.index}.mp4`,
          url:      URL.createObjectURL(blob),
          size:     blob.size,
          duration: chunk.duration,
        })
        await ff.deleteFile(outName)
      }

      await ff.deleteFile(inputFilename)
      setProgress(100, '✓ ALL PARTS READY TO SAVE!')
      await delay(700)
      status.value = 'done'
    } catch (err) {
      console.error('[VidSplit]', err)
      error.value  = err.message || String(err)
      status.value = 'error'
    } finally {
      // Always release WakeLock when done, whether success or failure
      try { wakeLock?.release() } catch (_) {}
    }
  }

  async function downloadSegment(index) {
    const seg = segments.value[index]
    if (!seg) return

    // Fetch the blob from the object URL so we can pass a File to share API
    const blob = await fetch(seg.url).then(r => r.blob())
    const file = new File([blob], seg.name, { type: 'video/mp4' })

    // Use Web Share API if available and can share files (iOS Safari 15+)
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: seg.name,
        })
        return
      } catch (err) {
        // User cancelled share or share failed — fall through to download
        if (err.name === 'AbortError') return
      }
    }

    // Fallback: standard anchor download (desktop / non-iOS)
    const a    = document.createElement('a')
    a.href     = seg.url
    a.download = seg.name
    a.click()
  }

  async function downloadAll() {
    // If Web Share API is available, share files one at a time
    // (iOS doesn't support sharing multiple video files at once)
    for (let i = 0; i < segments.value.length; i++) {
      await downloadSegment(i)
      await delay(600)
    }
  }

  function reset() {
    segments.value.forEach((s) => URL.revokeObjectURL(s.url))
    segments.value    = []
    progressPct.value = 0
    progressMsg.value = ''
    status.value      = 'idle'
  }

  return {
    status:      readonly(status),
    progressPct: readonly(progressPct),
    progressMsg: readonly(progressMsg),
    error:       readonly(error),
    segments:    readonly(segments),
    split,
    downloadSegment,
    downloadAll,
    reset,
  }
}

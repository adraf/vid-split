import { ref, readonly } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { calcChunks, delay } from '../utils/format'

const CHUNK_SEC   = 240 // 4 minutes
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

  async function split(file) {
    reset()
    error.value  = null
    status.value = 'loading'

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
      const chunks   = calcChunks(duration, CHUNK_SEC)
      const baseName = file.name.replace(/\.[^.]+$/, '')

      setProgress(28, `SPLITTING INTO ${chunks.length} PART${chunks.length !== 1 ? 'S' : ''}...`)

      for (const chunk of chunks) {
        const outName  = `out_part${chunk.index}.mp4`
        const pctStart = 28 + ((chunk.index - 1) / chunks.length) * 65
        const pctEnd   = 28 + (chunk.index       / chunks.length) * 65

        setProgress(Math.round(pctStart), `CUTTING PART ${chunk.index} OF ${chunks.length}...`)

        const onProgress = ({ progress }) => {
          setProgress(Math.round(pctStart + progress * (pctEnd - pctStart)), null)
        }
        ff.on('progress', onProgress)

        await ff.exec([
          '-ss',  String(chunk.start),
          '-i',   inputFilename,
          '-t',   String(chunk.duration),
          '-c',   'copy',
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
    }
  }

  function downloadSegment(index) {
    const seg = segments.value[index]
    if (!seg) return
    const a    = document.createElement('a')
    a.href     = seg.url
    a.download = seg.name
    a.click()
  }

  async function downloadAll() {
    for (let i = 0; i < segments.value.length; i++) {
      downloadSegment(i)
      await delay(400)
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
    CHUNK_SEC,
  }
}

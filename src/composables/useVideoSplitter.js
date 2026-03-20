import { ref, readonly } from 'vue'
import { delay } from '../utils/format'

export const DEFAULT_CHUNK_SEC = 240 // iMessage 4 min default

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'

export function useVideoSplitter() {
  const status      = ref('idle')   // idle | uploading | processing | done | error
  const progressPct = ref(0)
  const progressMsg = ref('')
  const error       = ref(null)
  const segments    = ref([])

  let currentJobId = null

  function setProgress(pct, msg = null) {
    progressPct.value = pct
    if (msg !== null) progressMsg.value = msg
  }

  async function split(file, chunkSec = DEFAULT_CHUNK_SEC) {
    reset()
    error.value  = null
    status.value = 'uploading'

    let wakeLock = null
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen')
      }
    } catch (_) {}

    try {
      // Step 1: Upload
      setProgress(0, 'UPLOADING VIDEO...')
      const formData = new FormData()
      formData.append('video', file)

      const uploadRes = await fetchWithProgress(
        `${SERVER_URL}/upload`,
        formData,
        (pct) => setProgress(Math.round(pct * 60), 'UPLOADING VIDEO...')
      )

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'Upload failed')
      }

      const { jobId, gcsInput } = await uploadRes.json()
      currentJobId = jobId

      // Step 2: Process
      status.value = 'processing'
      setProgress(65, 'SPLITTING VIDEO...')

      const processRes = await fetch(`${SERVER_URL}/process`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ jobId, gcsInput, chunkSec }),
      })

      if (!processRes.ok) {
        const err = await processRes.json()
        throw new Error(err.error || 'Processing failed')
      }

      const { segments: segs } = await processRes.json()
      setProgress(90, 'PREPARING DOWNLOADS...')

      const baseName = file.name.replace(/\.[^.]+$/, '')
      segments.value = segs.map(seg => ({
        index:       seg.index,
        name:        `${baseName}_part${seg.index}.mp4`,
        duration:    seg.duration,
        size:        seg.size,
        downloadUrl: `${SERVER_URL}/download/${jobId}/${seg.name}`,
      }))

      setProgress(100, '✓ ALL PARTS READY TO SAVE!')
      await delay(700)
      status.value = 'done'

    } catch (err) {
      console.error('[VidSplit]', err)
      error.value  = err.message || String(err)
      status.value = 'error'
    } finally {
      try { wakeLock?.release() } catch (_) {}
    }
  }

  async function downloadSegment(index) {
    const seg = segments.value[index]
    if (!seg) return

    try {
      const response = await fetch(seg.downloadUrl)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const file = new File([blob], seg.name, { type: 'video/mp4' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: seg.name })
          return
        } catch (err) {
          if (err.name === 'AbortError') return
        }
      }

      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = seg.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[download]', err)
    }
  }

  async function downloadAll() {
    for (let i = 0; i < segments.value.length; i++) {
      await downloadSegment(i)
      await delay(600)
    }
    if (currentJobId) {
      fetch(`${SERVER_URL}/cleanup/${currentJobId}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  function reset() {
    segments.value    = []
    progressPct.value = 0
    progressMsg.value = ''
    status.value      = 'idle'
    currentJobId      = null
    error.value       = null
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
    DEFAULT_CHUNK_SEC,
  }
}

function fetchWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    })

    xhr.addEventListener('load', () => {
      resolve({
        ok:   xhr.status >= 200 && xhr.status < 300,
        json: () => Promise.resolve(JSON.parse(xhr.responseText)),
      })
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.send(formData)
  })
}

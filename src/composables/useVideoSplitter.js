import { ref, readonly } from 'vue'
import { delay } from '../utils/format'

export const DEFAULT_CHUNK_SEC = 240

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'
const CHUNK_SIZE  = 5 * 1024 * 1024 // 5MB chunks for resumable upload

export function useVideoSplitter() {
  const status      = ref('idle')
  const progressPct = ref(0)
  const progressMsg = ref('')
  const error       = ref(null)
  const segments    = ref([])

  let currentJobId = null

  function setProgress(pct, msg = null) {
    progressPct.value = Math.min(100, Math.round(pct))
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
      // ── Step 1: Get resumable upload URL from our server ──────────────────
      setProgress(0, 'PREPARING UPLOAD...')

      const urlRes = await fetch(`${SERVER_URL}/upload-url`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          filename:    file.name,
          contentType: file.type || 'video/mp4',
        }),
      })

      if (!urlRes.ok) {
        const err = await urlRes.json()
        throw new Error(err.error || 'Failed to get upload URL')
      }

      const { jobId, gcsInput, uploadUrl } = await urlRes.json()
      currentJobId = jobId

      // ── Step 2: Upload directly to GCS in chunks (resumable) ─────────────
      // Each chunk is 5MB — if the connection drops, GCS can resume
      setProgress(2, 'UPLOADING VIDEO...')
      await resumableUpload(file, uploadUrl, (pct) => {
        setProgress(2 + pct * 0.58, 'UPLOADING VIDEO...')
      })

      // ── Step 3: Tell server to process the uploaded file ──────────────────
      status.value = 'processing'
      setProgress(62, 'SPLITTING VIDEO...')

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

// ── Resumable chunked upload to GCS ──────────────────────────────────────────
// Uploads the file in 5MB pieces directly to GCS resumable upload URL.
// If a chunk fails it retries up to 3 times before giving up.
async function resumableUpload(file, uploadUrl, onProgress) {
  const totalSize = file.size
  let offset      = 0

  // Check if there's already progress on this upload (resume support)
  try {
    const checkRes = await fetch(uploadUrl, {
      method:  'PUT',
      headers: { 'Content-Range': `bytes */${totalSize}` },
    })
    if (checkRes.status === 308) {
      const range = checkRes.headers.get('Range')
      if (range) {
        offset = parseInt(range.split('-')[1]) + 1
        onProgress(offset / totalSize)
      }
    }
  } catch (_) { /* start from beginning */ }

  while (offset < totalSize) {
    const end   = Math.min(offset + CHUNK_SIZE, totalSize)
    const chunk = file.slice(offset, end)

    let attempts = 0
    let success  = false

    while (attempts < 3 && !success) {
      try {
        const res = await fetch(uploadUrl, {
          method:  'PUT',
          headers: {
            'Content-Range': `bytes ${offset}-${end - 1}/${totalSize}`,
            'Content-Type':  file.type || 'video/mp4',
          },
          body: chunk,
        })

        // 200/201 = complete, 308 = chunk accepted, more to come
        if (res.status === 200 || res.status === 201 || res.status === 308) {
          offset  = end
          success = true
          onProgress(offset / totalSize)
        } else {
          throw new Error(`Unexpected status ${res.status}`)
        }
      } catch (err) {
        attempts++
        if (attempts >= 3) throw new Error(`Upload failed after 3 attempts: ${err.message}`)
        await delay(1000 * attempts) // back off before retry
      }
    }
  }
}

/** Format seconds → M:SS */
export function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Format bytes → human-readable */
export function formatBytes(b) {
  if (b >= 1_073_741_824) return (b / 1_073_741_824).toFixed(1) + ' GB'
  if (b >= 1_048_576)     return (b / 1_048_576).toFixed(1)     + ' MB'
  return (b / 1024).toFixed(0) + ' KB'
}

/** Truncate filename */
export function shortenName(name, max = 28) {
  return name.length > max ? name.slice(0, max - 3) + '...' : name
}

/**
 * Calculate split chunks from a duration.
 * Returns array of { index, start, duration }
 */
export function calcChunks(totalSec, chunkSec = 240) {
  const count = Math.ceil(totalSec / chunkSec)
  return Array.from({ length: count }, (_, i) => ({
    index:    i + 1,
    start:    i * chunkSec,
    duration: Math.min(chunkSec, totalSec - i * chunkSec),
  }))
}

/** Sleep helper */
export const delay = (ms) => new Promise((r) => setTimeout(r, ms))

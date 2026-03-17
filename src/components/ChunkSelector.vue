<template>
  <Transition name="slide-down">
    <div v-if="show" class="chunk-selector">
      <span class="corner corner-tl" aria-hidden="true" />
      <span class="corner corner-br" aria-hidden="true" />

      <p class="section-title">&gt; CHOOSE YOUR CHUNK SIZE</p>

      <!-- Context message -->
      <p v-if="duration" class="context-msg">
        <span class="highlight">YOUR VIDEO IS {{ formattedDuration }} LONG</span>
        {{ contextMessage }}
      </p>

      <!-- Dropdown -->
      <Select
        v-model="selected"
        :options="availableOptions"
        option-label="label"
        option-value="seconds"
        option-group-label="group"
        option-group-children="items"
        :placeholder="'SELECT CHUNK SIZE'"
        class="platform-select"
        @change="onSelect"
      >
        <template #value="{ value }">
          <span v-if="value">
            {{ labelFor(value) }}
          </span>
          <span v-else class="placeholder-text">SELECT CHUNK SIZE</span>
        </template>

        <template #option="{ option }">
          <div class="option-row">
            <span class="option-icon">{{ option.icon }}</span>
            <span class="option-label">{{ option.label }}</span>
            <span class="option-time">{{ option.timeLabel }}</span>
          </div>
        </template>
      </Select>

      <!-- Preview of resulting chunks -->
      <div v-if="selected && duration && chunks.length" class="chunks-preview">
        <span class="preview-label">RESULT:</span>
        <span
          v-for="chunk in chunks"
          :key="chunk.index"
          class="chunk-badge"
        >
          P{{ chunk.index }}: {{ formatTime(chunk.duration) }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Select from 'primevue/select'
import { formatTime, calcChunks } from '../utils/format'

const props = defineProps({
  duration: { type: Number, default: null }, // seconds
  show:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:chunkSec'])

// ── Platform definitions ─────────────────────────────────────────────────────
const PLATFORMS = [
  { label: 'iMessage',            seconds: 240, icon: '💬', timeLabel: '4:00' },
  { label: 'Instagram Reels',     seconds: 180, icon: '📸', timeLabel: '3:00' },
  { label: 'YouTube Shorts',      seconds: 180, icon: '▶️',  timeLabel: '3:00' },
  { label: 'Facebook Reels',      seconds: 180, icon: '👥', timeLabel: '3:00' },
  { label: 'X / Twitter',         seconds: 140, icon: '🐦', timeLabel: '2:20' },
  { label: 'TikTok',              seconds: 60,  icon: '🎵', timeLabel: '1:00' },
  { label: 'Instagram Stories',   seconds: 60,  icon: '🔵', timeLabel: '1:00' },
  { label: 'WhatsApp Status',     seconds: 60,  icon: '💚', timeLabel: '1:00' },
  { label: 'Snapchat',            seconds: 60,  icon: '👻', timeLabel: '1:00' },
  { label: 'Facebook Stories',    seconds: 15,  icon: '👤', timeLabel: '0:15' },
]

// ── State ────────────────────────────────────────────────────────────────────
const selected = ref(null)

// ── Computed ─────────────────────────────────────────────────────────────────

// Only show platforms whose chunk size is <= video duration (or all if no duration yet)
const availableOptions = computed(() => {
  if (!props.duration) return PLATFORMS
  return PLATFORMS.filter(p => p.seconds <= props.duration)
})

const formattedDuration = computed(() => {
  if (!props.duration) return ''
  return formatTime(props.duration)
})

const contextMessage = computed(() => {
  if (!props.duration) return ''
  const d = props.duration
  if (d >= 240) return '— IMESSAGE (4 MIN) IS PRE-SELECTED. CHANGE BELOW FOR SOCIAL MEDIA.'
  if (d >= 180) return '— YOUR VIDEO FITS REELS / SHORTS. CHOOSE A PLATFORM BELOW.'
  if (d >= 60)  return '— YOUR VIDEO IS UNDER 3 MINS. CHOOSE A CHUNK SIZE BELOW.'
  return '— YOUR VIDEO IS SHORT. CHOOSE A SUITABLE CHUNK SIZE BELOW.'
})

const chunks = computed(() => {
  if (!selected.value || !props.duration) return []
  return calcChunks(props.duration, selected.value)
})

// ── Helpers ──────────────────────────────────────────────────────────────────
function labelFor(seconds) {
  const p = PLATFORMS.find(p => p.seconds === seconds)
  return p ? `${p.icon}  ${p.label}  —  ${p.timeLabel}` : `${formatTime(seconds)}`
}

// ── Smart default when duration is detected ──────────────────────────────────
watch(
  () => props.duration,
  (dur) => {
    if (!dur) return
    // iMessage if >=4min, else pick the largest platform that fits
    if (dur >= 240) {
      selected.value = 240
    } else {
      const best = availableOptions.value[0]
      selected.value = best ? best.seconds : availableOptions.value[availableOptions.value.length - 1]?.seconds ?? 60
    }
    emit('update:chunkSec', selected.value)
  },
  { immediate: true },
)

function onSelect() {
  emit('update:chunkSec', selected.value)
}
</script>

<style scoped>
.chunk-selector {
  border: 2px solid var(--vs-teal);
  padding: 20px;
  margin: 16px 0;
  background: rgba(162, 213, 198, 0.04);
  position: relative;
}

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
}
.corner-tl {
  top: -2px; left: -2px;
  border-top: 2px solid var(--vs-mint);
  border-left: 2px solid var(--vs-mint);
}
.corner-br {
  bottom: -2px; right: -2px;
  border-bottom: 2px solid var(--vs-mint);
  border-right: 2px solid var(--vs-mint);
}

.section-title {
  font-size: 8px;
  color: var(--vs-teal);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(162, 213, 198, 0.25);
}

.context-msg {
  font-size: 7px;
  color: var(--vs-teal);
  line-height: 2;
  margin-bottom: 14px;
  opacity: 0.9;
}

.highlight {
  color: var(--vs-mint);
}

/* ── PrimeVue Select overrides ── */
.platform-select {
  width: 100%;
  font-family: var(--vs-font) !important;
  font-size: 7px !important;
  border-radius: 0 !important;
  background: rgba(0, 0, 0, 0.6) !important;
  border: 2px solid rgba(162, 213, 198, 0.4) !important;
  color: var(--vs-mint) !important;
  transition: border-color 0.2s;
}

.platform-select:hover,
.platform-select.p-focus {
  border-color: var(--vs-mint) !important;
}

/* Override PrimeVue Select internals */
.platform-select :deep(.p-select-label) {
  font-family: var(--vs-font) !important;
  font-size: 7px !important;
  color: var(--vs-mint) !important;
  padding: 10px 12px !important;
}

.platform-select :deep(.p-select-dropdown) {
  color: var(--vs-teal) !important;
}

.platform-select :deep(.p-select-overlay) {
  border-radius: 0 !important;
  background: #050505 !important;
  border: 2px solid var(--vs-teal) !important;
  box-shadow: 4px 4px 0 rgba(162, 213, 198, 0.2) !important;
}

.platform-select :deep(.p-select-option) {
  font-family: var(--vs-font) !important;
  font-size: 6.5px !important;
  color: var(--vs-teal) !important;
  border-radius: 0 !important;
  padding: 8px 12px !important;
  transition: background 0.15s, color 0.15s;
}

.platform-select :deep(.p-select-option:hover),
.platform-select :deep(.p-select-option-selected) {
  background: rgba(207, 255, 226, 0.1) !important;
  color: var(--vs-mint) !important;
}

.placeholder-text {
  color: rgba(162, 213, 198, 0.45);
  font-size: 7px;
}

/* Option row layout */
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.option-icon  { flex-shrink: 0; font-size: 10px; }
.option-label { flex: 1; }
.option-time  {
  color: var(--vs-mint);
  flex-shrink: 0;
  opacity: 0.8;
}

/* Chunk preview badges */
.chunks-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(162, 213, 198, 0.15);
}

.preview-label {
  font-size: 6px;
  color: var(--vs-teal);
  margin-right: 4px;
  flex-shrink: 0;
}

.chunk-badge {
  display: inline-block;
  background: var(--vs-mint);
  color: #000000;
  font-family: var(--vs-font);
  font-size: 6px;
  padding: 3px 7px;
}

/* Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

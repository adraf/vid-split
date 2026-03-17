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
        :options="dropdownOptions"
        option-label="label"
        option-value="id"
        :placeholder="'SELECT CHUNK SIZE'"
        class="platform-select"
        @change="onSelect"
      >
        <template #value="{ value }">
          <div v-if="value" class="selected-value">
            <img
              :src="iconFor(value)"
              class="option-icon-img"
              :alt="labelFor(value)"
            />
            <span>{{ labelFor(value) }}</span>
          </div>
          <span v-else class="placeholder-text">SELECT CHUNK SIZE</span>
        </template>

        <template #option="{ option }">
          <div class="option-row">
            <img
              :src="option.icon"
              class="option-icon-img"
              :alt="option.label"
            />
            <span class="option-label">{{ option.label }}</span>
            <span class="option-time">{{ option.timeLabel }}</span>
          </div>
        </template>
      </Select>

      <!-- Custom time picker — shown when "custom" is selected -->
      <Transition name="fade">
        <div v-if="selected === 'custom'" class="custom-picker">
          <p class="custom-label">&gt; SELECT CUSTOM CHUNK LENGTH</p>
          <div class="time-inputs">
            <div class="time-field">
              <label class="field-label">MINS</label>
              <select
                v-model.number="customMins"
                class="time-select"
                @change="onCustomChange"
              >
                <option
                  v-for="m in minsOptions"
                  :key="m"
                  :value="m"
                >{{ String(m).padStart(2, '0') }}</option>
              </select>
            </div>
            <span class="time-sep">:</span>
            <div class="time-field">
              <label class="field-label">SECS</label>
              <select
                v-model.number="customSecs"
                class="time-select"
                @change="onCustomChange"
              >
                <option
                  v-for="s in secsOptions"
                  :key="s"
                  :value="s"
                >{{ String(s).padStart(2, '0') }}</option>
              </select>
            </div>
            <span v-if="customError" class="custom-error">{{ customError }}</span>
          </div>
        </div>
      </Transition>

      <!-- Chunk preview badges -->
      <div v-if="chunks.length" class="chunks-preview">
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
  duration: { type: Number, default: null },
  show:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:chunkSec'])

// ── Platform definitions ─────────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'imessage',          label: 'iMessage',          seconds: 240, icon: '/icons8/icons8-imessage.png',  timeLabel: '4:00' },
  { id: 'instagram-reels',   label: 'Instagram Reels',   seconds: 180, icon: '/icons8/icons8-instagram.png', timeLabel: '3:00' },
  { id: 'youtube-shorts',    label: 'YouTube Shorts',    seconds: 180, icon: '/icons8/icons8-youtube.png',   timeLabel: '3:00' },
  { id: 'facebook-reels',    label: 'Facebook Reels',    seconds: 180, icon: '/icons8/icons8-facebook.png',  timeLabel: '3:00' },
  { id: 'x-twitter',         label: 'X / Twitter',       seconds: 140, icon: '/icons8/icons8-x.png',         timeLabel: '2:20' },
  { id: 'tiktok',            label: 'TikTok',            seconds: 60,  icon: '/icons8/icons8-tiktok.png',    timeLabel: '1:00' },
  { id: 'instagram-stories', label: 'Instagram Stories', seconds: 60,  icon: '/icons8/icons8-instagram.png', timeLabel: '1:00' },
  { id: 'whatsapp',          label: 'WhatsApp Status',   seconds: 60,  icon: '/icons8/icons8-whatsapp.png',  timeLabel: '1:00' },
  { id: 'snapchat',          label: 'Snapchat',          seconds: 60,  icon: '/icons8/icons8-snapchat.png',  timeLabel: '1:00' },
  { id: 'facebook-stories',  label: 'Facebook Stories',  seconds: 15,  icon: '/icons8/icons8-facebook.png',  timeLabel: '0:15' },
]

const CUSTOM_OPTION = {
  id: 'custom', label: 'Custom', seconds: null, icon: '/icons8/icons8-custom.png', timeLabel: '...',
}

// ── State ────────────────────────────────────────────────────────────────────
const selected    = ref(null)
const customMins  = ref(0)
const customSecs  = ref(0)
const customError = ref('')

// ── Computed ─────────────────────────────────────────────────────────────────
const availablePlatforms = computed(() =>
  !props.duration
    ? PLATFORMS
    : PLATFORMS.filter(p => p.seconds < props.duration)
)

const dropdownOptions = computed(() => [
  ...availablePlatforms.value,
  CUSTOM_OPTION,
])

const formattedDuration = computed(() =>
  props.duration ? formatTime(props.duration) : ''
)

const contextMessage = computed(() => {
  if (!props.duration) return ''
  const d = props.duration
  if (d >= 240) return '— IMESSAGE (4 MIN) IS PRE-SELECTED. CHANGE BELOW FOR SOCIAL MEDIA.'
  if (d >= 180) return '— YOUR VIDEO FITS REELS / SHORTS. CHOOSE A PLATFORM BELOW.'
  if (d >= 60)  return '— YOUR VIDEO IS UNDER 3 MINS. CHOOSE A CHUNK SIZE BELOW.'
  return '— YOUR VIDEO IS SHORT. CHOOSE A SUITABLE CHUNK SIZE BELOW.'
})

const maxCustomMins = computed(() =>
  props.duration ? Math.floor(props.duration / 60) : 99
)

// Generate minute options: 0 up to maxCustomMins
const minsOptions = computed(() => {
  const max = maxCustomMins.value
  return Array.from({ length: max + 1 }, (_, i) => i)
})

// Generate seconds options: 0–59, but if mins == maxCustomMins
// cap secs to just below the remaining fractional seconds
const secsOptions = computed(() => {
  if (!props.duration) return Array.from({ length: 60 }, (_, i) => i)
  const maxSec = customMins.value >= maxCustomMins.value
    ? Math.max(0, Math.floor(props.duration % 60) - 1)
    : 59
  return Array.from({ length: maxSec + 1 }, (_, i) => i)
})

const activeChunkSec = computed(() => {
  if (selected.value === 'custom') {
    const total = (Number(customMins.value) || 0) * 60 + (Number(customSecs.value) || 0)
    return total > 0 ? total : null
  }
  return PLATFORMS.find(p => p.id === selected.value)?.seconds ?? null
})

const chunks = computed(() => {
  if (!activeChunkSec.value || !props.duration) return []
  if (activeChunkSec.value >= props.duration) return []
  return calcChunks(props.duration, activeChunkSec.value)
})

// ── Helpers ──────────────────────────────────────────────────────────────────
function labelFor(id) {
  if (id === 'custom') {
    const total = (Number(customMins.value) || 0) * 60 + (Number(customSecs.value) || 0)
    return total > 0 ? `Custom  —  ${formatTime(total)}` : 'Custom'
  }
  const p = PLATFORMS.find(p => p.id === id)
  return p ? `${p.label}  —  ${p.timeLabel}` : id
}

function iconFor(id) {
  if (id === 'custom') return '/icons8/icons8-custom.png'
  return PLATFORMS.find(p => p.id === id)?.icon ?? null
}

function validateCustom() {
  const total = (Number(customMins.value) || 0) * 60 + (Number(customSecs.value) || 0)
  if (total <= 0) {
    customError.value = 'MUST BE GREATER THAN 0'
    return false
  }
  if (props.duration && total >= props.duration) {
    customError.value = `MUST BE LESS THAN ${formattedDuration.value}`
    return false
  }
  customError.value = ''
  return true
}

// ── Smart default ─────────────────────────────────────────────────────────────
watch(() => props.duration, (dur) => {
  if (!dur) return
  if (dur >= 240) {
    selected.value = 'imessage'
  } else {
    const best = availablePlatforms.value[0]
    selected.value = best ? best.id : 'custom'
  }
  emitCurrent()
}, { immediate: true })

// ── Handlers ─────────────────────────────────────────────────────────────────
function onSelect() {
  if (selected.value === 'custom') {
    if (props.duration) {
      const half = Math.floor(props.duration / 2)
      customMins.value = Math.floor(half / 60)
      customSecs.value = half % 60
    } else {
      customMins.value = 1
      customSecs.value = 0
    }
  }
  customError.value = ''
  emitCurrent()
}

function onCustomChange() {
  if (customSecs.value > 59) customSecs.value = 59
  if (customSecs.value < 0)  customSecs.value = 0
  if (validateCustom()) emitCurrent()
}

function emitCurrent() {
  const sec = activeChunkSec.value
  if (sec && sec > 0) emit('update:chunkSec', sec)
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

.corner { position: absolute; width: 12px; height: 12px; }
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
  line-height: 2.2;
  margin-bottom: 14px;
  opacity: 0.9;
  word-break: break-word;
}

.highlight { color: var(--vs-mint); }

/* ── PrimeVue Select ── */
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
  max-width: calc(100vw - 48px) !important;
  width: 100% !important;
  left: 0 !important;
  box-sizing: border-box !important;
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

/* Option row */
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}
.selected-value {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.option-icon-img {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  object-fit: contain;
  filter: invert(1) sepia(1) saturate(2) hue-rotate(100deg) brightness(1.2);
  opacity: 0.85;
}
.option-icon-placeholder {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.option-time {
  color: var(--vs-mint);
  flex-shrink: 0;
  opacity: 0.8;
}

/* ── Custom time picker ── */
.custom-picker {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(162, 213, 198, 0.2);
}

.custom-label {
  font-size: 7px;
  color: var(--vs-teal);
  margin-bottom: 12px;
}

.time-inputs {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--vs-font);
  font-size: 6px;
  color: var(--vs-teal);
  letter-spacing: 1px;
}

.time-select {
  width: 64px;
  padding: 8px 6px;
  font-family: var(--vs-font);
  font-size: 10px;
  color: var(--vs-mint);
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(162, 213, 198, 0.4);
  border-radius: 0;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  /* Remove default arrow on desktop */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.time-select:focus {
  outline: none;
  border-color: var(--vs-mint);
}
.time-select option {
  background: #050505;
  color: var(--vs-mint);
  font-family: var(--vs-font);
}

.time-sep {
  font-family: var(--vs-font);
  font-size: 16px;
  color: var(--vs-teal);
  padding-bottom: 6px;
}

.custom-error {
  font-family: var(--vs-font);
  font-size: 6px;
  color: #ff7070;
  align-self: flex-end;
  padding-bottom: 8px;
}

/* ── Chunk preview badges ── */
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

/* ── Mobile ── */
@media (max-width: 540px) {
  .chunk-selector { padding: 14px; }
  .section-title  { font-size: 6px; }
  .context-msg    { font-size: 6px; line-height: 2; }
  .custom-label   { font-size: 6px; }

  .platform-select :deep(.p-select-label) {
    font-size: 6px !important;
    padding: 8px 10px !important;
  }
  .platform-select :deep(.p-select-option) {
    font-size: 6px !important;
    padding: 7px 10px !important;
  }
  .option-icon-img,
  .option-icon-placeholder { width: 14px; height: 14px; }
  .time-select { width: 54px; font-size: 9px; }
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

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

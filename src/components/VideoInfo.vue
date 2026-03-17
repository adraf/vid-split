<template>
  <Transition name="slide-down">
    <div v-if="file" class="video-info">
      <!-- Corner accents -->
      <span class="corner corner-tl" aria-hidden="true" />
      <span class="corner corner-br" aria-hidden="true" />

      <p class="section-title">&gt; FILE DETECTED</p>

      <div class="info-row">
        <span class="label">FILE</span>
        <span class="value">{{ shortenName(file.name) }}</span>
      </div>

      <div class="info-row">
        <span class="label">SIZE</span>
        <span class="value">{{ formatBytes(file.size) }}</span>
      </div>

      <div class="info-row">
        <span class="label">DURATION</span>
        <span class="value">{{ durationLabel }}</span>
      </div>

      <div class="info-row info-row--chunks">
        <span class="label">CHUNKS</span>
        <span class="chunks-wrap">
          <Tag
            v-for="chunk in chunks"
            :key="chunk.index"
            :value="`P${chunk.index}: ${formatTime(chunk.duration)}`"
            severity="primary"
            class="chunk-tag"
          />
          <span v-if="!chunks.length" class="pending">WILL CALCULATE ON PROCESS</span>
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { formatTime, formatBytes, shortenName, calcChunks } from '../utils/format'

const props = defineProps({
  file:     { type: File,   default: null },
  duration: { type: Number, default: null },
  chunkSec: { type: Number, default: 240  },
})

const durationLabel = computed(() =>
  props.duration && isFinite(props.duration)
    ? formatTime(props.duration)
    : 'DETECTING...'
)

const chunks = computed(() =>
  props.duration && isFinite(props.duration) && props.duration > 0
    ? calcChunks(props.duration, props.chunkSec)
    : []
)
</script>

<style scoped>
.video-info {
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
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(162, 213, 198, 0.25);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px 0;
  font-size: 7px;
  gap: 12px;
}

.info-row--chunks { align-items: flex-start; }

.label { color: var(--vs-teal); flex-shrink: 0; }

.value {
  color: var(--vs-white);
  text-align: right;
  word-break: break-all;
}

.chunks-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}

/* Extra sizing fixes since global applies font; nudge tag size here */
.chunk-tag :deep(.p-tag-label) {
  font-size: 0.38rem !important;
}

.pending {
  font-size: 6px;
  color: var(--vs-teal);
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

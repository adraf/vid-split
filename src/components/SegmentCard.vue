<template>
  <Card class="segment-card">
    <template #content>
      <div class="card-inner">
        <p class="part-label">PART {{ segment.index }}</p>
        <p class="file-name">{{ segment.name }}</p>
        <div class="meta">
          <span>⏱ {{ formatTime(segment.duration) }}</span>
          <span>💾 {{ formatBytes(segment.size) }}</span>
        </div>
        <Button
          label="⬇  SAVE"
          severity="secondary"
          outlined
          class="save-btn"
          @click="$emit('save')"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card   from 'primevue/card'
import Button from 'primevue/button'
import { formatTime, formatBytes } from '../utils/format'

defineProps({
  segment: { type: Object, required: true },
})
defineEmits(['save'])
</script>

<style scoped>
.segment-card {
  /* Square via aspect-ratio */
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
}

/* Make PrimeVue Card fill the square and stretch body */
.segment-card :deep(.p-card-body) {
  height: 100%;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
}

.segment-card :deep(.p-card-content) {
  flex: 1;
  padding: 0 !important;
}

/* Inner layout — centred column */
.card-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 12px;
  text-align: center;
}

.part-label {
  font-size: 11px;
  color: var(--vs-mint);
  letter-spacing: 2px;
}

.file-name {
  font-size: 6px;
  color: var(--vs-teal);
  word-break: break-all;
  line-height: 1.8;
  opacity: 0.8;
  max-width: 100%;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 9px;
  color: var(--vs-mint);
  line-height: 1.6;
}

.save-btn {
  width: 100%;
  font-size: 7px !important;
  letter-spacing: 0.5px;
  margin-top: 4px;
  color: rgba(207, 255, 226, 0.55) !important;
  border-color: rgba(207, 255, 226, 0.35) !important;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease !important;
}

.save-btn:hover {
  color: var(--vs-mint) !important;
  border-color: var(--vs-mint) !important;
  background: rgba(207, 255, 226, 0.08) !important;
}
</style>

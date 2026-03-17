<template>
  <Card class="segment-card">
    <template #title>
      PART {{ segment.index }} — {{ segment.name }}
    </template>
    <template #subtitle>
      ⏱ &nbsp;{{ formatTime(segment.duration) }}&nbsp;&nbsp;&nbsp;
      💾 &nbsp;{{ formatBytes(segment.size) }}
    </template>
    <template #footer>
      <Button
        label="⬇  SAVE"
        severity="secondary"
        outlined
        class="save-btn"
        @click="$emit('save')"
      />
    </template>
  </Card>
</template>

<script setup>
import Card   from 'primevue/card'
import Button from 'primevue/button'
import { formatTime, formatBytes } from '../utils/format'

defineProps({
  segment: { type: Object, required: true },
  // { index, name, url, size, duration }
})
defineEmits(['save'])
</script>

<style scoped>
.segment-card {
  margin: 10px 0;
}

/* Title overflow handling */
.segment-card :deep(.p-card-title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.5rem !important;
}

.save-btn {
  font-size: 7px !important;
  letter-spacing: 0.5px;
  color: rgba(207, 255, 226, 0.55) !important;
  border-color: rgba(207, 255, 226, 0.35) !important;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease !important;
}

.save-btn:hover {
  color: var(--vs-mint) !important;
  border-color: var(--vs-mint) !important;
  background: rgba(207, 255, 226, 0.08) !important;
}

@media (max-width: 480px) {
  .save-btn { width: 100%; }
}
</style>

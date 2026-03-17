<template>
  <Card class="segment-card">
    <template #content>
      <div class="card-inner">
        <p class="part-label">PART {{ segment.index }}</p>
        <p class="file-name">{{ segment.name }}</p>
        <div class="meta">
          <span class="meta-item">
            <img :src="'/icons8/icons8-time.png'" class="meta-icon" alt="duration" />
            {{ formatTime(segment.duration) }}
          </span>
          <span class="meta-item">
            <img :src="'/icons8/icons8-file.png'" class="meta-icon" alt="size" />
            {{ formatBytes(segment.size) }}
          </span>
        </div>
        <button class="save-btn" @click="$emit('save')">
          <img :src="'/icons8/icons8-save.png'" class="btn-icon" alt="" />
          SAVE
        </button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import { formatTime, formatBytes } from '../utils/format'

defineProps({
  segment: { type: Object, required: true },
})
defineEmits(['save'])
</script>

<style scoped>
.segment-card {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 540px) {
  .segment-card {
    aspect-ratio: unset;
    min-height: 130px;
  }

  .card-inner {
    padding: 12px !important;
    gap: 7px !important;
  }

  .part-label {
    font-size: 9px !important;
  }

  .meta {
    flex-direction: row !important;
    gap: 12px !important;
    font-size: 8px !important;
  }
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

.meta-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  flex-shrink: 0;
  filter: invert(1) sepia(1) saturate(2) hue-rotate(100deg) brightness(1.2);
  opacity: 0.8;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 9px 12px;
  margin-top: 4px;
  font-family: var(--vs-font);
  font-size: 7px;
  letter-spacing: 0.5px;
  background: transparent;
  color: rgba(207, 255, 226, 0.55);
  border: 2px solid rgba(207, 255, 226, 0.35);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.save-btn .btn-icon {
  width: 13px;
  height: 13px;
  object-fit: contain;
  flex-shrink: 0;
  filter: invert(1) sepia(1) saturate(2) hue-rotate(100deg) brightness(1.2);
  opacity: 0.55;
  transition: opacity 0.2s;
}

.save-btn:hover {
  color: var(--vs-mint);
  border-color: var(--vs-mint);
  background: rgba(207, 255, 226, 0.08);
}

.save-btn:hover .btn-icon {
  opacity: 1;
}
</style>

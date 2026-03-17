<template>
  <Transition name="slide-up">
    <div v-if="segments.length" class="output-section">

      <!-- Header row -->
      <div class="output-title">
        <span class="tick">✓</span> SPLIT COMPLETE
      </div>

      <!-- Action buttons pinned at top -->
      <div class="top-actions">
        <button class="top-btn save-all-btn" @click="$emit('save-all')">
          <img :src="'/icons8/icons8-save.png'" class="btn-icon" alt="" />
          SAVE ALL CLIPS
        </button>
        <button class="top-btn reset-btn" @click="$emit('reset')">
          <img :src="'/icons8/icons8-restart.png'" class="btn-icon" alt="" />
          SPLIT ANOTHER
        </button>
      </div>

      <Divider />

      <!-- 2-column square grid -->
      <TransitionGroup name="card-list" tag="div" class="segments-grid">
        <SegmentCard
          v-for="(seg, i) in segmentsWithIndex"
          :key="seg.name"
          :segment="seg"
          @save="$emit('save-segment', i)"
        />
      </TransitionGroup>

    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import Divider     from 'primevue/divider'
import SegmentCard from './SegmentCard.vue'

const props = defineProps({
  segments: { type: Array, default: () => [] },
})
defineEmits(['save-segment', 'save-all', 'reset'])

const segmentsWithIndex = computed(() =>
  props.segments.map((s, i) => ({ ...s, index: i + 1 }))
)
</script>

<style scoped>
.output-section { margin: 20px 0; }

.output-title {
  font-size: 9px;
  color: var(--vs-mint);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vs-mint);
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}
.tick { color: var(--vs-teal); flex-shrink: 0; }

@media (max-width: 540px) {
  .output-title { font-size: 6px; gap: 6px; }
}

/* ── Top action buttons ── */
.top-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
}

.top-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 10px;
  font-family: var(--vs-font);
  font-size: 9px;
  letter-spacing: 1px;
  cursor: pointer;
  border: none;
  transition: transform 0.08s, box-shadow 0.08s, background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.save-all-btn {
  background: var(--vs-mint);
  color: #000000;
  box-shadow: 4px 4px 0 var(--vs-teal);
}
.save-all-btn .btn-icon {
  /* black icon on mint bg — no filter needed */
}
.save-all-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--vs-teal);
}
.save-all-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--vs-teal);
}

.reset-btn {
  background: transparent;
  color: rgba(162, 213, 198, 0.5);
  border: 2px solid rgba(162, 213, 198, 0.35) !important;
  box-shadow: 3px 3px 0 rgba(162, 213, 198, 0.2);
}
.reset-btn .btn-icon {
  filter: invert(1) sepia(1) saturate(2) hue-rotate(100deg) brightness(1.2);
  opacity: 0.5;
  transition: opacity 0.15s;
}
.reset-btn:hover {
  color: var(--vs-teal);
  border-color: var(--vs-teal) !important;
  background: rgba(162, 213, 198, 0.08);
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 rgba(162, 213, 198, 0.3);
}
.reset-btn:hover .btn-icon {
  opacity: 1;
}

/* ── Grid: 2-col squares on desktop, 1-col short rectangles on mobile ── */
.segments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* TransitionGroup */
.card-list-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.card-list-enter-from   { opacity: 0; transform: translateY(12px); }

/* Page transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 540px) {
  .output-title { font-size: 7px; }
  .save-all-btn,
  .reset-btn    { font-size: 7px !important; letter-spacing: 0.5px; }
  .top-actions  { gap: 8px; }
  /* Single column short rectangles on mobile */
  .segments-grid {
    grid-template-columns: 1fr;
  }
}
</style>

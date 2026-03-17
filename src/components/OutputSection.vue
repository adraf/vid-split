<template>
  <Transition name="slide-up">
    <div v-if="segments.length" class="output-section">

      <!-- Header row -->
      <div class="output-title">
        <span class="tick">✓</span> SPLIT COMPLETE
      </div>

      <!-- Action buttons pinned at top -->
      <div class="top-actions">
        <Button
          label="⬇  SAVE ALL CLIPS"
          severity="primary"
          class="save-all-btn"
          @click="$emit('save-all')"
        />
        <Button
          label="↺  SPLIT ANOTHER"
          severity="secondary"
          outlined
          class="reset-btn"
          @click="$emit('reset')"
        />
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
import Button      from 'primevue/button'
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
}
.tick { color: var(--vs-teal); }

/* ── Top action buttons ── */
.top-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
}

.save-all-btn {
  flex: 1;
  font-size: 9px !important;
  letter-spacing: 1px;
  box-shadow: 4px 4px 0 var(--vs-teal) !important;
}
.save-all-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px) !important;
  box-shadow: 6px 6px 0 var(--vs-teal) !important;
}

.reset-btn {
  flex: 1;
  font-size: 9px !important;
  letter-spacing: 1px;
  color: rgba(162, 213, 198, 0.5) !important;
  border-color: rgba(162, 213, 198, 0.35) !important;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease !important;
}
.reset-btn:hover {
  color: var(--vs-teal) !important;
  border-color: var(--vs-teal) !important;
  background: rgba(162, 213, 198, 0.08) !important;
  transform: translate(-1px, -1px) !important;
  box-shadow: 3px 3px 0 rgba(162, 213, 198, 0.3) !important;
}

/* ── 2-column square grid ── */
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

@media (max-width: 400px) {
  .top-actions { flex-direction: column; }
  .segments-grid { grid-template-columns: 1fr; }
}
</style>

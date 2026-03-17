<template>
  <Transition name="slide-up">
    <div v-if="segments.length" class="output-section">
      <div class="output-title">
        <span class="tick">✓</span> SPLIT COMPLETE
      </div>

      <TransitionGroup name="card-list" tag="div">
        <SegmentCard
          v-for="(seg, i) in segmentsWithIndex"
          :key="seg.name"
          :segment="seg"
          @save="$emit('save-segment', i)"
        />
      </TransitionGroup>

      <Divider />

      <Button
        label="⬇  SAVE ALL CLIPS"
        severity="primary"
        class="save-all-btn"
        @click="$emit('save-all')"
      />
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import Button     from 'primevue/button'
import Divider    from 'primevue/divider'
import SegmentCard from './SegmentCard.vue'

const props = defineProps({
  segments: { type: Array, default: () => [] },
})
defineEmits(['save-segment', 'save-all'])

const segmentsWithIndex = computed(() =>
  props.segments.map((s, i) => ({ ...s, index: i + 1 }))
)
</script>

<style scoped>
.output-section { margin: 20px 0; }

.output-title {
  font-size: 9px;
  color: var(--vs-mint);
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vs-mint);
  display: flex;
  align-items: center;
  gap: 10px;
}
.tick { color: var(--vs-teal); }

.save-all-btn {
  font-size: 9px !important;
  letter-spacing: 1px;
  box-shadow: 5px 5px 0 var(--vs-teal) !important;
}
.save-all-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px) !important;
  box-shadow: 7px 7px 0 var(--vs-teal) !important;
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
</style>

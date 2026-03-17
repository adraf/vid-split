<template>
  <Transition name="fade">
    <div v-if="visible" class="progress-wrap">
      <p class="progress-label">&gt; COMPRESSING + SPLITTING</p>

      <ProgressBar
        :value="pct"
        :show-value="false"
        class="vs-progressbar"
      />

      <div class="progress-status">
        <span class="status-text">{{ msg }}</span>
        <span class="pct-label">{{ pct }}%</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import ProgressBar from 'primevue/progressbar'

defineProps({
  visible: { type: Boolean, default: false },
  pct:     { type: Number,  default: 0 },
  msg:     { type: String,  default: 'INITIALISING...' },
})
</script>

<style scoped>
.progress-wrap {
  border: 2px solid rgba(162, 213, 198, 0.3);
  padding: 20px;
  margin: 20px 0;
  background: rgba(162, 213, 198, 0.03);
}

.progress-label {
  font-size: 8px;
  color: var(--vs-teal);
  margin-bottom: 14px;
}

/* Animated ellipsis */
.progress-label::after {
  content: '';
  animation: dots 1.2s steps(4, end) infinite;
}
@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
  100% { content: ''; }
}

.progress-status {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 7px;
  min-height: 18px;
}

.status-text { color: var(--vs-white); }
.pct-label   { color: var(--vs-mint); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

<template>
  <button
    class="split-btn"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <img :src="'/icons8/icons8-play.png'" class="btn-icon" alt="" />
    SPLIT VIDEO
  </button>
</template>

<script setup>
defineProps({ disabled: { type: Boolean, default: false } })
defineEmits(['click'])
</script>

<style scoped>
.split-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  font-family: var(--vs-font);
  font-size: 10px;
  letter-spacing: 1px;
  background: var(--vs-mint);
  color: var(--black, #000);
  box-shadow: 4px 4px 0 var(--vs-teal);
  transition: transform 0.08s, box-shadow 0.08s;
  margin: 10px 0;
  border: none;
  cursor: pointer;
}

.split-btn:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--vs-teal);
}

.split-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--vs-teal);
}

.split-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
  /* Black icon on mint background — no invert needed */
}
</style>

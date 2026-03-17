<template>
  <Button
    label="▶  SPLIT VIDEO"
    severity="primary"
    :disabled="disabled"
    class="split-btn"
    @click="$emit('click')"
  />
</template>

<script setup>
import Button from 'primevue/button'

defineProps({ disabled: { type: Boolean, default: false } })
defineEmits(['click'])
</script>

<style scoped>
.split-btn {
  margin: 10px 0;
  font-size: 10px !important;
  letter-spacing: 1px !important;
}
</style>

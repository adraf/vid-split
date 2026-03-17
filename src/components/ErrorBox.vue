<template>
  <Transition name="fade">
    <Message
      v-if="message"
      severity="error"
      :closable="false"
      class="error-message"
    >
      {{ message }}
    </Message>
  </Transition>
</template>

<script setup>
import Message from 'primevue/message'

defineProps({ message: { type: String, default: null } })
</script>

<style scoped>
.error-message {
  margin: 14px 0;
}

/* Ensure pre-wrap for multi-line errors */
.error-message :deep(.p-message-text) {
  white-space: pre-wrap;
  font-size: 0.44rem !important;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

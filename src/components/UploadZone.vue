<template>
  <div
    class="upload-zone"
    :class="{ 'drag-over': isDragging }"
    role="button"
    tabindex="0"
    aria-label="Upload video file"
    @click="triggerInput"
    @keydown.enter.space.prevent="triggerInput"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
  >
    <span class="upload-icon" aria-hidden="true">📼</span>
    <p class="upload-text">DROP VIDEO HERE</p>
    <p class="upload-sub">
      MP4 &nbsp;·&nbsp; MOV &nbsp;·&nbsp; HEVC &nbsp;·&nbsp; M4V &nbsp;·&nbsp; AND MORE<br />
      DRAG &amp; DROP &nbsp;·&nbsp; OR TAP TO SELECT
    </p>
  </div>

  <input
    ref="inputRef"
    type="file"
    accept="video/*,.mov,.hevc,.m4v"
    class="sr-only"
    @change="onFileChange"
  />
</template>

<script setup>
import { ref } from 'vue'

const emit     = defineEmits(['file-selected'])
const inputRef = ref(null)
const isDragging = ref(false)

function triggerInput() { inputRef.value?.click() }

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) emit('file-selected', file)
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('file-selected', file)
}
</script>

<style scoped>
.upload-zone {
  border: 3px solid var(--vs-mint);
  padding: 44px 24px;
  text-align: center;
  cursor: pointer;
  margin: 20px 0;
  transition: background 0.2s, box-shadow 0.2s;
  background: rgba(207, 255, 226, 0.02);
  clip-path: polygon(
    0 8px, 8px 8px, 8px 0,
    calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px,
    100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%,
    8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px)
  );
}

.upload-zone:hover,
.upload-zone.drag-over {
  background: rgba(207, 255, 226, 0.07);
  box-shadow:
    0 0 30px rgba(207, 255, 226, 0.12),
    inset 0 0 30px rgba(207, 255, 226, 0.04);
}

.upload-icon {
  font-size: 38px;
  display: block;
  margin-bottom: 18px;
  filter: drop-shadow(0 0 8px rgba(207, 255, 226, 0.4));
}

.upload-text {
  font-size: clamp(8px, 2.5vw, 11px);
  color: var(--vs-mint);
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.upload-sub {
  font-size: 7px;
  color: var(--vs-teal);
  line-height: 2.2;
  opacity: 0.85;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>

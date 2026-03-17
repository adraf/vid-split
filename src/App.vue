<template>
  <div class="page">
    <div class="container">

      <AppHeader />

      <!-- Upload zone — hidden while processing or done -->
      <UploadZone
        v-if="status === 'idle' || status === 'error'"
        @file-selected="onFileSelected"
      />

      <!-- File info + chunk preview -->
      <VideoInfo
        v-if="currentFile"
        :file="currentFile"
        :duration="duration"
        :chunk-sec="chunkSec"
        :style="{ opacity: isProcessing ? 0.4 : 1, transition: 'opacity 0.3s' }"
      />

      <!-- Platform / chunk size selector -->
      <ChunkSelector
        :show="!!currentFile && !isProcessing && status !== 'done'"
        :duration="duration"
        @update:chunk-sec="chunkSec = $event"
      />

      <!-- Error display -->
      <ErrorBox :message="error" />

      <!-- Split CTA -->
      <SplitButton
        v-if="!isProcessing && status !== 'done'"
        :disabled="!currentFile || !chunkSec"
        @click="startSplit"
      />

      <!-- Progress -->
      <ProgressBar
        :visible="isProcessing"
        :pct="progressPct"
        :msg="progressMsg"
      />

      <!-- Output segments -->
      <OutputSection
        :segments="segments"
        @save-segment="downloadSegment"
        @save-all="handleSaveAll"
      />

      <!-- Reset -->
      <Transition name="fade">
        <Button
          v-if="status === 'done' || status === 'error'"
          label="↺  SPLIT ANOTHER VIDEO"
          severity="secondary"
          outlined
          class="reset-btn"
          @click="resetAll"
        />
      </Transition>

      <AppFooter />

    </div>

    <!-- Toast lives at root so it overlays everything -->
    <Toast position="bottom-center" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast  from 'primevue/toast'

import { useVideoSplitter } from './composables/useVideoSplitter'
import { DEFAULT_CHUNK_SEC } from './composables/useVideoSplitter'
import AppHeader      from './components/AppHeader.vue'
import AppFooter      from './components/AppFooter.vue'
import UploadZone     from './components/UploadZone.vue'
import VideoInfo      from './components/VideoInfo.vue'
import ChunkSelector  from './components/ChunkSelector.vue'
import ErrorBox       from './components/ErrorBox.vue'
import SplitButton    from './components/SplitButton.vue'
import ProgressBar    from './components/ProgressBar.vue'
import OutputSection  from './components/OutputSection.vue'

// ── Composable ───────────────────────────────────────────────────────────────
const {
  status, progressPct, progressMsg, error, segments,
  split, downloadSegment, downloadAll, reset,
} = useVideoSplitter()

const toast = useToast()

// ── Local state ──────────────────────────────────────────────────────────────
const currentFile = ref(null)
const duration    = ref(null)
const chunkSec    = ref(DEFAULT_CHUNK_SEC)

const isProcessing = computed(() =>
  status.value === 'loading' || status.value === 'processing'
)

// ── Handlers ─────────────────────────────────────────────────────────────────
async function onFileSelected(file) {
  currentFile.value = file
  duration.value    = null
  chunkSec.value    = DEFAULT_CHUNK_SEC
  reset()

  // Pre-read duration for the chunk preview + selector
  const v   = document.createElement('video')
  v.preload = 'metadata'
  const url = URL.createObjectURL(file)
  v.src     = url
  v.onloadedmetadata = () => { URL.revokeObjectURL(url); duration.value = v.duration }
  v.onerror          = () => { URL.revokeObjectURL(url) }
}

async function startSplit() {
  if (!currentFile.value) return
  await split(currentFile.value, chunkSec.value)

  if (status.value === 'done') {
    toast.add({
      severity: 'success',
      summary:  'SPLIT COMPLETE',
      detail:   `${segments.value.length} CLIP${segments.value.length !== 1 ? 'S' : ''} READY TO SAVE`,
      life:     4000,
    })
  }
}

async function handleSaveAll() {
  await downloadAll()
  toast.add({
    severity: 'success',
    summary:  'DOWNLOADING',
    detail:   `SAVING ${segments.value.length} CLIPS...`,
    life:     3000,
  })
}

function resetAll() {
  reset()
  currentFile.value = null
  duration.value    = null
  chunkSec.value    = DEFAULT_CHUNK_SEC
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 680px;
  margin: 0 auto;
}

.reset-btn {
  margin: 10px 0;
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
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

@media (max-width: 480px) {
  .page { padding: 12px; }
}
</style>

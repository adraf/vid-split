<template>
  <footer class="footer">
    <Divider />

    <p class="footer-line">
      &gt;
      <button class="footer-link privacy-btn" @click="showPrivacy = true">
        ALL PROCESSING HAPPENS LOCALLY IN YOUR BROWSER
      </button>
    </p>
    <p class="footer-line">&gt; YOUR VIDEO NEVER LEAVES YOUR DEVICE</p>
    <p class="footer-line">
      &gt; MADE BY
      <a
        href="https://www.adamraffertywebdesign.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >ADAM RAFFERTY WEB DESIGN</a>
    </p>
    <p class="footer-line">
      &gt; ICONS BY
      <a
        href="https://icons8.com/icons"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
      >ICONS8</a>
    </p>
  </footer>

  <!-- Privacy / how it works dialog -->
  <Dialog
    v-model:visible="showPrivacy"
    modal
    :closable="true"
    :draggable="false"
    header="HOW YOUR PRIVACY IS PROTECTED"
    class="privacy-dialog"
  >
    <div class="privacy-content">

      <section class="priv-section">
        <h2 class="priv-heading">&gt; YOUR VIDEO NEVER LEAVES YOUR DEVICE</h2>
        <p class="priv-text">
          When you select a video in VID // SPLIT, it is never uploaded to any server,
          cloud service, or third party. Everything happens entirely within your browser
          using a technology called WebAssembly.
        </p>
      </section>

      <section class="priv-section">
        <h2 class="priv-heading">&gt; WHAT IS WEBASSEMBLY?</h2>
        <p class="priv-text">
          WebAssembly (WASM) allows powerful software — in this case FFmpeg, a
          professional video processing tool — to run directly inside your browser tab,
          just like a native app on your computer. No installation required, and no data
          sent anywhere.
        </p>
      </section>

      <section class="priv-section">
        <h2 class="priv-heading">&gt; WHAT IS FFMPEG?</h2>
        <p class="priv-text">
          FFmpeg is the industry-standard open source tool used by YouTube, VLC, and
          thousands of other video applications to process video files. VID // SPLIT
          runs FFmpeg entirely within your browser tab — the same tool, just locally.
        </p>
      </section>

      <section class="priv-section">
        <h2 class="priv-heading">&gt; HOW THE SPLITTING WORKS</h2>
        <p class="priv-text">
          When you click Split, your video file is loaded into your browser's memory.
          FFmpeg then cuts it into chunks using stream copy — meaning the video is sliced
          at the requested points without any re-encoding. The original quality is
          preserved exactly. The output clips exist only in your browser's memory until
          you choose to save them.
        </p>
      </section>

      <section class="priv-section">
        <h2 class="priv-heading">&gt; WHAT DATA DO WE COLLECT?</h2>
        <p class="priv-text">
          None. VID // SPLIT has no backend, no database, no analytics, and no tracking.
          There is no account system. We have no way of knowing what videos you process
          because they never reach us.
        </p>
      </section>

      <section class="priv-section">
        <h2 class="priv-heading">&gt; WHEN IS MEMORY CLEARED?</h2>
        <p class="priv-text">
          All video data is held temporarily in your browser tab's memory. As soon as
          you close the tab, refresh the page, or click Split Another Video, all data
          is cleared and the memory is freed. Nothing is written to your device's
          storage without your explicit action of saving a clip.
        </p>
      </section>

    </div>

    <template #footer>
      <button class="close-btn" @click="showPrivacy = false">
        CLOSE
      </button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Divider from 'primevue/divider'
import Dialog  from 'primevue/dialog'

const showPrivacy = ref(false)
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 28px 0 24px;
  font-size: 8px;
  line-height: 3.2;
}

.footer-line {
  color: rgba(162, 213, 198, 0.45);
  transition: color 0.2s ease;
}

.footer-line:hover {
  color: rgba(162, 213, 198, 0.85);
}

.footer-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  font-family: var(--vs-font);
}

.footer-link:hover {
  color: var(--vs-mint);
}

.privacy-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Dialog overrides ── */
.privacy-dialog :deep(.p-dialog) {
  border-radius: 0 !important;
  border: 2px solid var(--vs-teal) !important;
  background: #000 !important;
  max-width: 640px;
  width: 90vw !important;
  box-shadow: 6px 6px 0 rgba(162, 213, 198, 0.2) !important;
}

.privacy-dialog :deep(.p-dialog-header) {
  background: #000 !important;
  color: var(--vs-mint) !important;
  font-family: var(--vs-font) !important;
  font-size: 9px !important;
  border-bottom: 2px solid var(--vs-teal) !important;
  padding: 16px 20px !important;
  border-radius: 0 !important;
}

.privacy-dialog :deep(.p-dialog-header-close) {
  color: var(--vs-teal) !important;
}
.privacy-dialog :deep(.p-dialog-header-close:hover) {
  color: var(--vs-mint) !important;
  background: rgba(162, 213, 198, 0.1) !important;
}

.privacy-dialog :deep(.p-dialog-content) {
  background: #000 !important;
  padding: 20px !important;
  border-radius: 0 !important;
}

.privacy-dialog :deep(.p-dialog-footer) {
  background: #000 !important;
  border-top: 1px solid rgba(162, 213, 198, 0.15) !important;
  padding: 14px 20px !important;
  border-radius: 0 !important;
  text-align: center;
}

/* ── Dialog content ── */
.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.priv-section {
  border-left: 3px solid rgba(162, 213, 198, 0.25);
  padding-left: 14px;
}

.priv-heading {
  font-family: var(--vs-font);
  font-size: 7px;
  color: var(--vs-mint);
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-weight: 400;
}

.priv-text {
  font-family: var(--vs-font);
  font-size: 7px;
  color: rgba(162, 213, 198, 0.7);
  line-height: 2.4;
}

.close-btn {
  background: var(--vs-mint);
  color: #000;
  font-family: var(--vs-font);
  font-size: 8px;
  padding: 12px 28px;
  border: none;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--vs-teal);
  letter-spacing: 1px;
  transition: transform 0.08s, box-shadow 0.08s;
}

.close-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--vs-teal);
}
</style>

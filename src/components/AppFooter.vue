<template>
  <footer class="footer">
    <Divider />
    <p class="footer-line">&gt; ALL PROCESSING HAPPENS LOCALLY IN YOUR BROWSER</p>
    <p class="footer-line">&gt; YOUR VIDEO NEVER LEAVES YOUR DEVICE</p>
    <p class="footer-line">&gt; VID SPLIT v1.0</p>
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
</template>

<script setup>
import Divider from 'primevue/divider'
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
</style>

<template>
  <header class="header">
    <h1 class="logo">VID <span class="slash">//</span> SPLIT</h1>
    <p class="tagline">&gt; SLICE YOUR CLIPS // CHOOSE YOUR CHUNKS_</p>
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 40px 0 28px;
}

.logo {
  font-size: clamp(22px, 6vw, 36px);
  color: var(--vs-mint);
  text-shadow:
    3px 3px 0 var(--vs-teal),
    6px 6px 0 rgba(162, 213, 198, 0.25),
    0 0 40px rgba(207, 255, 226, 0.15);
  letter-spacing: 6px;
  animation: flicker 6s infinite;
  display: inline-block;
}

.slash { color: var(--vs-teal); }

.tagline {
  font-size: 7px;
  color: var(--vs-teal);
  margin-top: 14px;
  letter-spacing: 2px;
  opacity: 0.8;
  line-height: 2.4;
}

@media (max-width: 480px) {
  .tagline {
    font-size: 6px;
    letter-spacing: 1px;
  }
}

@keyframes flicker {
  0%, 93%, 95%, 97%, 100% { opacity: 1; }
  94% { opacity: 0.75; }
  96% { opacity: 0.9; }
  98% { opacity: 0.6; }
}
</style>

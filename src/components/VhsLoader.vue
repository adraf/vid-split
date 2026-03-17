<template>
  <div v-if="visible" class="vhs-loader">
    <div class="cass-wrap">

      <svg width="240" height="240" viewBox="0 0 32 32" class="half top-half">
        <defs><clipPath id="vhs-ct"><polygon points="0,0 32,0 32,5 27,5 5,27 0,27"/></clipPath></defs>
        <g clip-path="url(#vhs-ct)">
          <rect width="32" height="32" fill="#000"/>
          <rect x="2" y="7" width="28" height="18" fill="#A2D5C6"/>
          <rect x="3" y="8" width="26" height="16" fill="#000"/>
          <rect x="3" y="8" width="26" height="16" fill="none" stroke="#A2D5C6" stroke-width="0.75"/>
          <rect x="7" y="10" width="18" height="8" fill="#000"/>
          <circle cx="12" cy="14" r="3" fill="#A2D5C6"/>
          <circle cx="12" cy="14" r="1.2" fill="#000"/>
          <circle cx="20" cy="14" r="3" fill="#A2D5C6"/>
          <circle cx="20" cy="14" r="1.2" fill="#000"/>
          <rect x="7" y="19" width="18" height="3" fill="#CFFFE2"/>
        </g>
      </svg>

      <svg width="240" height="240" viewBox="0 0 32 32" class="half bot-half">
        <defs><clipPath id="vhs-cb"><polygon points="27,5 32,0 32,32 0,32 0,27 5,27"/></clipPath></defs>
        <g clip-path="url(#vhs-cb)">
          <rect width="32" height="32" fill="#000"/>
          <rect x="2" y="7" width="28" height="18" fill="#A2D5C6"/>
          <rect x="3" y="8" width="26" height="16" fill="#000"/>
          <rect x="3" y="8" width="26" height="16" fill="none" stroke="#A2D5C6" stroke-width="0.75"/>
          <rect x="7" y="10" width="18" height="8" fill="#000"/>
          <circle cx="12" cy="14" r="3" fill="#A2D5C6"/>
          <circle cx="12" cy="14" r="1.2" fill="#000"/>
          <circle cx="20" cy="14" r="3" fill="#A2D5C6"/>
          <circle cx="20" cy="14" r="1.2" fill="#000"/>
          <rect x="7" y="19" width="18" height="3" fill="#CFFFE2"/>
        </g>
      </svg>

    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
})
</script>

<style scoped>
.vhs-loader {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 28px 0;
}

.cass-wrap {
  position: relative;
  width: 240px;
  height: 240px;
  overflow: visible;
}

.half {
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
}

.top-half { animation: vhs-top 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.bot-half { animation: vhs-bot 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

@keyframes vhs-top {
  0%,  20%  { transform: translate(0, 0); }
  45%, 55%  { transform: translate(-26px, -26px); }
  80%, 100% { transform: translate(0, 0); }
}

@keyframes vhs-bot {
  0%,  20%  { transform: translate(0, 0); }
  45%, 55%  { transform: translate(26px, 26px); }
  80%, 100% { transform: translate(0, 0); }
}
</style>

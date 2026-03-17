import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'

import VidSplitPreset from './theme/index.js'
import App from './App.vue'
import './styles/global.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: VidSplitPreset,
    options: {
      // Tied to the .vs-dark class on <html> so we're always in dark mode
      darkModeSelector: '.vs-dark',
      cssLayer: false,
    },
  },
  ripple: true,
})

app.use(ToastService)
app.mount('#app')

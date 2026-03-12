import { createApp } from 'vue'
import App from '@/app/App.vue'
import { installPinia } from '@/app/plugins/pinia'
import { installPrimeUI } from '@/app/plugins/prime-ui'
import { installRouter } from '@/app/plugins/router'
import '@/app/styles/ui.css'

const app = createApp(App)
installPinia(app)
installRouter(app)
installPrimeUI(app)
app.mount('#app')

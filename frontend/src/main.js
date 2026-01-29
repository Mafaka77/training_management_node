import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// ✅ Create Pinia
const pinia = createPinia()

// ✅ Tell Vue to use Pinia & Router before mounting
app.use(pinia)
app.use(router)

app.mount('#app')

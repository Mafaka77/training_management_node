// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import tailwindcss from '@tailwindcss/vite'
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue(), tailwindcss()],
// })
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // This is the v4 plugin

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
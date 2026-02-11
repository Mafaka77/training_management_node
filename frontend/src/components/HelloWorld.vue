<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1 class="text-2xl font-semibold tracking-tight">{{ msg }}</h1>

  <div class="mt-6 flex flex-wrap items-center gap-3">
    <button
      type="button"
      class="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
      @click="count++"
    >
      Count is {{ count }}
    </button>

    <button
      data-modal-target="demo-modal"
      data-modal-toggle="demo-modal"
      type="button"
      class="rounded-lg border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Open modal (Flowbite JS)
    </button>
  </div>

  <div id="demo-modal" tabindex="-1" aria-hidden="true" class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0">
    <div class="relative max-h-full w-full max-w-md">
      <div class="relative rounded-lg bg-zinc-900 shadow">
        <div class="flex items-center justify-between rounded-t border-b border-white/10 p-4 md:p-5">
          <h3 class="text-lg font-semibold text-white">Flowbite modal</h3>
          <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white" data-modal-hide="demo-modal">
            <span class="sr-only">Close modal</span>
            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        <div class="space-y-4 p-4 md:p-5">
          <p class="text-sm text-zinc-300">
            This modal uses Flowbite’s data-attributes + JS. If it opens/closes, Flowbite is wired up correctly.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2 rounded-b border-t border-white/10 p-4 md:p-5">
          <button data-modal-hide="demo-modal" type="button" class="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

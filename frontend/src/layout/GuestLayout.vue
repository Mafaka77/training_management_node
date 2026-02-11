<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-zinc-950">
    <header class="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-lg font-medium tracking-tight uppercase">ATIMIZ <span class="text-zinc-500 font-light">Smart</span></span>
        </router-link>

        <nav class="hidden md:flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-md">
          <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              v-slot="{ isExactActive }"
          >
            <a :class="[
      'relative px-5 py-2 text-[12px] font-medium transition-all duration-300 rounded-full tracking-wider uppercase',
      isExactActive
        ? 'text-white bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
    ]">
              {{ link.name }}

            </a>
          </router-link>
        </nav>

        <button
            @click="isDrawerOpen = true"
            class="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>

    <Teleport to="body">
      <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] bg-zinc-950/60 backdrop-blur-sm" @click="isDrawerOpen = false"></div>
      </Transition>

      <Transition
          enter-active-class="transition duration-500 ease-in-out transform"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-300 ease-in-out transform"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
      >
        <div v-if="isDrawerOpen" class="fixed inset-y-0 right-0 z-[101] w-full max-w-xs bg-zinc-900 border-l border-white/10 shadow-2xl p-8 flex flex-col">
          <div class="flex items-center justify-between mb-12">
            <span class="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Menu</span>
            <button @click="isDrawerOpen = false" class="p-2 text-zinc-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="flex flex-col gap-6">
            <router-link
                v-for="link in navLinks"
                :key="link.path"
                :to="link.path"
                @click="isDrawerOpen = false"
                class="text-2xl font-light text-zinc-400 hover:text-white transition-colors"
                active-class="text-white !font-normal"
            >
              {{ link.name }}
            </router-link>
          </nav>

          <div class="mt-auto pt-8 border-t border-white/5">
            <router-link
                to="/login"
                @click="isDrawerOpen = false"
                class="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Admin Access
            </router-link>
          </div>
        </div>
      </Transition>
    </Teleport>

    <main class="flex-1">
      <router-view />
    </main>

    <footer class="border-t border-white/10 bg-zinc-950 px-6 py-12">
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2 space-y-4">
            <h3 class="text-sm font-medium tracking-wider uppercase">Administrative Training Institute</h3>
            <p class="text-[13px] text-zinc-500 max-w-sm font-light leading-relaxed">
              Strengthening governance through professional excellence and systematic skill development.
            </p>
          </div>
          <div>
            <h4 class="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 mb-4">Support</h4>
            <ul class="space-y-3 text-[13px] text-zinc-500 font-light">
              <li><a href="#" class="hover:text-blue-500 transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 mb-4">Portals</h4>
            <ul class="space-y-3 text-[13px] text-zinc-500 font-light">
              <li>
                <router-link to="/login" class="hover:text-blue-500 transition-colors">Staff Login</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-zinc-600 font-light">
          <p>© 2026 ATI Government of Mizoram.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-white transition-colors tracking-widest uppercase">Twitter</a>
            <a href="#" class="hover:text-white transition-colors tracking-widest uppercase">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isDrawerOpen = ref(false);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Programs', path: '/trainings' }, // or 'Training Catalog'
  { name: 'About', path: '/about-us' },
  { name: 'Contact', path: '/contact-us' },
];
</script>

<style scoped>
/* Optional: Prevent body scroll when drawer is open */
:global(body) {
  overflow-x: hidden;
}
</style>
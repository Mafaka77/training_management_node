<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#071a13] selection:bg-emerald-500/30">
    <header class="sticky top-0 z-50 border-b border-emerald-500/15 bg-[#071a13]/85 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
            <img src="../assets/ati_gom.png" alt="ATI Logo" />
          </div>
          <span class="text-lg font-medium tracking-tight text-white">ATI <span class="text-emerald-400/60 font-light"></span></span>
        </router-link>

        <nav
          class="hidden md:flex items-center gap-2 p-2 bg-white/[0.03] border border-emerald-500/15 rounded-full backdrop-blur-md">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path" v-slot="{ isExactActive }">
            <a :class="[
              'relative px-5 py-2 text-[12px] font-medium transition-all duration-300 rounded-full tracking-wider uppercase',
              isExactActive
                ? 'text-white bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-emerald-100/70 hover:text-white hover:bg-emerald-500/10'
            ]">
              {{ link.name }}
            </a>
          </router-link>
        </nav>

        <button @click="isDrawerOpen = true"
          class="md:hidden p-2 -mr-2 text-emerald-300 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>

    <Teleport to="body">
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          @click="isDrawerOpen = false"></div>
      </Transition>

      <Transition enter-active-class="transition duration-500 ease-in-out transform" enter-from-class="translate-x-full"
        enter-to-class="translate-x-0" leave-active-class="transition duration-300 ease-in-out transform"
        leave-from-class="translate-x-0" leave-to-class="translate-x-full">
        <div v-if="isDrawerOpen"
          class="fixed inset-y-0 right-0 z-[101] w-full max-w-xs bg-[#092218] border-l border-emerald-500/20 shadow-2xl p-8 flex flex-col">
          <div class="flex items-center justify-between mb-12">
            <span class="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Menu</span>
            <button @click="isDrawerOpen = false" class="p-2 text-zinc-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav class="flex flex-col gap-6">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="isDrawerOpen = false"
              class="text-2xl font-light text-emerald-100/70 hover:text-white transition-colors"
              active-class="text-emerald-400 !font-normal">
              {{ link.name }}
            </router-link>
          </nav>

          <div class="mt-auto pt-8 border-t border-emerald-500/10">
            <router-link to="/login" @click="isDrawerOpen = false"
              class="flex items-center gap-3 text-sm font-medium text-emerald-300/80 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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

    <footer class="border-t border-emerald-500/15 bg-[#05140e] px-6 py-12">
      <div class="mx-auto max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2 space-y-4">
            <h3 class="text-sm font-medium tracking-wider uppercase text-white">Administrative Training Institute</h3>
            <p class="text-[13px] text-emerald-200/60 max-w-sm font-light leading-relaxed">
              Strengthening governance through professional excellence and systematic skill development.
            </p>
          </div>
          <div>
            <h4 class="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400 mb-4">Support</h4>
            <ul class="space-y-3 text-[13px] text-emerald-200/60 font-light">
              <li><router-link to="/contact-us" class="hover:text-emerald-300 transition-colors">Help Center</router-link></li>
              <li><router-link to="/terms" class="hover:text-emerald-300 transition-colors">Terms & Policy
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400 mb-4">Portals</h4>
            <ul class="space-y-3 text-[13px] text-emerald-200/60 font-light">
              <li>
                <router-link to="/login" class="hover:text-emerald-300 transition-colors">Staff Login</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="pt-8 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-emerald-300/50 font-light">
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
  { name: 'Programs', path: '/trainings' },
  { name: 'About', path: '/about-us' },
  { name: 'Contact', path: '/contact-us' },
];
</script>

<style scoped>
:global(body) {
  overflow-x: hidden;
}
</style>
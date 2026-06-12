<script setup>
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-vue-next"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAlertStore } from "../store/alertStore.js"
import { useAuthStore } from "../store/authStore.js"

const router = useRouter()
const authStore = useAuthStore()
const alert = useAlertStore()
const email = ref("")
const password = ref("")
const showPassword = ref(false)
const errorMessage = ref("")
const { loading } = storeToRefs(authStore)

async function login() {
  errorMessage.value = ""

  const response = await authStore.login(email.value, password.value)
  if (response.success) {
    alert.success('Welcome back!')
    const roles = authStore.roles
    if (Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin') {
      router.push({ name: 'admin.dashboard' })
    } else {
      router.push({ name: 'admin.trainer.dashboard' })
    }
  } else {
    errorMessage.value = response.message || "Invalid credentials"
    alert.error(response.message || "Invalid credentials")
  }
}
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 px-4 overflow-hidden">
    <!-- Ambient blurred background blobs for premium feel -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse duration-4000">
    </div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-4000 delay-2000">
    </div>

    <!-- Card -->
    <div
      class="relative w-full max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 hover:border-zinc-700/60">

      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          ATI Admin
        </h1>
        <p class="text-sm text-zinc-400 mt-2">
          Sign in to access the training dashboard
        </p>
      </div>

      <!-- Error Message Box -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="errorMessage"
          class="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-2.5">
          <svg class="w-5 h-5 shrink-0 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-5">

        <!-- Email Field -->
        <div class="relative group">
          <label
            class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors duration-200">
            Email Address
          </label>
          <div class="relative">
            <input v-model="email" type="email" required autocomplete="email" placeholder="name@example.com"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              :disabled="loading" />
            <div
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors duration-200">
              <Mail class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Password Field -->
        <div class="relative group">
          <label
            class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors duration-200">
            Password
          </label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required
              autocomplete="current-password" placeholder="••••••••"
              class="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              :disabled="loading" />
            <div
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors duration-200">
              <Lock class="w-4 h-4" />
            </div>

            <!-- Show/Hide Password Button -->
            <button type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              @click="showPassword = !showPassword" tabindex="-1">
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading"
          class="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100">
          <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
          <span>{{ loading ? "Signing in..." : "Sign In" }}</span>
        </button>

      </form>

      <!-- Footer -->
      <div class="mt-8 text-center border-t border-zinc-800/60 pt-6">
        <p class="text-xs text-zinc-500">
          © {{ new Date().getFullYear() }} ATI Training Management. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</template>

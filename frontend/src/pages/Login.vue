<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../store/authStore.js"
import {useAlertStore} from "../store/alertStore.js";
import { storeToRefs } from "pinia";

const router = useRouter()
const authStore = useAuthStore()
const alert=useAlertStore();
const email = ref("")
const password = ref("")
const showPassword = ref(false)
const errorMessage = ref("")
const {loading} = storeToRefs(authStore)
async function login() {
  errorMessage.value = ""
  loading.value = true

  const response = await authStore.login(email.value, password.value)
  if(response.success){
    alert.success('Welcome back!')
    const roles = authStore.roles;
    if (Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin') {
        router.push({ name: 'admin.dashboard' });
    } else {
        router.push({ name: 'admin.trainer.dashboard' });
    }
  } else {
    alert.error(response.message)
  }
}
</script>

<template>
  <div
      class="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 px-4"
  >
    <!-- Card -->
    <div
        class="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-xl"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold tracking-tight">
          ATI Admin
        </h1>
        <p class="text-sm text-zinc-400 mt-1">
          Sign in to your account
        </p>
      </div>

      <!-- Error -->
      <div
          v-if="errorMessage"
          class="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400"
      >
        {{ errorMessage }}
      </div>

      <!-- Email Field -->
      <div class="relative mb-6">
        <input
            v-model="email"
            type="email"
            required
            placeholder=" "
            class="peer w-full rounded-lg border border-white/10 bg-zinc-900 px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label
            class="absolute left-3 top-2 text-xs text-zinc-400 transition-all
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-sm
          peer-focus:top-2 peer-focus:text-xs"
        >
          Email
        </label>
      </div>

      <!-- Password Field -->
      <div class="relative mb-6">
        <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder=" "
            class="peer w-full rounded-lg border border-white/10 bg-zinc-900 px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label
            class="absolute left-3 top-2 text-xs text-zinc-400 transition-all
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-sm
          peer-focus:top-2 peer-focus:text-xs"
        >
          Password
        </label>

        <!-- Show password toggle -->
        <button
            type="button"
            class="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
            @click="showPassword = !showPassword"
        >
          {{ showPassword ? "Hide" : "Show" }}
        </button>
      </div>

      <!-- Login Button -->
      <button
          @click="login"
          class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium transition hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <svg
            v-if="loading"
            class="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
        >
          <circle
              cx="12"
              cy="12"
              r="10"x
              stroke="white"
              stroke-width="4"
              fill="none"
          />
        </svg>

        {{ loading ? "Signing in..." : "Sign In" }}
      </button>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-zinc-500">
        Secure access • ATI Training Management
      </p>
    </div>
  </div>
</template>

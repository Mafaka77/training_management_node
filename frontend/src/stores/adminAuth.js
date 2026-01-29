// frontend/src/stores/adminAuth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAdminAuth = defineStore('adminAuth', () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const admin = ref(null)

  function login(email, password) {
    // TODO: replace with real API
    if (email === 'admin@ati.com' && password === 'password123') {
      isAuthenticated.value = true
      admin.value = { email }
      router.push('/admin/dashboard')
    } else {
      throw new Error('Invalid credentials')
    }
  }

  function logout() {
    isAuthenticated.value = false
    admin.value = null
    router.push('/login')
  }

  return {
    isAuthenticated,
    admin,
    login,
    logout
  }
})

// src/pages/VerifyCertificate.vue
<template>
  <div class="verify-container">
    <div class="card">
      <h1 class="title">Certificate Verification</h1>
      <div v-if="loading" class="status loading">
        Loading verification details…
      </div>
      <div v-else-if="error" class="status error">
        {{ error }}
      </div>
      <div v-else class="details">
        <p class="field"><strong>Certificate ID:</strong> {{ certificate.id }}</p>
        <p class="field"><strong>Trainee:</strong> {{ certificate.trainee.full_name }}</p>
        <p class="field"><strong>Program:</strong> {{ certificate.program.title }}</p>
        <p class="field"><strong>Status:</strong> <span :class="{ signed: certificate.isSigned }">{{ certificate.isSigned ? 'Signed' : 'Unsigned' }}</span></p>
        <p class="field"><strong>Issued:</strong> {{ formatDate(certificate.createdAt) }}</p>
        <div class="pdf-preview" v-if="certificate.certificateUrl">
          <a :href="certificate.certificateUrl" target="_blank" class="view-link">View Certificate PDF</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../api/axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const certificateId = route.params.id

const loading = ref(true)
const error = ref(null)
const certificate = ref({})

const fetchVerification = async () => {
  try {
    const response = await axios.get(`/verify-certificate/${certificateId}`)
    if (response.data && response.data.status === 200) {
      certificate.value = {
        id: certificateId,
        trainee: response.data.data.trainee,
        program: response.data.data.program,
        isSigned: response.data.data.isSigned,
        createdAt: response.data.data.createdAt,
        certificateUrl: response.data.data.certificateUrl,
      }
    } else {
      error.value = response.data.message || 'Verification failed.'
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(fetchVerification)
</script>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  min-height: 80vh;
  background: linear-gradient(135deg, hsl(210, 30%, 95%), hsl(210, 20%, 90%));
}

.card {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 540px;
  width: 100%;
  border: 2px solid #d4af37; /* premium gold line */
}

.title {
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #222;
}

.status {
  text-align: center;
  font-size: 1.2rem;
  padding: 1rem;
}
.loading { color: #555; }
.error { color: #c00; }

.details {
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
}
.field {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}
.signed { color: #2e7d32; font-weight: bold; }

.pdf-preview {
  margin-top: 1.5rem;
  text-align: center;
}
.view-link {
  display: inline-block;
  background: #d4af37;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}
.view-link:hover { background: #b8952e; }
</style>

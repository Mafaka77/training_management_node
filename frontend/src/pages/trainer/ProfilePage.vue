<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 800px; width: 100%">
      <div class="text-h5 text-primary text-weight-bold q-mb-lg">
        Trainer Profile
      </div>

      <q-form @submit.prevent="saveProfile" class="row q-col-gutter-md">
        <!-- Left Side: Fields -->
        <div class="col-8">
          <q-input
            v-model="form.expertise"
            label="Expertise"
            outlined
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="form.qualification"
            label="Qualification"
            outlined
            dense
            class="q-mb-md"
          />
          <q-input
            v-model="form.experience"
            label="Experience"
            outlined
            dense
            class="q-mb-md"
          />
        </div>

        <!-- Right Side: Profile Picture -->
        <div class="col-4 flex flex-center column">
          <!-- Avatar Preview -->
          <q-avatar size="120px" class="q-mb-md">
            <img v-if="previewUrl" :src="previewUrl" alt="Profile" />
            <q-icon v-else name="person" size="80px" color="grey-6" />
          </q-avatar>

          <!-- File Input -->
          <q-file
            v-model="form.profile_picture"
            label="Choose Picture"
            accept="image/*"
            outlined
            dense
            clearable
            @update:model-value="onFileSelected"
          >
            <template v-slot:append>
              <q-icon name="photo_camera" class="cursor-pointer" />
            </template>
          </q-file>
        </div>

        <!-- Save Button -->
        <div class="col-12 flex justify-end q-mt-lg">
          <q-btn
            type="submit"
            color="primary"
            unelevated
            icon="save"
            label="Save Changes"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

// Get global API instance
const { proxy } = getCurrentInstance()
const api = proxy.$api

// Form state
const form = ref({
  expertise: '',
  qualification: '',
  experience: '',
  profile_picture: null
})

const previewUrl = ref('')

// Fetch trainer profile fields
onMounted(async () => {
  try {
    const { data } = await api.get('/admin/trainer/proficiency')

    // Populate form with API values
    data.forEach(field => {
      if (field.key in form.value) {
        form.value[field.key] = field.type === 'file' ? null : field.value || ''
      }
    })

    // Preload existing profile picture
    const profileField = data.find(f => f.key === 'profile_picture')
    if (profileField && profileField.value && typeof profileField.value === 'string') {
      previewUrl.value = 'https://staging2.egovmz.in' + profileField.value
    }
  } catch (err) {
    console.error('Failed to load fields:', err)
  }
})

// Handle file selection
function onFileSelected(file) {
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

// Save profile
async function saveProfile() {
  const payload = new FormData()
  payload.append('expertise', form.value.expertise || '')
  payload.append('qualification', form.value.qualification || '')
  payload.append('experience', form.value.experience || '')
  if (form.value.profile_picture) payload.append('profile_picture', form.value.profile_picture)

  try {
    const { data } = await api.put('/admin/trainer/proficiency', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log('Profile updated successfully!', data)
  } catch (err) {
    console.error('Save failed:', err)
  }
}
</script>

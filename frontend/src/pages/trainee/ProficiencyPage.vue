<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="updateProfile" class="q-gutter-md">
      <q-input filled v-model="profile.expertise" label="Expertise" required />
      <q-input filled v-model="profile.qualification" label="Qualification" required />
      <q-input filled v-model="profile.experience" label="Experience" required />

      <div>
        <q-uploader url="" label="Profile Picture" :auto-upload="false" :factory="factoryUploader" ref="uploader" 
          v-model="uploader"
          accept="image/*"
          max-files="1"
          />

          <div v-if="profile.profile_picture_preview" class="q-mt-sm">
            <q-img :src="profile.profile_picture_preview" style="max-width:150px; max-height:150px;" />
            <q-btn flat color="negative" icon="delete" label="Remove" @click="removePicture" />
          </div>
      </div>

      <q-btn type="submit" label="Update Profile" color="primary" class="q-mt-md" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const uploader = ref(null); // ref for the q-uploader

const profile = ref({
  expertise: "",
  qualification: "",
  experience: "",
  profile_picture: null,
  profile_picture_preview: null
});

const fetchProfile = async () => {
  try {
    const res = await api.get("/trainer/proficiency");
    profile.value = res.data.profile;
    // If API provides picture URL
    profile.value.profile_picture_preview = res.data.profile.profile_picture_url || null;
  } catch (err) {
    console.error(err);
  }
};

const updateProfile = async () => {
  if (!profile.value.expertise || !profile.value.qualification || !profile.value.experience) {
    return alert("Please fill all fields");
  }

  const formData = new FormData();
  formData.append("expertise", profile.value.expertise);
  formData.append("qualification", profile.value.qualification);
  formData.append("experience", profile.value.experience);

  const uploader = ref.uploader;
  if (uploader && uploader.files.length) {
    formData.append("profile_picture", uploader.files[0]);
  }

  try {
    await api.post("/trainer/proficiency", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Profile updated successfully!");
    fetchProfile();
  } catch (err) {
    console.error(err);
  }
};
const removePicture = () => {
  profile.value.profile_picture = null;
  profile.value.profile_picture_preview = null;
  if (uploader.value) uploader.value.reset();
};

const factoryUploader = (file) => file;

onMounted(fetchProfile);
</script>

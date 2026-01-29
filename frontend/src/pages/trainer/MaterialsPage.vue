<template>
  <q-page class="q-pa-md">
    <q-select
      filled
      v-model="selectedCourse"
      :options="courses"
      option-label="t_name"
      option-value="_id"
      label="Select Course"
      required
    />

    <q-uploader
      ref="uploader"
      label="Upload Materials"
      multiple
      :auto-upload="false"
      :url="''"
      accept=".pdf,.doc,.docx,.ppt,.pptx"
      max-file-size="10485760"
    />

    <q-btn @click="uploadMaterials" label="Upload" color="primary" class="q-mt-md" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const courses = ref([]);
const selectedCourse = ref(null);

const fetchCourses = async () => {
  try {
    const res = await api.get("admin/trainer/courses");
    courses.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
};

const uploadMaterials = async () => {
  if (!selectedCourse.value) return alert("Select a course first");

  const uploader = ref.uploader;
  if (!uploader.files.length) return alert("Select files to upload");

  const formData = new FormData();
  uploader.files.forEach(file => formData.append("materials", file));

try {
  await api.post(
    `/trainer/course/${selectedCourse.value}/materials`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        console.log(
          `Upload progress: ${Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )}%`
        );
      },
    }
  );

  alert("Materials uploaded successfully!");
  uploader.reset();
} catch (err) {
  console.error(err);
}
};
onMounted(fetchCourses);
</script>

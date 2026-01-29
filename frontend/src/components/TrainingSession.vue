<template>
  <q-item class="q-pa-none q-mb-sm">
    <q-item-section class="q-pa-md bg-grey-2 rounded-borders">
      <q-item-label class="text-weight-bold text-body1">{{ course.tc_topic }}</q-item-label>
      <q-item-label caption class="q-mt-xs">{{ course.tc_description }}</q-item-label>

      <div class="row items-center q-mt-sm">
        <div class="col-12 col-sm-6">
          <div class="text-caption text-grey">Session</div>
          <div class="text-body2">Session {{ course.tc_session }}</div>
        </div>
        <div class="col-12 col-sm-6">
          <div class="text-caption text-grey">Schedule</div>
          <div class="text-body2">
            {{ formatDate(course.tc_start_time) }} - {{ formatDate(course.tc_end_time) }}
          </div>
        </div>
      </div>

      <!-- Materials -->
      <div v-if="course.materials && course.materials.length" class="q-mt-md">
        <div class="text-caption text-weight-medium q-mb-xs">Training Materials:</div>
        <div class="row q-col-gutter-xs">
          <div v-for="material in course.materials" :key="material._id" class="col-auto">
            <q-chip
              clickable
              @click="downloadMaterial(material)"
              icon="description"
              size="sm"
              :title="material.file_name"
            >
              {{ truncateFileName(material.file_name) }}
            </q-chip>
          </div>
        </div>
      </div>

      <div v-else class="q-mt-md text-caption text-italic text-grey">
        No materials available for this session
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps } from "vue"
import { useQuasar } from "quasar"

const { course } = defineProps({
  course: { type: Object, required: true }
})

const $q = useQuasar()

const downloadMaterial = (material) => {
  const url = `https://staging2.egovmz.in${material.file_url}`
  window.open(url, "_blank")
  $q.notify({ type: "info", message: `Downloading ${material.file_name}` })
}

const truncateFileName = (name) =>
  name.length > 20 ? name.slice(0, 17) + "..." : name

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "N/A"
</script>

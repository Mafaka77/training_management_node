<template>
  <q-card flat>
    <q-card-section>
      <div class="text-caption text-grey">{{ title }}</div>
      <q-badge :color="color" class="q-mt-xs">{{ status }}</q-badge>
      <div v-if="enrolledDate || extra" class="text-caption q-mt-xs">
        <span v-if="enrolledDate">Enrolled on {{ formatDate(enrolledDate) }}</span>
        <span v-if="extra">{{ extra }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date as quasarDate } from "quasar"

defineProps({
  title: String,
  status: String,
  enrolledDate: String,
  extra: String,
  color: String
})

const formatDate = (d) => (d ? quasarDate.formatDate(d, "DD MMM YYYY") : "N/A")
</script>

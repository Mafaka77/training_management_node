<script setup>
import { computed } from "vue"

const props = defineProps({
  type: String,
  message: String,
})

const styles = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "error":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "warning":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
  }
})
</script>

<template>
  <div class="rounded-lg border p-3 text-sm shadow-md backdrop-blur"
       :class="styles">
    {{ message }}
  </div>
</template>

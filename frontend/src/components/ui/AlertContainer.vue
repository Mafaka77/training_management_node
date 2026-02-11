<script setup>
import { useAlertStore } from "../../store/alertStore.js"
import Alert from "./Alert.vue"

const alertStore = useAlertStore()
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-3 w-80">
    <transition-group name="fade">
      <Alert
          v-for="alert in alertStore.alerts"
          :key="alert.id"
          :type="alert.type"
          :message="alert.message"
      />
    </transition-group>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

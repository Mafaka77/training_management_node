<script setup>
import { useAlertStore } from "../../store/alertStore.js";
import Alert from "./Alert.vue";

const alertStore = useAlertStore()
</script>

<template>
  <div
    class="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
    <transition-group name="toast">
      <Alert v-for="alert in alertStore.alerts" :key="alert.id" :id="alert.id" :type="alert.type"
        :message="alert.message" />
    </transition-group>
  </div>
</template>

<style>
/* Spring-like entry and smooth exit */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* List moving effect when an item above gets removed */
.toast-move {
  transition: transform 0.4s ease;
}

/* Entering from the right */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

/* Fading out while shrinking */
.toast-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Required for the .toast-move smooth repositioning */
.toast-leave-active {
  position: absolute;
  width: 100%;
}
</style>
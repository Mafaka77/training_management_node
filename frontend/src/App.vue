
<template>
  <AlertContainer/>
  <router-view/>
  <Loader />
</template>

<script setup lang="ts">
import AlertContainer from "./components/ui/AlertContainer.vue";
import Loader from "./components/ui/Loader.vue";
</script>
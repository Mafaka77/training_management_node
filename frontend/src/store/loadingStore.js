// store/loadingStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isActive = ref(false);
  const message = ref('Loading...');

  function show(msg = 'Processing...') {
    message.value = msg;
    isActive.value = true;
  }

  function hide() {
    isActive.value = false;
  }

  return { isActive, message, show, hide };
});
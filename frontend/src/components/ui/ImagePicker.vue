<template>
  <div class="w-full">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>

    <div
        class="relative flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        :class="error ? 'border-red-500' : 'border-gray-300'"
        @click="$refs.fileInput.click()"
    >
      <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".png, .jpg, .jpeg, image/png, image/jpeg"
          @change="handleFileChange"
      />

      <div v-if="previewUrl" class="relative w-full h-full p-2">
        <img
            :src="previewUrl"
            class="max-h-48 w-full object-contain rounded-lg"
            alt="Preview"
        />
        <button
            type="button"
            @click.stop="removeImage"
            class="absolute top-4 right-4 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 16" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2l2 2"/>
        </svg>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">Click to upload banner</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 2MB)</p>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: [File, String], // Can be a File object or an existing URL string
    error: String
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      previewUrl: null
    }
  },
  watch: {
    // If you pass an existing image URL from the DB
    modelValue: {
      immediate: true,
      handler(newVal) {
        if (typeof newVal === 'string') {
          this.previewUrl = newVal;
        } else if (!newVal) {
          this.previewUrl = null;
        }
      }
    }
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      // 1. Validate File Type
      const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowed.includes(file.type)) {
        this.$emit('error', 'Only PNG and JPG files are allowed');
        return;
      }

      // 2. Create Preview
      this.previewUrl = URL.createObjectURL(file);

      // 3. Update v-model and emit change
      this.$emit('update:modelValue', file);
      this.$emit('change', file);
    },
    removeImage() {
      this.previewUrl = null;
      this.$refs.fileInput.value = '';
      this.$emit('update:modelValue', null);
    }
  }
}
</script>
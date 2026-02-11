<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
          error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
        ]"
      />
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: [String, Number],
    id: String,
    label: String,
    placeholder: String,
    error: String,
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'number', 'email', 'password', 'tel', 'url'].includes(value)
    }
  },
  emits: ['update:modelValue']
}
</script>
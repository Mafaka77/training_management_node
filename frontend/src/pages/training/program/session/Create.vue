<template>
  <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div
        class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/10 transform transition-all text-zinc-900 dark:text-zinc-100">
        
        <!-- Header -->
        <div
          class="px-6 py-4 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02] rounded-t-2xl">
          <div class="flex items-center gap-2">
            <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {{ isEditMode ? 'Edit Training Session' : 'Add New Training Session' }}
            </h3>
          </div>
          <button @click="closeModal"
            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <BaseInput v-model="sessionForm.tc_topic" label="Session Topic / Module"
            placeholder="e.g. Fundamental Administrative Rules" required />

          <div class="space-y-1.5 relative z-30">
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Assigned Faculty Trainer</label>
            <SearchSelect v-model="sessionForm.trainer" :options="trainers" option-label="full_name" placeholder="Search trainer..." />
          </div>

          <div class="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <BaseInput v-model="sessionForm.tc_date" type="date" label="Session Date" required />
            </div>
            <div>
              <BaseInput v-model="sessionForm.tc_session" type="number" label="Session Number" min="1" required />
            </div>
            <div>
              <BaseInput v-model="sessionForm.tc_start_time" type="time" label="Start Time" required />
            </div>
            <div>
              <BaseInput v-model="sessionForm.tc_end_time" type="time" label="End Time" required />
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-white/5">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer">
              <span v-if="isSubmitting"
                class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ isEditMode ? 'Update Session' : 'Save Session' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, reactive, watch } from 'vue';
import BaseInput from '../../../../components/ui/BaseInput.vue';
import SearchSelect from '../../../../components/ui/SearchSelect.vue';
import { useAlertStore } from '../../../../store/alertStore';
import { useSessionStore } from '../../../../store/sessionStore';

const props = defineProps({
  show: { type: Boolean, default: false },
  programId: { type: String, required: true },
  sessionData: { type: Object, default: null },
  nextSessionNum: { type: Number, default: 1 }
});

const emit = defineEmits(['close', 'saved']);

const alertStore = useAlertStore();
const sessionStore = useSessionStore();

const { trainers, isSubmitting } = storeToRefs(sessionStore);

const isEditMode = computed(() => !!props.sessionData?._id);

const sessionForm = reactive({
  _id: '',
  t_program: '',
  training_program: '',
  trainer: null,
  tc_topic: '',
  tc_date: '',
  tc_session: 1,
  tc_start_time: '',
  tc_end_time: ''
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (!trainers.value || !trainers.value.length) {
        sessionStore.fetchTrainers();
      }

      if (props.sessionData) {
        Object.assign(sessionForm, {
          _id: props.sessionData._id,
          t_program: props.programId,
          training_program: props.programId,
          trainer: props.sessionData.trainer?._id || props.sessionData.trainer || null,
          tc_topic: props.sessionData.tc_topic || '',
          tc_date: props.sessionData.tc_date ? props.sessionData.tc_date.split('T')[0] : '',
          tc_session: props.sessionData.tc_session || 1,
          tc_start_time: props.sessionData.tc_start_time || '10:00',
          tc_end_time: props.sessionData.tc_end_time || '12:00'
        });
      } else {
        Object.assign(sessionForm, {
          _id: '',
          t_program: props.programId,
          training_program: props.programId,
          trainer: null,
          tc_topic: '',
          tc_date: new Date().toISOString().split('T')[0],
          tc_session: props.nextSessionNum,
          tc_start_time: '10:00',
          tc_end_time: '12:00'
        });
      }
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('close');
};

const handleSubmit = async () => {
  if (!sessionForm.tc_topic) {
    alertStore.error('Please enter a session topic');
    return;
  }

  try {
    let res;
    if (isEditMode.value) {
      res = await sessionStore.updateSession(sessionForm._id, sessionForm);
    } else {
      res = await sessionStore.createSession(sessionForm);
    }

    if (res && res.success === false) {
      alertStore.error(res.message || 'Operation failed');
      return;
    }

    alertStore.success(isEditMode.value ? 'Session updated successfully' : 'Session created successfully');
    emit('saved');
    emit('close');
  } catch (error) {
    alertStore.error(error.message || 'Operation failed');
  }
};
</script>
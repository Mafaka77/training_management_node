<template>
    <div class="p-6 max-w-4xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
            <button @click="goBack"
                class="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                title="Go Back">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Create Evaluation Question</h1>
                <p class="text-slate-500 text-sm mt-1">Add a new question to the evaluation bank.</p>
            </div>
        </div>

        <div class="bg-white rounded-[24px]  border border-slate-200 overflow-hidden">
            <form id="createQuestionForm" @submit.prevent="handleSubmit">
                <div class="p-6 md:p-8 space-y-8">

                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-bold text-slate-700">Question Text <span
                                    class="text-red-500">*</span></label>
                            <p class="text-xs text-slate-500 mt-1">Phrased clearly for the participant to understand.
                            </p>
                        </div>
                        <BaseTextArea v-model="formData.question_text" label="Question Text" required rows="3"
                            placeholder="e.g., How would you rate the overall effectiveness of the training module?" />
                        <SingleSelect v-model="formData.category" :options="categories" track-by="_id"
                            option-label="name" label="Category" placeholder="Select Category" />
                        <SingleSelect v-model="formData.input_type" :options="inputs" track-by="_id" option-label="name"
                            label="Input Type" placeholder="Select Input Type" />
                    </div>

                    <hr class="border-slate-100">

                    <div class="space-y-6">
                        <h3 class="text-base font-bold text-slate-800">Settings</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer"
                                @click="formData.is_mandatory = !formData.is_mandatory">
                                <div>
                                    <p class="text-sm font-bold text-slate-800">Mandatory</p>
                                    <p class="text-xs text-slate-500 mt-0.5">Require an answer to submit.</p>
                                </div>
                                <button type="button" :class="formData.is_mandatory ? 'bg-indigo-600' : 'bg-slate-300'"
                                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                    <span :class="formData.is_mandatory ? 'translate-x-5' : 'translate-x-0'"
                                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                </button>
                            </div>

                            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer"
                                @click="formData.is_active = !formData.is_active">
                                <div>
                                    <p class="text-sm font-bold text-slate-800">Active Status</p>
                                    <p class="text-xs text-slate-500 mt-0.5">Include in new evaluations.</p>
                                </div>
                                <button type="button" :class="formData.is_active ? 'bg-emerald-500' : 'bg-slate-300'"
                                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                    <span :class="formData.is_active ? 'translate-x-5' : 'translate-x-0'"
                                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="p-6 md:px-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button type="button" @click="goBack"
                        class="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSaving"
                        class="px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 shadow-md shadow-indigo-200 transition-all active:scale-95">
                        <svg v-if="isSaving" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        {{ isSaving ? 'Saving...' : 'Save Question' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import SingleSelect from '../../../components/ui/SingleSelect.vue';
import { useAlertStore } from '../../../store/alertStore';
import { useEvaluationStore } from '../../../store/evaluationStore';
const router = useRouter();
const store = useEvaluationStore();
const alert = useAlertStore();
const { isLoading, isSaving } = storeToRefs(store);

// Initial state matching the Mongoose schema defaults
const formData = reactive({
    question_text: '',
    input_type: 'rating',
    category: 'Course',
    is_mandatory: false,
    is_active: true
});
const categories = [
    {
        _id: 'Course',
        name: 'Course Evaluation'
    },
    {
        _id: 'Trainer',
        name: 'Trainer Evaluation'
    }
];
const inputs = [
    {
        _id: 'rating',
        name: 'Rating'
    },
    {
        _id: 'text',
        name: 'Text'
    }, {
        _id: 'boolean',
        name: 'Boolean'
    }
]
const goBack = () => {
    router.back();
};

const handleSubmit = async () => {
    isSaving.value = true;
    try {
        const response = await store.storeEvaluation(formData)
        if (response.success) {
            alert.success(response.message)
            router.back();
        }
        else {
            alert.error(response.message)
        }

    } catch (error) {
        console.error("Failed to save question  ", error);
        // alert.error("An error occurred while saving.");
    } finally {
        isSaving.value = false;
    }
};
</script>
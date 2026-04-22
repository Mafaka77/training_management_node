<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Evaluations Question</h1>

            </div>

            <div class="flex items-center gap-3">

                <router-link :to="`/admin/master/evaluation/create`"
                    class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2 active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    New Evaluation
                </router-link>
            </div>
        </div>

        <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="border-b border-slate-100 p-4 bg-slate-50 flex gap-4">
                <div v-for="i in 4" :key="'th-' + i" class="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
            </div>
            <div class="divide-y divide-slate-100">
                <div v-for="i in 5" :key="'tr-' + i" class="p-4 flex items-center gap-4 animate-pulse">
                    <div class="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div class="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div class="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div class="h-8 bg-slate-100 rounded w-16 ml-auto"></div>
                </div>
            </div>
        </div>

        <div v-else>
            <div v-if="evaluations && evaluations.length > 0"
                class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th class="p-4 pl-6 w-1/3 md:w-2/5">Question Text</th>
                                <th class="p-4">Category / Type</th>
                                <th class="p-4">Requirement</th>
                                <th class="p-4">Status</th>
                                <th class="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            <tr v-for="question in evaluations" :key="question._id"
                                class="hover:bg-slate-50 transition-colors group">

                                <td class="p-4 pl-6">
                                    <div class="font-bold text-slate-800 line-clamp-2" :title="question.question_text">
                                        {{ question.question_text }}
                                    </div>
                                    <div class="text-xs text-slate-500 mt-1">
                                        Added {{ formatDate(question.createdAt) }}
                                    </div>
                                </td>

                                <td class="p-4">
                                    <div class="font-bold text-slate-700">{{ question.category }}</div>
                                    <div class="text-xs text-slate-500 capitalize">{{ question.input_type }}</div>
                                </td>

                                <td class="p-4">
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                                        :class="question.is_mandatory ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'">
                                        {{ question.is_mandatory ? 'Mandatory' : 'Optional' }}
                                    </span>
                                </td>

                                <td class="p-4">
                                    <span class="px-2.5 py-1 rounded-full text-xs font-bold"
                                        :class="question.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                                        {{ question.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="p-4 pr-6 text-right">
                                    <div
                                        class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                        <button @click="editQuestion(question)"
                                            class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="Edit Question">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <button @click="confirmDelete(question._id)"
                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    class="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                    <div>Showing <span class="font-bold text-slate-700">{{ evaluations.length }}</span> questions
                    </div>
                </div>
            </div>

            <div v-else
                class="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-700">No Questions Found</h3>
                <p class="text-slate-500 text-sm max-w-xs text-center mt-2">
                    There are no evaluation questions set up in the bank yet. Click "Create" to add one.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Adjust this import path based on your actual store structure
import { useAlertStore } from '../../../store/alertStore';
import { useEvaluationStore } from '../../../store/evaluationStore';
import { formatDate } from '../../../utils/dateFormatter';
const alert = useAlertStore();

const route = useRoute();
const router = useRouter();
const trainingId = route.params.id;

const evaluationStore = useEvaluationStore();
const { evaluations, isLoading } = storeToRefs(evaluationStore);


onMounted(() => {
    evaluationStore.fetchEvaluationQuestions();
});

const viewDetails = (id) => {
    router.push(`/admin/training/${trainingId}/evaluations/${id}`);
};

const confirmDelete = async (id) => {
    if (confirm("Are you sure you want to delete this evaluation record?")) {
        const response = await evaluationStore.deleteEvaluationQuestion(id);
        if (response.success) {
            alert.success(response.message);
            evaluationStore.fetchEvaluationQuestions();
        } else {
            alert.error(response.message);
        }
    }
};
</script>
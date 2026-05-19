<template>
    <div class="max-w-4xl mx-auto space-y-6">

        <div class="flex items-center gap-4 mb-8">
            <button @click="router.back()"
                class="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5 transition-all shadow-sm group">
                <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Evaluation Details</h1>
                <p class="text-sm text-slate-500 mt-1">Detailed breakdown of the trainee's feedback.</p>
            </div>
        </div>

        <div v-if="store.isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <span class="text-sm font-bold text-zinc-400 animate-pulse">Loading evaluation...</span>
        </div>

        <div v-else-if="evaluation">
            <div
                class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">

                <div class="flex items-center gap-4">
                    <div
                        class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 shrink-0">
                        <span class="text-xl font-black text-indigo-600 dark:text-indigo-400 uppercase">
                            {{ evaluation.trainee?.full_name?.charAt(0) || '?' }}
                        </span>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {{ evaluation.trainee?.full_name || 'Anonymous Trainee' }}
                        </h2>
                        <div class="flex items-center gap-3 mt-1">
                            <span
                                class="text-xs font-mono text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                ID: {{ evaluation.trainee_id?.slice(-6) || 'N/A' }}
                            </span>
                            <span class="text-xs font-medium text-zinc-500 flex items-center gap-1">
                                <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(evaluation.createdAt) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right mb-1">
                            Overall Score</p>
                        <p class="text-2xl font-black text-zinc-800 dark:text-zinc-100 text-right">
                            {{ totalScore }} <span class="text-sm text-zinc-400">/ {{ maxScore }}</span>
                        </p>
                    </div>
                    <div class="relative w-12 h-12 flex items-center justify-center rounded-full"
                        :class="scoreBackground">
                        <span class="text-xs font-black" :class="scoreText">{{ percentage }}%</span>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-sm font-black uppercase tracking-widest text-zinc-500 mb-3 px-2">Question Breakdown</h3>

                <div class="space-y-2">
                    <div v-for="(answer, index) in paginatedAnswers" :key="answer.question_id"
                        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 group">

                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <div class="flex items-start gap-2.5 mb-1.5">
                                    <span
                                        class="mt-0.5 shrink-0 w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-black text-zinc-500">
                                        Q{{ getQuestionNumber(index) }}
                                    </span>
                                    <p class="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 leading-snug pr-2">
                                        {{ answer.question_text || 'Unknown Question' }}
                                    </p>
                                </div>

                                <div v-if="answer.text_answer" class="mt-2 pl-[30px]">
                                    <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                        Written Feedback</p>
                                    <p
                                        class="text-xs text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-white/5">
                                        "{{ answer.text_answer }}"
                                    </p>
                                </div>
                            </div>

                            <div class="shrink-0 flex flex-col items-end">
                                <span
                                    class="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Score</span>
                                <div
                                    class="flex items-baseline gap-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                    <span class="text-base font-black">{{ answer.score }}</span>
                                    <span class="text-[10px] font-bold opacity-50">/10</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3 w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div class="h-full transition-all duration-1000 rounded-full"
                                :class="getBarColor(answer.score)" :style="{ width: (answer.score * 10) + '%' }"></div>
                        </div>
                    </div>
                </div>

                <div v-if="totalAnswerPages > 1"
                    class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                        Showing {{ ((currentAnswerPage - 1) * answersPerPage) + 1 }} to {{ Math.min(currentAnswerPage *
                            answersPerPage, totalAnswers) }} of {{ totalAnswers }} questions
                    </p>
                    <div class="flex gap-2">
                        <button @click="changePage(currentAnswerPage - 1)" :disabled="currentAnswerPage === 1"
                            class="px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Prev
                        </button>

                        <div class="flex items-center gap-1 px-1 hidden sm:flex">
                            <button v-for="page in totalAnswerPages" :key="page" @click="changePage(page)"
                                :class="['w-7 h-7 rounded-lg text-xs font-bold transition-all', currentAnswerPage === page ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5']">
                                {{ page }}
                            </button>
                        </div>

                        <button @click="changePage(currentAnswerPage + 1)"
                            :disabled="currentAnswerPage === totalAnswerPages"
                            class="px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEvaluationStore } from '../../../../store/evaluationStore'; // Adjust path
import { formatDate } from '../../../../utils/dateFormatter'; // Adjust path

const route = useRoute();
const router = useRouter();
const store = useEvaluationStore();

const evaluationId = route.params.evaluationId;

// Safely grab the current evaluation from the store
const evaluation = computed(() => store.evaluation);

// --- Local Pagination State ---
const currentAnswerPage = ref(1);
const answersPerPage = ref(10); // Adjust as needed, e.g., 5 or 10

const totalAnswers = computed(() => evaluation.value?.answers?.length || 0);

const totalAnswerPages = computed(() => {
    return Math.ceil(totalAnswers.value / answersPerPage.value);
});

const paginatedAnswers = computed(() => {
    if (!evaluation.value?.answers) return [];
    const start = (currentAnswerPage.value - 1) * answersPerPage.value;
    const end = start + answersPerPage.value;
    return evaluation.value.answers.slice(start, end);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalAnswerPages.value) {
        currentAnswerPage.value = page;
        window.scrollTo({ top: 250, behavior: 'smooth' });
    }
};

// Keeps the Q1, Q2 matching the actual array position, not just the current page position
const getQuestionNumber = (index) => {
    return ((currentAnswerPage.value - 1) * answersPerPage.value) + index + 1;
};

// --- Math & Calculations (Runs on FULL array, not paginated array) ---
const totalScore = computed(() => {
    if (!evaluation.value?.answers) return 0;
    return evaluation.value.answers.reduce((sum, item) => sum + (item.score || 0), 0);
});

const maxScore = computed(() => {
    if (!evaluation.value?.answers) return 0;
    return evaluation.value.answers.length * 10;
});

const percentage = computed(() => {
    if (maxScore.value === 0) return 0;
    return Math.round((totalScore.value / maxScore.value) * 100);
});

// --- Dynamic Styling ---
const scoreBackground = computed(() => {
    if (percentage.value >= 80) return 'bg-emerald-100 dark:bg-emerald-500/20';
    if (percentage.value >= 50) return 'bg-amber-100 dark:bg-amber-500/20';
    return 'bg-red-100 dark:bg-red-500/20';
});

const scoreText = computed(() => {
    if (percentage.value >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (percentage.value >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
});

const getBarColor = (score) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-amber-400';
    return 'bg-red-500';
};

// --- Lifecycle ---
onMounted(() => {
    store.fetchEvaluationById(evaluationId);
});
</script>
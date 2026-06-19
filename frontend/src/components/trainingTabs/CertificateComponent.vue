<template>
    <div class="mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div class="flex items-center gap-4">
                <h1 class="text-2xl font-bold text-slate-800">Certificates</h1>
                <button @click="showBatchModal = true"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Batch Generate (>75%)
                </button>
            </div>

            <div v-if="!store.isCertificateLoading && store.certificates?.length > 0" class="flex items-center gap-3">
                <label class="text-sm font-bold text-slate-500">Sort by:</label>
                <div class="flex bg-slate-100 p-1 rounded-xl">
                    <button @click="setSort('createdAt')"
                        :class="['px-3 py-1.5 text-sm font-semibold rounded-lg transition-all', store.sortKey === 'createdAt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
                        Date
                        <span v-if="store.sortKey === 'createdAt'">{{ store.sortOrder === 'desc' ? '↓' : '↑' }}</span>
                    </button>
                    <button @click="setSort('full_name')"
                        :class="['px-3 py-1.5 text-sm font-semibold rounded-lg transition-all', store.sortKey === 'full_name' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
                        Name
                        <span v-if="store.sortKey === 'full_name'">{{ store.sortOrder === 'asc' ? '↓' : '↑' }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="store.isCertificateLoading" class="space-y-4">
            <div v-for="i in store.itemsPerPage" :key="i"
                class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-slate-200"></div>
                    <div>
                        <div class="h-4 w-40 bg-slate-200 rounded mb-2"></div>
                        <div class="h-3 w-24 bg-slate-100 rounded"></div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="h-9 w-32 bg-slate-200 rounded-xl"></div>
                    <div class="h-9 w-9 bg-slate-200 rounded-lg"></div>
                    <div class="h-9 w-9 bg-slate-200 rounded-lg"></div>
                </div>
            </div>
        </div>

        <div v-else>
            <!-- STAGING -->
            <!-- <form ref="eMudhraForm" method="post" action="https://demogateway-core.emsigner.com/Secure/index"
                class="hidden"> -->
            <form ref="eMudhraForm" method="post" action="https://gateway-core.emsigner.com/Secure/index"
                class="hidden">
                <input type="hidden" name="Parameter1" :value="store.params?.parameter1" />
                <input type="hidden" name="Parameter2" :value="store.params?.parameter2" />
                <input type="hidden" name="Parameter3" :value="store.params?.parameter3" />
            </form>

            <div v-if="store.certificates?.length > 0" class="space-y-4">
                <div v-for="certificate in store.certificates" :key="certificate.id || certificate._id"
                    class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between group gap-4">

                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-800">{{ certificate.user?.full_name || 'Unknown Trainee' }}
                            </h3>
                            <p class="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                                Generated: {{ formatDate(certificate.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <!-- <div v-if="!certificate.is_signed">
                            <button @click="handleSignDocument(certificate._id)" :disabled="store.isSigning"
                                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-md shadow-indigo-100 active:scale-95">
                                <svg v-if="store.isSigning" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                {{ store.isSigning ? 'Signing...' : 'Sign Document' }}
                            </button>
                        </div> -->

                        <a v-if="certificate.certificate_url" :href="certificate.certificate_url" target="_blank"
                            class="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-sm font-semibold transition-all"
                            title="View Certificate">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                        </a>
                        <div v-else class="flex items-center gap-2 px-4 py-2 text-amber-600 bg-amber-50 rounded-xl text-sm font-semibold">
                            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </div>

                        <div>
                            <div>
                                <button @click="store.showDeleteConfirm = true"
                                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>


                            <Transition name="fade">
                                <div v-if="store.showDeleteConfirm"
                                    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                                    <div class="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl scale-in">
                                        <div
                                            class="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>

                                        <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Certificate?</h3>
                                        <p class="text-slate-500 text-sm leading-relaxed mb-6">
                                            Are you sure you want to remove this document? This action will permanently
                                            delete the file from the server and cannot be undone.
                                        </p>

                                        <div class="flex gap-3">
                                            <button @click="store.showDeleteConfirm = false"
                                                class="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                                                Cancel
                                            </button>
                                            <button @click="confirmDelete(certificate)"
                                                :disabled="store.isCertificateLoading"
                                                class="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 transition-all flex items-center justify-center gap-2">
                                                <svg v-if="store.isCertificateLoading"
                                                    class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <div v-if="store.totalPages > 1"
                    class="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-slate-200 gap-4">
                    <p class="text-sm text-slate-500">
                        Showing <span class="font-bold text-slate-700">{{ ((store.currentPage - 1) * store.itemsPerPage)
                            + 1 }}</span> to <span class="font-bold text-slate-700">{{ Math.min(store.currentPage *
                                store.itemsPerPage, store.totalItems || 0) }}</span> of
                        <span class="font-bold text-slate-700">{{ store.totalItems || 0 }}</span> results
                    </p>
                    <div class="flex items-center gap-2">
                        <button @click="changePage(store.currentPage - 1)" :disabled="store.currentPage === 1"
                            class="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                            Previous
                        </button>

                        <div class="flex items-center gap-1 px-2">
                            <button v-for="page in store.totalPages" :key="page" @click="changePage(page)"
                                :class="['w-8 h-8 rounded-lg text-sm font-bold transition-all', store.currentPage === page ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100']">
                                {{ page }}
                            </button>
                        </div>

                        <button @click="changePage(store.currentPage + 1)"
                            :disabled="store.currentPage === store.totalPages"
                            class="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                            Next
                        </button>
                    </div>
                </div>

            </div>

            <div v-else
                class="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-700">No Certificates Found</h3>
                <p class="text-slate-400 text-sm max-w-xs text-center mt-2">
                    Certificates have not been generated for this training program yet.
                </p>
            </div>
        </div>

        <!-- Batch Generation Modal -->
        <Transition name="fade">
            <div v-if="showBatchModal"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div class="bg-white rounded-[28px] w-full max-w-md p-6 shadow-2xl scale-in">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-slate-900">Batch Generate Certificates</h3>
                        <button @click="showBatchModal = false" class="text-slate-400 hover:text-slate-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base
                                Font</label>
                            <select v-model="batchOptions.baseFont"
                                class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="'Times New Roman', serif">Times New Roman</option>
                                <option value="'Georgia', serif">Georgia</option>
                                <option value="'Arial', sans-serif">Arial</option>
                                <option value="'Montserrat', sans-serif">Montserrat</option>
                            </select>
                        </div>
                        <div>
                            <label
                                class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Decorative
                                Font</label>
                            <select v-model="batchOptions.cursiveFont"
                                class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="'Satisfy', cursive">Satisfy</option>
                                <option value="'Pinyon Script', cursive">Pinyon Script</option>
                                <option value="'Great Vibes', cursive">Great Vibes</option>
                                <option value="'Playfair Display', serif">Playfair Display</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color
                                Theme</label>
                            <select v-model="batchOptions.themeColor"
                                class="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="#2563eb">Royal Blue</option>
                                <option value="#059669">Emerald Green</option>
                                <option value="#dc2626">Crimson Red</option>
                                <option value="#4f46e5">Indigo</option>
                                <option value="#ea580c">Burnt Orange</option>
                                <option value="#d97706">Premium Gold</option>
                                <option value="#1f2937">Classic Charcoal</option>
                            </select>
                        </div>
                    </div>

                    <p class="text-sm text-slate-500 mb-6 bg-blue-50 p-3 rounded-xl border border-blue-100">
                        This will check attendance for all trainees. Anyone with <strong>75% or higher</strong>
                        attendance
                        who doesn't already have a certificate will be added to the background queue.
                    </p>

                    <div class="flex gap-3">
                        <button @click="showBatchModal = false"
                            class="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                            Cancel
                        </button>
                        <button @click="handleBatchGenerate" :disabled="isGenerating"
                            class="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center justify-center gap-2">
                            <svg v-if="isGenerating" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Start Job
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../../store/alertStore';
import { useCertificateStore } from '../../store/certificateStore';
import { formatDate } from '../../utils/dateFormatter';

const alert = useAlertStore();
const router = useRouter();
const store = useCertificateStore();
const route = useRoute();
const trainingId = route.params.id;
const eMudhraForm = ref(null);

const showBatchModal = ref(false);
const isGenerating = ref(false);
const batchOptions = ref({
    baseFont: "'Times New Roman', serif",
    cursiveFont: "'Satisfy', cursive",
    themeColor: "#2563eb"
});

// Core fetch function
let pollTimer = null;

const loadData = async () => {
    await store.fetchCertificates(trainingId);
    checkPolling();
};

const checkPolling = () => {
    if (pollTimer) clearTimeout(pollTimer);
    
    // Check if any certificates are still generating
    const needsPolling = store.certificates.some(c => c.status === 'processing' || !c.certificate_url);
    if (needsPolling) {
        pollTimer = setTimeout(() => {
            loadData();
        }, 3000);
    }
};

onUnmounted(() => {
    if (pollTimer) clearTimeout(pollTimer);
});

// Handlers directly mutate the store state
const changePage = (page) => {
    if (page >= 1 && page <= store.totalPages) {
        store.currentPage = page;
        loadData();
    }
};

const setSort = (key) => {
    if (store.sortKey === key) {
        store.sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        store.sortKey = key;
        store.sortOrder = key === 'createdAt' ? 'desc' : 'asc';
    }
    store.currentPage = 1; // Reset to page 1 on sort change
    loadData();
};

const handleSignDocument = async (certificateId) => {
    try {
        const response = await store.handleCertificateSignature(certificateId);
        if (response.success) {
            console.log(store.params);
            await nextTick();
            eMudhraForm.value.submit();
        }
    } catch (ex) { }
}

const confirmDelete = async (certificate) => {
    const response = await store.deleteCertificate(certificate._id);
    if (response.success) {
        store.showDeleteConfirm = false;
        loadData(); // Refresh list after delete
        alert.success(response.message);
    } else {
        alert.error(response.message);
    }
}

const handleBatchGenerate = async () => {
    isGenerating.value = true;
    try {
        const res = await store.batchGenerateCertificates(trainingId, batchOptions.value);
        if (res.success) {
            alert.success(res.message);
            showBatchModal.value = false;
            loadData(); // Refresh to see "processing" statuses if mapped
        } else {
            alert.error(res.message);
        }
    } catch (e) {
        console.error(e);
        alert.error("An error occurred");
    } finally {
        isGenerating.value = false;
    }
}

onMounted(() => {
    // Check if we switched to a DIFFERENT training program. 
    // If so, reset the filters back to page 1.
    if (store.currentTrainingId !== trainingId) {
        store.resetQueryState();
        store.currentTrainingId = trainingId;
    }

    loadData();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-in {
    animation: scaleIn 0.2s ease-out forwards;
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
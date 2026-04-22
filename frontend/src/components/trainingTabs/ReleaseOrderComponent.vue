<template>
    <div class=" mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Release Order</h1>
            </div>
        </div>

        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 2" :key="i"
                class="h-24 w-full bg-slate-100 animate-pulse rounded-2xl border border-slate-200"></div>
        </div>

        <div v-else>
            <div v-if="releaseOrder" class="space-y-4">
                <div
                    class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        <div>
                            <h3 class="font-bold text-slate-800">Official Release Order</h3>
                            <p class="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                                Generated: {{ formatDate(releaseOrder.createdAt) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <button @click="handleSignDocument" :disabled="isSigning"
                            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-md shadow-indigo-100 active:scale-95">
                            <svg v-if="isSigning" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
                            {{ isSigning ? 'Signing...' : 'Sign Document' }}
                        </button>

                        <a v-if="releaseOrder.is_signed" :href="releaseOrder.release_order_url" target="_blank"
                            class="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                            title="Preview Signed Document">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </a>
                        <form ref="eMudhraForm" method="post"
                            action="https://demogateway-core.emsigner.com/Secure/index">
                            <input type="hidden" name="Parameter1" :value="params.parameter1" />
                            <input type="hidden" name="Parameter2" :value="params.parameter2" />
                            <input type="hidden" name="Parameter3" :value="params.parameter3" />
                        </form>
                        <div>
                            <button @click="showDeleteConfirm = true"
                                class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <Transition name="fade">
                                <div v-if="showDeleteConfirm"
                                    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                                    <div class="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-2xl scale-in">
                                        <div
                                            class="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>

                                        <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Release Order?</h3>
                                        <p class="text-slate-500 text-sm leading-relaxed mb-6">
                                            Are you sure you want to remove this document? This action will permanently
                                            delete the file from the server and cannot be undone.
                                        </p>

                                        <div class="flex gap-3">
                                            <button @click="showDeleteConfirm = false"
                                                class="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                                                Cancel
                                            </button>
                                            <button @click="confirmDelete(releaseOrder)" :disabled="isLoading"
                                                class="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 transition-all flex items-center justify-center gap-2">
                                                <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white"
                                                    viewBox="0 0 24 24">
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
            </div>

            <div v-else
                class="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-700">No Release Order Found</h3>
                <p class="text-slate-400 text-sm max-w-xs text-center mt-2">
                    A release order has not been generated for this training program yet.
                </p>
                <button @click="generateReleaseOrder"
                    class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">
                    Generate Now
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../../store/alertStore';
import { useCertificateStore } from '../../store/certificateStore';
import { formatDate } from '../../utils/dateFormatter'; // Import your utility
const alert = useAlertStore();
const router = useRouter();
const certificateStore = useCertificateStore();
const { releaseOrder, isLoading, isSigning, showDeleteConfirm, params } = storeToRefs(certificateStore);
const route = useRoute();
const trainingId = route.params.id;
const eMudhraForm = ref(null)
const handleSignDocument = async () => {
    try {
        const response = await certificateStore.handleSignDocument(trainingId);
        if (response.success) {
            console.log(params.value);
            await nextTick();
            eMudhraForm.value.submit();
        }
    } catch (ex) { }
}
const confirmDelete = async () => {
    const response = await certificateStore.deleteReleaseOrder(trainingId);
    if (response.success) {
        showDeleteConfirm.value = false;
        certificateStore.getReleaseOrder(trainingId);
        alert.success(response.message);
    } else {
        alert.error(response.message);
    }
}
const generateReleaseOrder = async () => {
    router.push({ name: 'training.release-order', params: { id: route.params.id } });
}
onMounted(() => {
    certificateStore.getReleaseOrder(trainingId);
});
</script>
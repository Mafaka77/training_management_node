<template>
    <div class="min-h-screen bg-zinc-100 p-2 flex flex-col items-center print:p-0 print:bg-white text-black font-serif">

        <div class="fixed top-20 right-8 flex gap-4 z-[100] print:hidden">
            <button @click="generatePDF" :disabled="isLoading || isDownloading"
                class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95">
                <svg v-if="isDownloading" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ isDownloading ? 'Generating...' : 'Download Official PDF' }}
            </button>
            <button @click="closePreview"
                class="bg-white hover:bg-zinc-50 text-zinc-700 px-8 py-3 rounded-full border border-zinc-200 font-bold shadow-md transition-all">
                Close
            </button>
        </div>

        <div id="release-order-document" class="w-[210mm] print:w-[210mm]">

            <template v-if="isLoading">
                <section
                    class="relative bg-white shadow-2xl p-[25mm] w-[210mm] h-[297mm] flex flex-col mb-10 animate-pulse">
                    <div class="flex flex-col items-center mb-8 space-y-3">
                        <div class="h-4 bg-zinc-200 rounded w-48"></div>
                        <div class="h-6 bg-zinc-300 rounded w-64 mt-2"></div>
                        <div class="h-5 bg-zinc-200 rounded w-72"></div>
                        <div class="h-4 bg-zinc-200 rounded w-32"></div>
                        <div class="w-24 h-0.5 bg-zinc-300 mx-auto mt-2"></div>
                        <div class="h-4 bg-zinc-200 rounded w-40 mt-4"></div>
                    </div>

                    <div class="mb-10 flex justify-center">
                        <div class="h-6 bg-zinc-300 rounded w-48"></div>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-3">
                            <div class="h-4 bg-zinc-200 rounded w-full"></div>
                            <div class="h-4 bg-zinc-200 rounded w-full"></div>
                            <div class="h-4 bg-zinc-200 rounded w-5/6"></div>
                        </div>
                        <div class="space-y-3">
                            <div class="h-4 bg-zinc-200 rounded w-full"></div>
                            <div class="h-4 bg-zinc-200 rounded w-4/6"></div>
                        </div>
                    </div>

                    <div class="mt-12 self-end w-80 flex flex-col items-center space-y-2">
                        <div class="h-4 bg-zinc-300 rounded w-48"></div>
                        <div class="h-4 bg-zinc-200 rounded w-32"></div>
                        <div class="h-3 bg-zinc-200 rounded w-56 mt-1"></div>
                        <div class="h-3 bg-zinc-200 rounded w-40"></div>
                    </div>

                    <div class="mt-auto pt-6 border-t border-zinc-200 leading-relaxed">
                        <div class="flex justify-between mb-4">
                            <div class="h-4 bg-zinc-300 rounded w-64"></div>
                            <div class="h-4 bg-zinc-300 rounded w-48"></div>
                        </div>
                        <div class="space-y-3 pl-4">
                            <div class="h-4 bg-zinc-300 rounded w-24"></div>
                            <div v-for="i in 4" :key="i" class="flex gap-2">
                                <div class="w-4 h-4 bg-zinc-200 rounded"></div>
                                <div class="h-4 bg-zinc-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 self-end w-80 flex flex-col items-center space-y-2">
                        <div class="h-4 bg-zinc-300 rounded w-48"></div>
                        <div class="h-4 bg-zinc-200 rounded w-32"></div>
                        <div class="h-3 bg-zinc-200 rounded w-56 mt-1"></div>
                        <div class="h-3 bg-zinc-200 rounded w-40"></div>
                    </div>
                </section>

                <section class="relative bg-white shadow-2xl p-[25mm] w-[210mm] h-[297mm] flex flex-col animate-pulse">
                    <div class="text-center mb-8 flex flex-col items-center space-y-4">
                        <div class="h-6 bg-zinc-300 rounded w-32"></div>
                        <div class="space-y-2 flex flex-col items-center">
                            <div class="h-4 bg-zinc-200 rounded w-80"></div>
                            <div class="h-5 bg-zinc-300 rounded w-96"></div>
                            <div class="h-4 bg-zinc-200 rounded w-64"></div>
                        </div>
                    </div>

                    <table class="w-full border-collapse border-[1.5px] border-zinc-300 text-sm">
                        <thead>
                            <tr class="bg-zinc-50 h-10">
                                <th v-for="col in 4" :key="col" class="border border-zinc-300 p-2">
                                    <div class="h-3 bg-zinc-300 rounded w-full"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in 5" :key="row" class="h-10">
                                <td class="border border-zinc-200 p-2">
                                    <div class="h-3 bg-zinc-200 rounded w-6 mx-auto"></div>
                                </td>
                                <td class="border border-zinc-200 px-4">
                                    <div class="h-3 bg-zinc-200 rounded w-3/4"></div>
                                </td>
                                <td class="border border-zinc-200 px-4">
                                    <div class="h-3 bg-zinc-200 rounded w-5/6"></div>
                                </td>
                                <td class="border border-zinc-200 px-4">
                                    <div class="h-3 bg-zinc-200 rounded w-4/5"></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </template>

            <template v-else>
                <section
                    class="relative bg-white shadow-1xl print:shadow-none p-[25mm] w-[210mm] h-[297mm] flex flex-col page-break mb-10 print:mb-0">

                    <div class="relative z-10 flex flex-col h-full">
                        <div class="flex flex-col mb-8 text-center leading-tight">
                            <p class="text-base font-sans">No. A.33029/2/2024-ATI</p>
                            <p class="font-bold uppercase text-xl mt-2">Government of Mizoram</p>
                            <p class="font-bold uppercase text-lg">Administrative Training Institute</p>
                            <p class="text-base italic">Aizawl : Mizoram</p>
                            <p class="mt-4 font-medium italic">
                                Dated Aizawl, the {{ currentFormattedDate }}
                            </p>
                        </div>

                        <div class=" mb-10 text-center">
                            <h2
                                class="text-xl font-bold underline decoration-2 underline-offset-8 uppercase tracking-widest">
                                OFFICE ORDER
                            </h2>
                        </div>

                        <div class="text-justify text-[1rem] leading-[1.8] space-y-6">
                            <p>
                                <span class="inline-block w-20"></span>On completion of the Training on
                                <span class="font-bold">"{{ training?.t_name }}"</span> conducted by the
                                Administrative Training Institute, Aizawl during
                                <span class="font-bold">{{ formatDate(training?.t_start_date) }}</span> to
                                <span class="font-bold">{{ formatDate(training?.t_end_date) }}</span>,
                                the participants (names and details shown in the Annexure) are hereby released with
                                effect
                                from the afternoon of <span class="font-bold">{{ formatDate(training?.t_end_date)
                                }}</span>.
                            </p>
                            <p>
                                <span class="inline-block w-20"></span>Successful completion of the course will depend
                                on
                                the result of the end-of-course examinations. Successful Completion Certificates shall
                                be
                                issued after the declaration of results, which should be positively entered in the
                                Service
                                Books/Cards of the officials concerned.
                            </p>
                        </div>

                        <div class="mt-5 self-end w-80 text-center">
                            <div class="leading-tight">
                                <p class="font-bold text-base">Sd/- <span class="uppercase">Rita Lalnunmawii
                                        Pachuau</span></p>
                                <p class="font-bold  text-base">Director</p>
                                <p class="text-sm mt-1 font-sans text-zinc-600 font-medium">Administrative Training
                                    Institute</p>
                                <p class="text-sm font-sans text-zinc-600">Mizoram : Aizawl</p>
                            </div>
                        </div>

                        <div class="mt-auto pt-6 text-[0.95rem] leading-relaxed">
                            <div class="flex justify-between font-bold mb-4">
                                <p>Memo No. A.33029/2/2024-ATI :</p>
                                <p>Dated Aizawl, the {{ currentFormattedDate }}</p>
                            </div>
                            <div class="space-y-1 pl-4">
                                <p class="font-bold italic">Copy to:-</p>
                                <ol class="space-y-1">
                                    <li v-for="(recipient, index) in copyToRecipients" :key="index"
                                        class="flex items-start gap-2">
                                        <span class="min-w-[20px] font-bold">{{ index + 1 }}.</span>
                                        <span>{{ recipient.designation }}</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <div class="mt-12 self-end w-80 text-center">
                            <div class="leading-tight">
                                <p class="font-bold uppercase text-base">{{ training?.t_director?.full_name }}</p>
                                <p class="font-bold text-base">{{ training?.t_director?.designation }}</p>
                                <p class="text-sm mt-1 font-sans text-zinc-600 font-medium">Administrative Training
                                    Institute</p>
                                <p class="text-sm font-sans text-zinc-600">Mizoram : Aizawl</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    class="relative bg-white shadow-2xl print:shadow-none p-[25mm] w-[210mm] h-[297mm] flex flex-col page-break">
                    <div class="text-center mb-8">
                        <h2
                            class="text-xl font-bold underline decoration-2 underline-offset-4 uppercase tracking-widest">
                            Annexure
                        </h2>
                        <div class="mt-4 space-y-1 uppercase text-zinc-600 text-sm font-sans">
                            <p class="font-bold text-black font-serif">List of Officials who Attended the Training on:
                            </p>
                            <p class="text-base font-bold italic text-zinc-800 font-serif">"{{ training?.t_name }}"</p>
                            <p>Period: {{ formatDate(training?.t_start_date) }} to {{ formatDate(training?.t_end_date)
                            }}</p>
                        </div>
                    </div>

                    <table class="w-full border-collapse border-[1.5px] border-black text-sm">
                        <thead>
                            <tr class="bg-zinc-50 font-bold uppercase text-[11px] h-10">
                                <th class="border border-black p-2 w-14 text-center">Sl. No</th>
                                <th class="border border-black p-4 text-left font-serif">Full Name</th>
                                <th class="border border-black p-4 w-44 text-left font-serif">Designation</th>
                                <th class="border border-black p-4 text-left font-serif">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(trainee, index) in users" :key="trainee._id" class="h-10">
                                <td class="border border-black p-2 text-center">{{ index + 1 }}</td>
                                <td class="border border-black px-4 font-bold">{{ trainee.user?.full_name }}</td>
                                <td class="border border-black px-4">{{ trainee.user?.designation }}</td>
                                <td class="border border-black px-4">{{ trainee.user?.department }}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </template>
        </div>
    </div>
</template>

<script setup>
// [Your existing script setup logic remains unchanged]
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCertificateStore } from '../../store/certificateStore';
import { formatDate } from '../../utils/dateFormatter';

const store = useCertificateStore();
const { training, users, isLoading } = storeToRefs(store);
const isSigned = ref(true);
const route = useRoute();
const copyToRecipients = [
    { designation: 'The Under Secretary to the Govt. of Mizoram, DP&AR (GG & Training Wing), Aizawl' },
    { designation: 'All Controlling Authorities concerned for information and necessary action' },
    { designation: 'Persons concerned' },
    { designation: 'Guard File' }
];

const currentFormattedDate = computed(() => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
});

const isDownloading = ref(false);

const generatePDF = async () => {
    // Adding optional chaining here in case download is triggered while loading
    const trainingId = training.value?._id;
    if (!trainingId) return alert("Training ID missing or data is still loading.");

    try {
        isDownloading.value = true;

        const response = await store.downloadReleaseOrder(trainingId);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `Release_Order_${training.value.t_name.replace(/\s+/g, '_')}.pdf`;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF. Please ensure the server is running.");
    } finally {
        isDownloading.value = false;
    }
};

onMounted(async () => {
    if (!training.value || !training.value._id) {
        const id = route.params.id;
        await store.generateReleaseOrder(id);
    }
});

const closePreview = () => { window.history.back(); };
</script>

<style scoped>
/* [Your existing CSS remains unchanged] */
@media print {
    .page-break {
        page-break-after: always !important;
        margin-bottom: 0 !important;
    }

    @page {
        size: A4;
        margin: 0;
    }

    body {
        -webkit-print-color-adjust: exact;
    }
}

.font-serif {
    font-family: 'Times New Roman', Times, serif;
}

p>span.w-20 {
    display: inline-block;
    width: 5rem;
}
</style>
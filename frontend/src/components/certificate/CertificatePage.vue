<template>
    <div v-if="isCertificateLoading" class="p-6 max-w-7xl mx-auto animate-pulse">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div>
                    <div class="h-6 w-48 bg-slate-200 rounded mb-2"></div>
                    <div class="h-4 w-72 bg-slate-100 rounded"></div>
                </div>
            </div>
            <div class="h-10 w-40 bg-slate-200 rounded-xl"></div>
        </div>

        <div class="flex justify-center mt-8">
            <div class="bg-slate-200 shadow-xl rounded-lg"
                :class="selectedTemplate === 'Specialized' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'"></div>
        </div>
    </div>

    <div v-else class="p-6 max-w-7xl mx-auto print:p-0 print:max-w-none">
        <div class="flex items-center justify-between mb-8 print:hidden">
            <div class="flex items-center gap-4">
                <button @click="goBack"
                    class="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                    title="Go Back">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Generate Certificate</h1>
                    <p class="text-slate-500 text-sm mt-1">Select a template and preview the certificate before
                        generating.</p>
                </div>
            </div>
            <button @click="downloadPDF" :disabled="isGenerating"
                class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:bg-indigo-400">
                <svg v-if="isGenerating" class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ isGenerating ? 'Generating PDF...' : 'Download PDF' }}
            </button>
        </div>

        <div class="grid grid-cols-1 gap-8">
            <div class="col-span-1 lg:col-span-3 overflow-x-auto pb-8">

                <div id="certificate-canvas"
                    class="bg-white shadow-2xl relative mx-auto print:shadow-none print:m-0 flex-shrink-0 transition-all duration-300"
                    :class="selectedTemplate === 'Mandatory' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'">

                    <div v-if="selectedTemplate === 'Mandatory'"
                        class="w-full h-full p-[15mm] bg-white font-serif relative">
                        <div
                            class="w-full h-full border-[6px] border-double border-slate-800 p-[10mm] flex flex-col items-center text-center relative">
                            <div class="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-slate-800"></div>
                            <div class="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-slate-800"></div>
                            <div class="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-slate-800"></div>
                            <div class="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-slate-800"></div>

                            <div class="mt-8 mb-4">
                                <h1 class="text-6xl tracking-widest text-slate-600 italic font-pinyon mb-6">
                                    Certificate</h1>
                                <img src="../../assets/placeholder.png" alt="ATI Logo"
                                    class="w-24 h-24 mx-auto mb-4"></img>
                                <p class="text-2xl text-slate-900 mt-6 uppercase font-extrabold"
                                    style="font-family: 'Times New Roman', serif;">Administrative
                                    Training Institute</p>
                                <p class="text-md tracking-[0.3em] text-slate-900 mt-2 uppercase font-extrabold"
                                    style="font-family: 'Times New Roman', serif;">Mizoram:Aizawl</p>
                            </div>

                            <div class="my-8 grid">
                                <p class="text-2xl italic text-slate-600 mb-4 font-satisfy">This Certificate is awarded
                                    to</p>
                                <h2
                                    class="text-2xl font-bold text-slate-900 border-slate-400 inline-block px-12 pb-2 font-satisfy">
                                    {{ certificateDetails?.trainee?.full_name }}</h2>
                                <h3
                                    class="text-2xl font-bold text-slate-900 border-slate-400 inline-block px-12 pb-2 font-satisfy">
                                    {{ certificateDetails?.trainee?.designation }}</h3>
                                <h3
                                    class="text-2xl font-bold text-slate-900 border-slate-400 inline-block px-12 pb-2 font-satisfy">
                                    {{ certificateDetails?.trainee?.department }}</h3>
                                <p class="text-lg leading-relaxed text-slate-700 mt-4 ">
                                    <span class="font-satisfy text-2xl">for successful completion of</span>
                                    <br>
                                    <span class="font-bold text-2xl block mt-3 text-slate-900 font-satisfy">"{{
                                        certificateDetails?.program?.t_name }}"</span>
                                </p>
                                <p class=" text-slate-600 mt-6 font-satisfy text-2xl">held at the
                                    Administrative
                                    Training Institute,
                                    Mizoram.</p>

                                <p class="text-2xl text-slate-600 mt-6 font-satisfy">from <span class="font-bold">{{
                                    formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span>
                                    to <span class="font-bold"> {{
                                        formatWithOrdinal(certificateDetails?.program?.t_end_date) }} </span>
                                </p>
                            </div>

                            <div
                                class="absolute bottom-[15mm] left-[15mm] right-[15mm] flex justify-between items-start">

                                <div class="text-center w-40">
                                    <div class="border-slate-800 h-16 mb-2 flex items-end justify-center">
                                        <p class="text-slate-800 font-bold">({{
                                            certificateDetails?.program?.t_director?.full_name }})</p>
                                    </div>
                                    <p class="font-bold text-slate-800 text-sm">{{
                                        certificateDetails?.program?.t_director?.designation }}</p>
                                    <p class="text-xs text-slate-600">&</p>
                                    <p class="text-sm text-slate-800 font-bold">Course Director</p>
                                </div>

                                <div class="text-center w-60">
                                    <div class="border-slate-800 h-16 mb-2 flex items-end justify-center">
                                        <p class="text-slate-800 font-bold">(Rita Lalnunmawii Pachuau)</p>
                                    </div>
                                    <p class="font-bold text-slate-800 text-sm">Director</p>
                                    <p class="text-sm text-slate-800 font-bold">ATI</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div v-else
                        class="w-full h-full bg-white font-sans relative overflow-hidden border-[12px] border-slate-50 p-[15mm] flex flex-col">

                        <div class="absolute inset-[15mm] border border-slate-200 z-0"></div>
                        <div class="absolute inset-[16.5mm] border-[2px] border-indigo-900 z-0"></div>

                        <div class="absolute top-[14.5mm] left-[14.5mm] w-5 h-5 bg-indigo-900 z-0"></div>
                        <div class="absolute top-[14.5mm] right-[14.5mm] w-5 h-5 bg-indigo-900 z-0"></div>
                        <div class="absolute bottom-[14.5mm] left-[14.5mm] w-5 h-5 bg-indigo-900 z-0"></div>
                        <div class="absolute bottom-[14.5mm] right-[14.5mm] w-5 h-5 bg-indigo-900 z-0"></div>

                        <div class="relative z-10 flex flex-col h-full text-center px-[20mm]">

                            <div class="mt-4 mb-8">
                                <div
                                    class="w-14 h-14 mx-auto mb-3 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                                    <span class="text-indigo-800 font-black text-lg tracking-tighter">ATI</span>
                                </div>

                                <p class="text-slate-900 tracking-widest text-3xl uppercase mt-1 font-bold">
                                    Administrative
                                    Training
                                    Institute</p>
                                <p class="text-slate-900 font-bold tracking-[0.2em] text-2xl uppercase">Mizoram :
                                    Aizawl
                                </p>
                            </div>


                            <div class="flex-1 flex flex-col items-center justify-center">
                                <p class="text-slate-500 italic text-2xl mb-4 font-satisfy">This is to certify that</p>

                                <h2 class="text-2xl font-bold text-slate-900 mb-2 font-satisfy ">
                                    {{ certificateDetails?.trainee?.full_name }}
                                </h2>
                                <h2 class="text-2xl font-bold text-slate-900 mb-2 font-satisfy">
                                    {{ certificateDetails?.trainee?.designation }}
                                </h2>
                                <h2 class="text-2xl font-bold text-slate-900 mb-2 font-satisfy">
                                    {{ certificateDetails?.trainee?.department }}
                                </h2>

                                <p class="text-slate-600 text-2xl leading-relaxed max-w-2xl mx-auto font-satisfy">
                                    attended the training on
                                </p>

                                <h3 class="text-2xl font-bold text-indigo-900 mt-4 mb-3 font-satisfy">
                                    "{{ certificateDetails?.program?.t_name }}"
                                </h3>

                                <p class="text-slate-600 text-2xl font-satisfy">
                                    conducted by the Administrative Training Institute, Aizawl, Mizoram
                                </p>
                                <p class="font-2xl text-slate-600 font-satisfy"> during <span class=" font-bold">{{
                                    formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span>
                                    to <span class="text-slate-800 font-bold">{{
                                        formatWithOrdinal(certificateDetails?.program?.t_end_date) }}</span></p>
                            </div>

                            <div class="mt-8 pt-6 flex justify-between px-5">

                                <div class="w-56 text-center flex flex-col items-center">
                                    <div class="w-full  border-slate-800 pt-2">
                                        <p class="text-slate-900 font-bold text-[12px] uppercase tracking-wider">
                                            ( {{ certificateDetails?.program?.t_director?.full_name
                                            }} )
                                        </p>
                                        <p class="text-[9px] text-slate-500 font-medium mt-1 uppercase tracking-widest">
                                            {{ certificateDetails?.program?.t_director?.designation }} & Course Director
                                        </p>
                                    </div>
                                </div>

                                <div class="w-48 text-center flex flex-col items-center mb-2">
                                    <div
                                        class="w-14 h-14 rounded-full border border-amber-500/30 flex items-center justify-center mb-3">
                                        <span
                                            class="text-[9px] text-amber-600/50 uppercase tracking-widest font-bold">Seal</span>
                                    </div>

                                </div>

                                <div class="w-56 text-center flex flex-col items-center">

                                    <div class="w-full border-slate-800 pt-2">
                                        <p class="text-slate-900 font-bold text-[12px] uppercase tracking-wider">
                                            ( Rita Lalnunmawii Pachuau )
                                        </p>
                                        <p class="text-[9px] text-slate-500 font-medium mt-1 uppercase tracking-widest">
                                            Director, ATI
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// If using html2pdf, you would import it here:
// import html2pdf from 'html2pdf.js';

import { useAlertStore } from '../../store/alertStore';
import { useCertificateStore } from '../../store/certificateStore';

const route = useRoute();
const router = useRouter();
const isGenerating = ref(false);
const alert = useAlertStore();
const store = useCertificateStore();

const { certificateDetails, selectedTemplate, isCertificateLoading } = storeToRefs(store);

const goBack = () => {
    router.back();
};

const formatWithOrdinal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const day = date.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
};

// Compute today's date formatted nicely for the "Issue Date"
const issueDateFormatted = computed(() => {
    return formatWithOrdinal(new Date());
});

const downloadPDF = async () => {
    isGenerating.value = true;
    try {
        // === HTML2PDF Logic Implementation ===
        /*
        const element = document.getElementById('certificate-canvas');
        const filename = `Certificate_${certificateDetails.value?.trainee?.full_name.replace(/\s+/g, '_')}.pdf`;
        
        // Dynamically set orientation based on template
        const orientation = selectedTemplate.value === 'Specialized' ? 'portrait' : 'landscape';

        const opt = {
            margin:       0,
            filename:     filename,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: orientation } 
        };
        
        await html2pdf().set(opt).from(element).save();
        */

        // Simulating the delay for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert.success('PDF Generation triggered! (Uncomment html2pdf logic in script to activate)');

    } catch (error) {
        console.error("Failed to generate PDF", error);
        alert.error("An error occurred while generating the PDF.");
    } finally {
        isGenerating.value = false;
    }
};

const fetchTraineeDetails = async () => {
    const response = await store.fetchTraineeCertificate(route.params.traineeId, route.params.id);
    if (!response.success) {
        alert.error('Failed to fetch trainee details');
    }
}

onMounted(() => {
    fetchTraineeDetails();
});
</script>

<style scoped>
/* Inject CSS Variables to handle printing based on state, though html2pdf handles it internally */
@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    #certificate-canvas {
        transform: scale(1) !important;
        /* Width and Height will automatically be inherited from the dynamic tailwind classes */
    }
}
</style>
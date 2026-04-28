<template>
    <div v-if="isCertificateLoading" class="p-6 max-w-7xl mx-auto animate-pulse">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div>
                    <div class="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                    <div class="h-4 w-72 bg-gray-100 rounded"></div>
                </div>
            </div>
            <div class="h-10 w-40 bg-gray-200 rounded-xl"></div>
        </div>

        <div class="flex justify-center mt-8">
            <div class="bg-gray-200 shadow-xl rounded-lg"
                :class="selectedTemplate === 'Mandatory' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'"></div>
        </div>
    </div>

    <div v-else class="p-6 max-w-7xl mx-auto print:p-0 print:max-w-none">
        <div class="flex items-center justify-between mb-6 print:hidden">
            <div class="flex items-center gap-4">
                <button @click="goBack"
                    class="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
                    title="Go Back">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-black">Customize & Generate</h1>
                    <p class="text-gray-500 text-sm mt-1">Select style, click text to edit, then download.</p>
                </div>
            </div>
            <button @click="downloadPDF" :disabled="isGenerating"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:bg-blue-400">
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

        <div class="bg-white border border-gray-200 rounded-xl p-4 mb-8 flex flex-wrap gap-6 shadow-sm print:hidden">
            <div class="flex items-center gap-3">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Font</label>
                <select v-model="baseFont"
                    class="text-sm border-gray-200 rounded-lg focus:ring-blue-500 py-1.5 px-3 bg-gray-50 outline-none hover:bg-gray-100 transition-colors cursor-pointer font-sans">
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                </select>
            </div>
            <div class="flex items-center gap-3">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Decorative Font</label>
                <select v-model="cursiveFont"
                    class="text-sm border-gray-200 rounded-lg focus:ring-blue-500 py-1.5 px-3 bg-gray-50 outline-none hover:bg-gray-100 transition-colors cursor-pointer font-sans">
                    <option value="'Satisfy', cursive">Satisfy</option>
                    <option value="'Pinyon Script', cursive">Pinyon Script</option>
                    <option value="'Great Vibes', cursive">Great Vibes</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                </select>
            </div>
            <div class="flex items-center gap-3">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Border Style</label>
                <select v-model="selectedBorderPreset"
                    class="text-sm border-gray-200 rounded-lg focus:ring-blue-500 py-1.5 px-3 bg-gray-50 outline-none hover:bg-gray-100 transition-colors cursor-pointer font-sans">
                    <option v-for="opt in borderPresets" :key="opt.value" :value="opt.value">
                        {{ opt.name }}
                    </option>
                </select>
            </div>
            <div class="ml-auto flex items-center">
                <span
                    class="text-xs text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg font-medium border border-yellow-200">
                    ✏️ Hover over text to edit
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8">
            <div class="col-span-1 lg:col-span-3 overflow-x-auto pb-8">

                <div class="bg-white shadow-2xl relative mx-auto print:shadow-none print:m-0 flex-shrink-0 transition-all duration-300"
                    :class="selectedTemplate === 'Mandatory' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'">

                    <div id="certificate-canvas" class="w-full h-full relative"
                        style="background-color: #ffffff; color: #000000;">

                        <div class="watermark-layer z-0 print:block"></div>

                        <div v-if="selectedTemplate === 'Mandatory'" class="relative z-10 w-full h-full p-[15mm]"
                            :style="{ fontFamily: baseFont }">

                            <div class="w-full h-full p-[10mm] flex flex-col items-center text-center relative transition-all"
                                :style="t1ContainerStyle">

                                <div class="absolute top-2 left-2 border-t-4 border-l-4 transition-colors"
                                    :style="t1AccentStyle"></div>
                                <div class="absolute top-2 right-2 border-t-4 border-r-4 transition-colors"
                                    :style="t1AccentStyle"></div>
                                <div class="absolute bottom-2 left-2 border-b-4 border-l-4 transition-colors"
                                    :style="t1AccentStyle"></div>
                                <div class="absolute bottom-2 right-2 border-b-4 border-r-4 transition-colors"
                                    :style="t1AccentStyle"></div>

                                <div class="mt-8 mb-4 relative z-20">
                                    <h1 class="text-6xl tracking-widest mb-6 editable-text" style="color: #4b5563;"
                                        contenteditable="true" spellcheck="false" :style="{ fontFamily: cursiveFont }">
                                        Certificate</h1>
                                    <img src="../../assets/ati_logo_1.png" alt="ATI Logo"
                                        class="w-24 h-24 mx-auto mb-4"></img>
                                    <p class="text-2xl mt-6 uppercase font-extrabold editable-text"
                                        style="color: #000000;" contenteditable="true" spellcheck="false">Administrative
                                        Training Institute</p>
                                    <p class="text-md tracking-[0.3em] mt-2 uppercase font-extrabold editable-text"
                                        style="color: #000000;" contenteditable="true" spellcheck="false">Mizoram:Aizawl
                                    </p>
                                </div>

                                <div class="my-8 grid w-full relative z-20">
                                    <p class="text-2xl mb-4 editable-text" style="color: #4b5563;"
                                        contenteditable="true" spellcheck="false" :style="{ fontFamily: cursiveFont }">
                                        This Certificate is awarded
                                        to</p>

                                    <h2 class="text-2xl font-bold inline-block px-12 pb-2 editable-text"
                                        contenteditable="true" spellcheck="false">{{
                                            certificateDetails?.trainee?.full_name
                                        }}</h2>
                                    <h3 class="text-2xl font-bold inline-block px-12 pb-2 editable-text"
                                        contenteditable="true" spellcheck="false">{{
                                            certificateDetails?.trainee?.designation }}</h3>
                                    <h3 class="text-2xl font-bold inline-block px-12 pb-2 editable-text"
                                        contenteditable="true" spellcheck="false">{{
                                            certificateDetails?.trainee?.department
                                        }}</h3>

                                    <p class="text-lg leading-relaxed mt-4" style="color: #374151;">
                                        <span class="text-2xl editable-text" contenteditable="true" spellcheck="false"
                                            :style="{ fontFamily: cursiveFont }">for successful completion of</span>
                                        <br>
                                        <span class="font-bold text-2xl block mt-3 editable-text"
                                            style="color: #000000;" contenteditable="true" spellcheck="false">"{{
                                                certificateDetails?.program?.t_name }}"</span>
                                    </p>

                                    <p class="mt-6 text-2xl editable-text" style="color: #4b5563;"
                                        contenteditable="true" spellcheck="false" :style="{ fontFamily: cursiveFont }">
                                        held at the Administrative Training Institute, Mizoram.
                                    </p>

                                    <div class="text-2xl mt-6 editable-text" style="color: #000000;"
                                        contenteditable="true" spellcheck="false">
                                        from <span class="font-bold">{{
                                            formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span>
                                        to <span class="font-bold">{{
                                            formatWithOrdinal(certificateDetails?.program?.t_end_date) }}</span>
                                    </div>
                                </div>

                                <div class="mt-auto flex justify-between items-end w-full">

                                    <div class="w-1/3 text-center flex flex-col items-center">
                                        <div class="w-56 pt-2 relative">

                                            <p class="font-bold text-[12px] uppercase tracking-wider editable-text"
                                                style="color: #000000;" contenteditable="true" spellcheck="false">
                                                ( {{ certificateDetails?.program?.t_director?.full_name }} )
                                            </p>
                                            <p class="text-[9px] font-medium mt-1 uppercase tracking-widest editable-text"
                                                style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                                {{ certificateDetails?.program?.t_director?.designation }} &amp; Course
                                                Director
                                            </p>
                                        </div>
                                    </div>

                                    <div class="w-1/3 flex justify-center items-center pb-2">
                                        <img src="../../assets/seal.png" alt="Official Seal"
                                            class="w-24 h-24 object-contain" />
                                    </div>

                                    <div class="w-1/3 text-center flex flex-col items-center">
                                        <div class="w-56 pt-2 relative">


                                            <img v-if="director?.signature" :src="getImageUrl(director.signature)"
                                                alt="Director Signature"
                                                class="w-40 h-16 object-contain mx-auto absolute bottom-8 left-1/2 -translate-x-1/2" />

                                            <p class="font-bold text-[12px] uppercase tracking-wider editable-text relative z-10"
                                                style="color: #000000;" contenteditable="true" spellcheck="false">
                                                ( {{ director?.full_name || 'Rita Lalnunmawii Pachuau' }} )
                                            </p>
                                            <p class="text-[9px] font-medium mt-1 uppercase tracking-widest editable-text"
                                                style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                                {{ director?.designation || 'Director, ATI' }}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div v-else class="w-full h-full relative overflow-hidden p-[15mm] flex flex-col"
                            :style="{ fontFamily: baseFont, backgroundColor: '#ffffff', borderWidth: '12px', borderStyle: 'solid', borderColor: '#f9fafb' }">

                            <div class="absolute inset-[15mm] z-0 transition-all" :style="t2OuterBorderStyle"></div>
                            <div class="absolute inset-[16.5mm] z-0 transition-all" :style="t2InnerBorderStyle"></div>

                            <div class="absolute top-[14.5mm] left-[14.5mm] w-5 h-5 z-0 transition-all"
                                :style="t2CornerStyle"></div>
                            <div class="absolute top-[14.5mm] right-[14.5mm] w-5 h-5 z-0 transition-all"
                                :style="t2CornerStyle"></div>
                            <div class="absolute bottom-[14.5mm] left-[14.5mm] w-5 h-5 z-0 transition-all"
                                :style="t2CornerStyle"></div>
                            <div class="absolute bottom-[14.5mm] right-[14.5mm] w-5 h-5 z-0 transition-all"
                                :style="t2CornerStyle"></div>

                            <div class="relative z-20 flex flex-col h-full text-center py-[15mm] px-[25mm]">

                                <div class="mb-4">
                                    <img src="../../assets/ati_logo_1.png" alt="ATI Logo"
                                        class="w-16 h-16 mx-auto mb-3" />
                                    <p class="tracking-widest text-2xl uppercase font-bold editable-text"
                                        style="color: #000000;" contenteditable="true" spellcheck="false">Administrative
                                        Training Institute</p>
                                    <p class="font-bold tracking-[0.2em] text-lg uppercase editable-text"
                                        style="color: #000000;" contenteditable="true" spellcheck="false">Mizoram :
                                        Aizawl</p>
                                </div>

                                <div class="flex-1 flex flex-col items-center justify-center">
                                    <p class="text-2xl mb-3 editable-text" style="color: #6b7280;"
                                        contenteditable="true" spellcheck="false" :style="{ fontFamily: cursiveFont }">
                                        This is to certify that</p>

                                    <h2 class="text-2xl font-bold editable-text" style="color: #000000;"
                                        contenteditable="true" spellcheck="false">
                                        {{ certificateDetails?.trainee?.full_name }}
                                    </h2>
                                    <h2 class="text-xl font-bold editable-text" style="color: #1f2937;"
                                        contenteditable="true" spellcheck="false">
                                        {{ certificateDetails?.trainee?.designation }}
                                    </h2>
                                    <h2 class="text-xl font-bold editable-text" style="color: #1f2937;"
                                        contenteditable="true" spellcheck="false">
                                        {{ certificateDetails?.trainee?.department }}
                                    </h2>

                                    <p class="text-2xl leading-relaxed max-w-2xl mx-auto editable-text mt-3"
                                        style="color: #4b5563;" contenteditable="true" spellcheck="false"
                                        :style="{ fontFamily: cursiveFont }">
                                        attended the training on
                                    </p>

                                    <h3 class="text-2xl font-bold mt-2 mb-3 editable-text" style="color: #000000;"
                                        contenteditable="true" spellcheck="false">
                                        "{{ certificateDetails?.program?.t_name }}"
                                    </h3>

                                    <p class="text-2xl editable-text mb-2" style="color: #4b5563;"
                                        contenteditable="true" spellcheck="false" :style="{ fontFamily: cursiveFont }">
                                        conducted by the Administrative Training Institute, Aizawl, Mizoram
                                    </p>

                                    <div class="text-xl editable-text" style="color: #4b5563;" contenteditable="true"
                                        spellcheck="false">
                                        during <span class="font-bold" style="color: #000000;">{{
                                            formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span>
                                        to <span class="font-bold" style="color: #000000;">{{
                                            formatWithOrdinal(certificateDetails?.program?.t_end_date) }}</span>
                                    </div>
                                </div>

                                <div class="mt-auto flex justify-between items-end w-full">

                                    <div class="w-1/3 text-center flex flex-col items-center">
                                        <div class="w-56 pt-2 relative">

                                            <p class="font-bold text-[12px] uppercase tracking-wider editable-text"
                                                style="color: #000000;" contenteditable="true" spellcheck="false">
                                                ( {{ certificateDetails?.program?.t_director?.full_name }} )
                                            </p>
                                            <p class="text-[9px] font-medium mt-1 uppercase tracking-widest editable-text"
                                                style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                                {{ certificateDetails?.program?.t_director?.designation }} &amp; Course
                                                Director
                                            </p>
                                        </div>
                                    </div>

                                    <div class="w-1/3 flex justify-center items-center pb-2">
                                        <img src="../../assets/seal.png" alt="Official Seal"
                                            class="w-24 h-24 object-contain" />
                                    </div>

                                    <div class="w-1/3 text-center flex flex-col items-center">
                                        <div class="w-56 pt-2 relative">


                                            <img v-if="director?.signature" :src="getImageUrl(director.signature)"
                                                alt="Director Signature"
                                                class="w-40 h-16 object-contain mx-auto absolute bottom-8 left-1/2 -translate-x-1/2" />

                                            <p class="font-bold text-[12px] uppercase tracking-wider editable-text relative z-10"
                                                style="color: #000000;" contenteditable="true" spellcheck="false">
                                                ( {{ director?.full_name || 'Rita Lalnunmawii Pachuau' }} )
                                            </p>
                                            <p class="text-[9px] font-medium mt-1 uppercase tracking-widest editable-text"
                                                style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                                {{ director?.designation || 'Director, ATI' }}
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
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAlertStore } from '../../store/alertStore';
import { useCertificateStore } from '../../store/certificateStore';

const route = useRoute();
const router = useRouter();
const alert = useAlertStore();
const store = useCertificateStore();

const isGenerating = ref(false);
const { certificateDetails, selectedTemplate, isCertificateLoading, director } = storeToRefs(store);

// --- Design Controls ---
const baseFont = ref("'Times New Roman', serif");
const cursiveFont = ref("'Satisfy', cursive");

// Border Preset State
const selectedBorderPreset = ref('classic');

const borderPresets = [
    { name: 'Classic ATI', value: 'classic' },
    { name: 'Modern Blue', value: 'indigo' },
    { name: 'Minimalist Gray', value: 'minimal' },
    { name: 'No Border', value: 'none' }
];

// --- Pure Hex Style Objects (Crash-Proof) ---
const t1ContainerStyle = computed(() => {
    const base = { backgroundColor: '#ffffff', borderStyle: 'double', borderWidth: '6px' };
    switch (selectedBorderPreset.value) {
        case 'classic': return { ...base, borderColor: '#000000' };
        case 'indigo': return { ...base, borderColor: '#1e3a8a', borderStyle: 'solid', borderWidth: '4px' };
        case 'minimal': return { ...base, borderColor: '#e5e7eb', borderStyle: 'solid', borderWidth: '2px' };
        case 'none': return { ...base, border: 'none' };
        default: return { ...base, borderColor: '#000000' };
    }
});

const t1AccentStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { borderColor: '#000000' };
        case 'indigo': return { borderColor: '#1e3a8a' };
        case 'minimal': return { borderColor: '#e5e7eb' };
        case 'none': return { borderColor: 'transparent' };
        default: return { borderColor: '#000000' };
    }
});

const t2OuterBorderStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { border: '1px solid #e5e7eb' };
        case 'indigo': return { border: '3px solid #1e3a8a' };
        case 'minimal': return { border: '1px dashed #e5e7eb' };
        case 'none': return { border: 'none' };
        default: return { border: '1px solid #e5e7eb' };
    }
});

const t2InnerBorderStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { border: '2px solid #1e3a8a' };
        case 'indigo': return { border: '1px solid #e5e7eb' };
        case 'minimal': return { border: '1px solid #f3f4f6' };
        case 'none': return { border: 'none' };
        default: return { border: '2px solid #1e3a8a' };
    }
});

const t2CornerStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { backgroundColor: '#1e3a8a' };
        case 'indigo': return { backgroundColor: '#dbeafe', border: '1px solid #bfdbfe' };
        case 'minimal': return { backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' };
        case 'none': return { backgroundColor: 'transparent' };
        default: return { backgroundColor: '#1e3a8a' };
    }
});

const t2DirectorLineStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { borderTop: '1px solid #000000' };
        case 'indigo': return { borderTop: '2px solid #1e3a8a' };
        case 'minimal': return { borderTop: '1px solid #d1d5db' };
        case 'none': return { borderTop: 'none' };
        default: return { borderTop: '1px solid #000000' };
    }
});

const t2SealStyle = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return { borderColor: 'rgba(234, 179, 8, 0.3)', color: 'rgba(202, 138, 4, 0.5)' };
        case 'indigo': return { borderColor: '#bfdbfe', backgroundColor: '#eff6ff', color: '#1e40af' };
        case 'minimal': return { borderColor: '#e5e7eb', color: '#9ca3af' };
        case 'none': return { borderColor: 'transparent', color: 'transparent' };
        default: return { borderColor: 'rgba(234, 179, 8, 0.3)', color: 'rgba(202, 138, 4, 0.5)' };
    }
});

// --- General Functions ---
const goBack = () => {
    router.back();
};

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:3000';

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${IMAGE_URL}${path}`;
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
const downloadPDF = async () => {
    isGenerating.value = true;

    try {
        // 1. Grab the certificate container from the screen
        const element = document.getElementById('certificate-canvas');

        // 2. Clone it
        const clonedElement = element.cloneNode(true);

        // 🚨 IMAGE FIX: Force absolute URLs for Puppeteer 🚨
        // The live browser knows the absolute URL of the images. 
        // We copy those resolved URLs and force them onto the clone.
        const originalImages = element.querySelectorAll('img');
        const clonedImages = clonedElement.querySelectorAll('img');
        originalImages.forEach((img, index) => {
            clonedImages[index].src = img.src; // Converts '/assets/seal.png' to 'http://localhost:5173/assets/seal.png'
        });

        // 3. Remove all editing capabilities and hover borders from the clone
        const editables = clonedElement.querySelectorAll('.editable-text');
        editables.forEach(el => {
            el.removeAttribute('contenteditable');
            el.classList.remove('editable-text');
            el.style.outline = 'none';
            el.style.backgroundColor = 'transparent';
        });

        // 4. Extract the exact HTML string
        const finalHtmlString = clonedElement.outerHTML;

        // Create a safe filename
        const rawName = certificateDetails.value?.trainee?.full_name || 'Trainee';
        const safeName = rawName.replace(/\s+/g, '_');

        // Grab the program name and strip out any special characters that file systems hate
        const rawProgram = certificateDetails.value?.program?.t_name || 'Program';
        const safeProgram = rawProgram.replace(/[^a-zA-Z0-9]/g, '_');

        // Add a timestamp to guarantee absolute uniqueness
        const timestamp = Date.now();

        const filename = `certificate_${safeName}_${timestamp}.pdf`;

        // 5. Send payload
        const payload = {
            traineeId: route.params.traineeId,
            trainingId: route.params.id,
            filename: filename,
            templateStyle: selectedTemplate.value,
            htmlContent: finalHtmlString
        };

        const response = await store.requestCertificateGeneration(payload);

        if (response.success) {
            alert.success(response.message || 'Certificate generated successfully!');
            router.back();
        } else {
            alert.error(response.message || 'Failed to generate certificate.');
        }

    } catch (error) {
        console.error("Server PDF Generation Failed", error);
        alert.error("An error occurred while communicating with the server.");
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
@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Satisfy&family=Great+Vibes&display=swap');

.editable-text {
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
    outline: 2px solid transparent;
}

.editable-text:hover {
    outline: 2px dashed #cbd5e1;
    background-color: rgba(255, 255, 255, 0.4);
    cursor: text;
}

.editable-text:focus {
    outline: 2px solid #818cf8;
    background-color: rgba(255, 255, 255, 0.8);
    cursor: text;
}

.editable-text:empty::before {
    content: "Click to add text";
    color: #94a3b8;
    font-style: italic;
}

.watermark-layer {
    position: absolute;
    inset: 0;
    opacity: 0.035;
    pointer-events: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='14' fill='%2364748b' font-family='Arial, sans-serif' font-weight='bold' transform='rotate(-25 40 30)'%3EATI%3C/text%3E%3C/svg%3E");
    background-repeat: repeat;
    z-index: 50;
}

/* 🚨 PREFLIGHT OKLCH CRASH FIX 🚨 */
/* Overrides Tailwind's default global oklch border variables so html2canvas doesn't crash on standard div evaluation */
#certificate-canvas,
#certificate-canvas * {
    border-color: #e5e7eb;
    outline-color: transparent;
    text-decoration-color: transparent;
}

@media print {
    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    #certificate-canvas {
        transform: scale(1) !important;
        box-shadow: none !important;
    }

    .editable-text {
        outline: none !important;
        background-color: transparent !important;
    }
}
</style>
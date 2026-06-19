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

    <div v-else class="p-6 max-w-7xl mx-auto print:p-0 print:max-w-none bg-zinc-50/50 min-h-screen">
        <div class="flex items-center justify-between mb-8 print:hidden">
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
                    <h1 class="text-2xl font-bold text-gray-900">Customize & Generate</h1>
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
                {{ isGenerating ? 'Generating PDF...' : 'Download High-Res PDF' }}
            </button>
        </div>

        <div
            class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 flex flex-wrap gap-8 shadow-sm print:hidden items-center">
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Font</label>
                <select v-model="baseFont"
                    class="text-sm font-semibold border border-gray-200 rounded-lg focus:ring-blue-500 py-2 px-3 bg-white outline-none hover:bg-gray-50 transition-colors cursor-pointer">
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decorative Font</label>
                <select v-model="cursiveFont"
                    class="text-sm font-semibold border border-gray-200 rounded-lg focus:ring-blue-500 py-2 px-3 bg-white outline-none hover:bg-gray-50 transition-colors cursor-pointer">
                    <option value="'Satisfy', cursive">Satisfy</option>
                    <option value="'Pinyon Script', cursive">Pinyon Script</option>
                    <option value="'Great Vibes', cursive">Great Vibes</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                </select>
            </div>
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Color Theme</label>
                <select v-model="selectedBorderPreset"
                    class="text-sm font-semibold border border-gray-200 rounded-lg focus:ring-blue-500 py-2 px-3 bg-white outline-none hover:bg-gray-50 transition-colors cursor-pointer">
                    <option v-for="opt in borderPresets" :key="opt.value" :value="opt.value">
                        {{ opt.name }}
                    </option>
                </select>
            </div>
            <div class="ml-auto flex items-center">
                <span
                    class="text-xs text-amber-700 bg-amber-50 px-4 py-2 rounded-xl font-semibold border border-amber-200 shadow-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                        </path>
                    </svg>
                    Hover over text to edit
                </span>
            </div>
        </div>

        <div class="flex justify-center overflow-x-auto pb-12">
            <div class="bg-white shadow-2xl relative print:shadow-none print:m-0 flex-shrink-0 transition-all duration-500"
                :class="selectedTemplate === 'Mandatory' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'">

                <div id="certificate-canvas" class="w-full h-full relative overflow-hidden"
                    style="background-color: #ffffff; color: #1f2937;">

                    <!-- BACKGROUND & BORDER SYSTEM -->
                    <div class="absolute inset-0 z-0 bg-[#fdfdfd]"></div>

                    <!-- Modern Geometry Background Layers (Subtle) -->
                    <div class="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
                        :style="{ backgroundColor: themeColor }"></div>
                    <div class="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
                        :style="{ backgroundColor: themeColor }"></div>

                    <!-- Complex Borders -->
                    <div class="absolute inset-[10mm] z-10 transition-all border-solid"
                        :style="{ borderWidth: '1px', borderColor: themeColor }"></div>
                    <div class="absolute inset-[11.5mm] z-10 transition-all border-solid"
                        :style="{ borderWidth: '3px', borderColor: themeColor }"></div>
                    <div class="absolute inset-[13mm] z-10 transition-all border-solid"
                        :style="{ borderWidth: '1px', borderColor: themeColor }"></div>

                    <!-- Corner Ornaments -->
                    <div class="absolute top-[8mm] left-[8mm] w-[15mm] h-[15mm] border-t-[4px] border-l-[4px] z-10"
                        :style="{ borderColor: themeColor, backgroundColor: '#ffffff' }"></div>
                    <div class="absolute top-[8mm] right-[8mm] w-[15mm] h-[15mm] border-t-[4px] border-r-[4px] z-10"
                        :style="{ borderColor: themeColor, backgroundColor: '#ffffff' }"></div>
                    <div class="absolute bottom-[8mm] left-[8mm] w-[15mm] h-[15mm] border-b-[4px] border-l-[4px] z-10"
                        :style="{ borderColor: themeColor, backgroundColor: '#ffffff' }"></div>
                    <div class="absolute bottom-[8mm] right-[8mm] w-[15mm] h-[15mm] border-b-[4px] border-r-[4px] z-10"
                        :style="{ borderColor: themeColor, backgroundColor: '#ffffff' }"></div>

                    <!-- Watermark -->
                    <div class="watermark-layer z-10 print:block"></div>

                    <!-- CONTENT: MANDATORY (PORTRAIT) -->
                    <div v-if="selectedTemplate === 'Mandatory'"
                        class="relative z-20 w-full h-full flex flex-col items-center justify-between text-center pt-[30mm] pb-[25mm] px-[25mm]"
                        :style="{ fontFamily: baseFont }">

                        <!-- Top Header -->
                        <div class="flex flex-col items-center">
                            <img src="../../assets/ati_logo_1.png" alt="ATI Logo" class="w-24 h-24 mb-4 drop-shadow-md">
                            <h2 class="text-xl font-bold uppercase tracking-[0.3em] editable-text"
                                style="color: #374151;" contenteditable="true" spellcheck="false">Administrative
                                Training Institute</h2>
                            <p class="text-xs font-semibold tracking-[0.4em] mt-1 editable-text" style="color: #6b7280;"
                                contenteditable="true" spellcheck="false">GOVERNMENT OF MIZORAM</p>
                        </div>

                        <!-- Main Title -->
                        <div class="my-6">
                            <h1 class="text-6xl editable-text leading-tight"
                                :style="{ color: themeColor, fontFamily: cursiveFont }" contenteditable="true"
                                spellcheck="false">Certificate of Completion</h1>
                            <div class="w-24 h-1 mx-auto mt-4" :style="{ backgroundColor: themeColor }"></div>
                        </div>

                        <!-- Body text -->
                        <div class="flex flex-col items-center w-full space-y-5">
                            <p class="text-lg uppercase tracking-[0.2em] font-medium editable-text"
                                style="color: #6b7280;" contenteditable="true" spellcheck="false">This is proudly
                                presented to</p>

                            <h2 class="text-3xl font-extrabold editable-text border-b-2 px-12 py-2"
                                :style="{ borderColor: themeColor }" style="color: #111827;" contenteditable="true"
                                spellcheck="false">
                                {{ certificateDetails?.trainee?.full_name || 'Trainee Name' }}
                            </h2>

                            <p class="text-md font-semibold text-gray-700 editable-text" contenteditable="true"
                                spellcheck="false">
                                {{ certificateDetails?.trainee?.designation || 'Designation' }}, {{
                                    certificateDetails?.trainee?.department || 'Department' }}
                            </p>

                            <p class="text-lg mt-4 editable-text" style="color: #4b5563; max-width: 80%;"
                                contenteditable="true" spellcheck="false" :style="{ fontFamily: baseFont }">
                                For successfully completing the mandatory training program on
                            </p>

                            <h3 class="text-2xl font-bold editable-text mt-2" :style="{ color: themeColor }"
                                contenteditable="true" spellcheck="false">
                                "{{ certificateDetails?.program?.t_name || 'Program Name' }}"
                            </h3>

                            <p class="text-sm font-medium mt-4 editable-text" style="color: #6b7280;"
                                contenteditable="true" spellcheck="false">
                                Conducted from <span class="font-bold text-gray-900">{{
                                    formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span> to <span
                                    class="font-bold text-gray-900">{{
                                        formatWithOrdinal(certificateDetails?.program?.t_end_date) }}</span>
                            </p>
                        </div>

                        <!-- Signatures -->
                        <div class="flex justify-between items-end w-full mt-10 px-4">

                            <div class="w-1/3 flex flex-col items-center relative">
                                <img v-if="certificateDetails?.program?.t_director?.signature"
                                    :src="getImageUrl(certificateDetails?.program?.t_director?.signature)"
                                    alt="Course Director Signature"
                                    class="w-32 h-16 object-contain mx-auto absolute bottom-8 z-0 mix-blend-multiply" />
                                <div class="w-full border-t border-gray-400 pt-2 relative z-10">
                                    <p class="font-bold text-xs uppercase tracking-wider editable-text"
                                        style="color: #111827;" contenteditable="true" spellcheck="false">
                                        {{ certificateDetails?.program?.t_director?.full_name || 'Course Director Name'
                                        }}
                                    </p>
                                    <p class="text-[10px] font-semibold mt-1 uppercase tracking-widest editable-text"
                                        style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                        Course Director
                                    </p>
                                </div>
                            </div>

                            <div class="w-1/3 flex justify-center items-end pb-2 relative z-10">
                                <img src="../../assets/seal.png" alt="Official Seal"
                                    class="w-24 h-24 object-contain opacity-95" />
                            </div>

                            <div class="w-1/3 flex flex-col items-center relative">
                                <img v-if="director?.signature" :src="getImageUrl(director.signature)"
                                    alt="Director Signature"
                                    class="w-32 h-16 object-contain mx-auto absolute bottom-8 z-0 mix-blend-multiply" />
                                <div class="w-full border-t border-gray-400 pt-2 relative z-10">
                                    <p class="font-bold text-xs uppercase tracking-wider editable-text"
                                        style="color: #111827;" contenteditable="true" spellcheck="false">
                                        {{ director?.full_name || 'Rita Lalnunmawii Pachuau' }}
                                    </p>
                                    <p class="text-[10px] font-semibold mt-1 uppercase tracking-widest editable-text"
                                        style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                        {{ director?.designation || 'Director, ATI' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CONTENT: STANDARD (LANDSCAPE) -->
                    <div v-else
                        class="relative z-20 w-full h-full flex flex-col items-center justify-between text-center pt-[25mm] pb-[20mm] px-[35mm]"
                        :style="{ fontFamily: baseFont }">

                        <!-- Top Header -->
                        <div class="flex items-center justify-center gap-8 w-full">
                            <img src="../../assets/ati_logo_1.png" alt="ATI Logo" class="w-24 h-24 drop-shadow-md">
                            <div class="text-left border-l-2 pl-6" :style="{ borderColor: themeColor }">
                                <h2 class="text-3xl font-bold uppercase tracking-[0.2em] editable-text"
                                    style="color: #1f2937;" contenteditable="true" spellcheck="false">Administrative
                                    Training Institute</h2>
                                <p class="text-sm font-semibold tracking-[0.4em] mt-2 editable-text"
                                    style="color: #6b7280;" contenteditable="true" spellcheck="false">GOVERNMENT OF
                                    MIZORAM</p>
                            </div>
                        </div>

                        <!-- Main Title -->
                        <div class="my-6">
                            <h1 class="text-7xl editable-text" :style="{ color: themeColor, fontFamily: cursiveFont }"
                                contenteditable="true" spellcheck="false">Certificate of Participation</h1>
                            <div class="w-32 h-[3px] mx-auto mt-6" :style="{ backgroundColor: themeColor }"></div>
                        </div>

                        <!-- Body text -->
                        <div class="flex flex-col items-center w-full space-y-5">
                            <p class="text-xl tracking-[0.2em] uppercase font-medium editable-text"
                                style="color: #6b7280;" contenteditable="true" spellcheck="false">This certifies that
                            </p>

                            <h2 class="text-4xl font-black editable-text border-b-2 px-16 py-3"
                                :style="{ borderColor: themeColor }" style="color: #111827;" contenteditable="true"
                                spellcheck="false">
                                {{ certificateDetails?.trainee?.full_name || 'Trainee Name' }}
                            </h2>

                            <p class="text-lg font-semibold text-gray-700 editable-text" contenteditable="true"
                                spellcheck="false">
                                {{ certificateDetails?.trainee?.designation || 'Designation' }}, {{
                                    certificateDetails?.trainee?.department || 'Department' }}
                            </p>

                            <p class="text-xl mt-6 editable-text" style="color: #4b5563;" contenteditable="true"
                                spellcheck="false">
                                has actively participated in the training program entitled
                            </p>

                            <h3 class="text-3xl font-bold editable-text mt-3" :style="{ color: themeColor }"
                                contenteditable="true" spellcheck="false">
                                "{{ certificateDetails?.program?.t_name || 'Program Name' }}"
                            </h3>

                            <p class="text-md font-medium mt-6 editable-text" style="color: #6b7280;"
                                contenteditable="true" spellcheck="false">
                                Held from <span class="font-bold text-gray-900">{{
                                    formatWithOrdinal(certificateDetails?.program?.t_start_date) }}</span> to <span
                                    class="font-bold text-gray-900">{{
                                        formatWithOrdinal(certificateDetails?.program?.t_end_date) }}</span> at ATI Aizawl.
                            </p>
                        </div>

                        <!-- Signatures -->
                        <div class="flex justify-between items-end w-full mt-12 px-8">
                            <div class="w-1/3 flex flex-col items-center relative">
                                <img v-if="certificateDetails?.program?.t_director?.signature"
                                    :src="getImageUrl(certificateDetails?.program?.t_director?.signature)"
                                    alt="Course Director Signature"
                                    class="w-40 h-20 object-contain mx-auto absolute bottom-10 z-0 mix-blend-multiply" />
                                <div class="w-64 border-t-2 border-gray-400 pt-2 relative z-10">
                                    <p class="font-bold text-sm uppercase tracking-wider editable-text"
                                        style="color: #111827;" contenteditable="true" spellcheck="false">
                                        {{ certificateDetails?.program?.t_director?.full_name || 'Course Director Name'
                                        }}
                                    </p>
                                    <p class="text-xs font-semibold mt-1 uppercase tracking-widest editable-text"
                                        style="color: #6b7280;" contenteditable="true" spellcheck="false">
                                        Course Director
                                    </p>
                                </div>
                            </div>

                            <div class="w-1/3 flex justify-center items-end pb-2 relative z-10">
                                <img src="../../assets/seal.png" alt="Official Seal"
                                    class="w-28 h-28 object-contain opacity-95" />
                            </div>

                            <div class="w-1/3 flex flex-col items-center relative">
                                <img v-if="director?.signature" :src="getImageUrl(director.signature)"
                                    alt="Director Signature"
                                    class="w-40 h-20 object-contain mx-auto absolute bottom-10 z-0 mix-blend-multiply" />
                                <div class="w-64 border-t-2 border-gray-400 pt-2 relative z-10">
                                    <p class="font-bold text-sm uppercase tracking-wider editable-text"
                                        style="color: #111827;" contenteditable="true" spellcheck="false">
                                        {{ director?.full_name || 'Rita Lalnunmawii Pachuau' }}
                                    </p>
                                    <p class="text-xs font-semibold mt-1 uppercase tracking-widest editable-text"
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
    { name: 'Premium Gold', value: 'classic' },
    { name: 'Royal Blue', value: 'indigo' },
    { name: 'Executive Gray', value: 'minimal' },
    { name: 'Modern Emerald', value: 'emerald' }
];

// --- Theme Color System (Crash-Proof for html2canvas) ---
const themeColor = computed(() => {
    switch (selectedBorderPreset.value) {
        case 'classic': return '#b45309'; // Bronze/Gold (amber-700)
        case 'indigo': return '#1d4ed8'; // Royal Blue (blue-700)
        case 'minimal': return '#374151'; // Slate Gray (gray-700)
        case 'emerald': return '#059669'; // Emerald (emerald-600)
        default: return '#b45309';
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
        const element = document.getElementById('certificate-canvas');
        const clonedElement = element.cloneNode(true);
        const originalImages = element.querySelectorAll('img');
        const clonedImages = clonedElement.querySelectorAll('img');

        for (let i = 0; i < originalImages.length; i++) {
            const absoluteUrl = originalImages[i].src;
            const base64Data = await imageToBase64(absoluteUrl);
            clonedImages[i].src = base64Data;
        }

        const editables = clonedElement.querySelectorAll('.editable-text');
        editables.forEach(el => {
            el.removeAttribute('contenteditable');
            el.classList.remove('editable-text');
            el.style.outline = 'none';
            el.style.backgroundColor = 'transparent';
        });

        const finalHtmlString = clonedElement.outerHTML;
        const rawName = certificateDetails.value?.trainee?.full_name || 'Trainee';
        const safeName = rawName.replace(/\s+/g, '_');
        const timestamp = Date.now();
        const filename = `certificate_${safeName}_${timestamp}.pdf`;

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

// Helper to convert an image URL to a Base64 text string
const imageToBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn("Could not convert image to Base64:", url);
        return url;
    }
};

onMounted(() => {
    fetchTraineeDetails();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Satisfy&family=Great+Vibes&family=Montserrat:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

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
    outline: 2px solid #3b82f6;
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
    opacity: 0.03;
    pointer-events: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90' viewBox='0 0 120 90'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24' fill='%2364748b' font-family='Arial, sans-serif' font-weight='bold' transform='rotate(-30 60 45)'%3EATI MIZORAM%3C/text%3E%3C/svg%3E");
    background-repeat: repeat;
    z-index: 50;
}

#certificate-canvas,
#certificate-canvas * {
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
<template>
    <div class="min-h-screen bg-zinc-100 flex flex-col items-center print:p-0 print:bg-white text-black font-serif">

        <div class="fixed top-20 right-8 flex gap-4 z-[100] print:hidden">
            <button @click="saveSelectedOrder" :disabled="isLoading || isSaving"
                class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95">

                <svg v-if="isSaving" class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>

                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>

                {{ isSaving ? 'Generating...' : 'Sign PDF' }}
            </button>
            <router-link :to="{ name: 'training.session', params: { id: route.params.id } }"
                class="bg-white hover:bg-zinc-50 text-zinc-700 px-8 py-3 rounded-full border border-zinc-200 font-bold shadow-md transition-all">
                Close
            </router-link>
        </div>

        <div v-if="editor && !isLoading"
            class="fixed top-40 right-20 w-56 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-3 border border-zinc-200 z-[100] print:hidden">
            <p
                class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center pb-2 border-b border-zinc-100">
                Editor Tools</p>

            <select @change="editor.chain().focus().setFontFamily($event.target.value).run()"
                class="w-full text-xs p-2 border border-zinc-200 rounded-lg outline-none focus:border-indigo-500 bg-zinc-50">
                <option value="">Default Font</option>
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="Georgia, serif">Georgia</option>
            </select>

            <select @change="editor.chain().focus().setFontSize($event.target.value).run()"
                class="w-full text-xs p-2 border border-zinc-200 rounded-lg outline-none focus:border-indigo-500 bg-zinc-50">
                <option value="">Default Size</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
            </select>

            <div class="flex flex-wrap gap-1 justify-center mt-1">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'bg-indigo-100 text-indigo-600': editor.isActive('bold') }"
                    class="p-2 rounded-lg hover:bg-zinc-100 transition-colors tooltip" title="Bold">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-indigo-100 text-indigo-600': editor.isActive('italic') }"
                    class="p-2 rounded-lg hover:bg-zinc-100 transition-colors tooltip" title="Italic">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                </button>
                <button @click="editor.chain().focus().toggleUnderline().run()"
                    :class="{ 'bg-indigo-100 text-indigo-600': editor.isActive('underline') }"
                    class="p-2 rounded-lg hover:bg-zinc-100 transition-colors tooltip font-serif font-bold text-lg leading-none"
                    title="Underline" style="text-decoration: underline;">
                    U
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-indigo-100 text-indigo-600': editor.isActive('bulletList') }"
                    class="p-2 rounded-lg hover:bg-zinc-100 transition-colors tooltip" title="Bullet List">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <button @click="editor.chain().focus().undo().run()"
                    class="p-2 rounded-lg hover:bg-zinc-100 transition-colors tooltip text-zinc-500" title="Undo">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
            </div>
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
                    </div>
                </section>
            </template>

            <template v-else>
                <section
                    class="relative bg-white shadow-1xl print:shadow-none p-[25mm] w-[210mm] h-[296mm] flex flex-col mb-5 print:mb-0 page-break">
                    <div class="relative z-10 flex flex-col h-full">

                        <div class="flex flex-col mb-4 text-center leading-tight">
                            <p class="text-sm font-sans" contenteditable="true" spellcheck="false">No.
                                A.33028/3/2024-ATI</p>
                            <p class="font-bold uppercase text-lg mt-2" contenteditable="true" spellcheck="false">
                                Government of Mizoram</p>
                            <p class="font-bold uppercase text-base" contenteditable="true" spellcheck="false">
                                Administrative Training Institute</p>
                            <p class="text-sm italic" contenteditable="true" spellcheck="false">Aizawl : Mizoram</p>
                            <p class="mt-4 text-sm font-medium italic justify-end" contenteditable="true"
                                spellcheck="false">Dated Aizawl, the {{ currentFormattedDate }}</p>
                        </div>

                        <div class="mb-6 text-center">
                            <h2 class="text-lg font-bold underline decoration-2 underline-offset-8 uppercase tracking-widest"
                                contenteditable="true" spellcheck="false">
                                OFFICE ORDER
                            </h2>
                        </div>

                        <div class="text-[0.9rem] leading-[1.6] text-left sm:text-justify mb-8 editor-wrapper">
                            <editor-content :editor="editor" />
                        </div>

                        <div class="self-end w-56 text-center -mr-4">
                            <div class="leading-tight">
                                <p class="font-bold text-sm">Sd/- <span class="uppercase" contenteditable="true"
                                        spellcheck="false">LALRINMAWII HMAR</span></p>
                                <p class="font-bold text-sm" contenteditable="true" spellcheck="false">Joint Director
                                    (Trg.),</p>
                                <p class="text-xs mt-1 font-sans text-[#52525b] font-medium" contenteditable="true"
                                    spellcheck="false">Administrative Training Institute</p>
                                <p class="text-xs font-sans text-[#52525b]" contenteditable="true" spellcheck="false">
                                    Mizoram : Aizawl</p>
                            </div>
                        </div>

                        <div class=" pt-10 text-[0.85rem] leading-relaxed">
                            <div class="flex justify-between font-bold mb-3 text-sm">
                                <p contenteditable="true" spellcheck="false">Memo No. A.33029/2/2024-ATI :</p>
                                <p contenteditable="true" spellcheck="false">Dated Aizawl, the {{ currentFormattedDate
                                    }}</p>
                            </div>
                            <div class="space-y-1 pl-4">
                                <p class="font-bold italic" contenteditable="true" spellcheck="false">Copy to:-</p>
                                <ol class="space-y-1">
                                    <li v-for="(recipient, index) in copyToRecipients" :key="index"
                                        class="flex items-start gap-2">
                                        <span class="min-w-[20px] font-bold" contenteditable="true">{{ index + 1
                                            }}.</span>
                                        <span contenteditable="true" spellcheck="false">{{ recipient.designation
                                            }}</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <div class="mt-2 self-end w-56 text-center -mr-4">
                            <div class="leading-tight">
                                <p class="font-bold uppercase text-sm" contenteditable="true" spellcheck="false">(
                                    LALRINMAWII HMAR )</p>
                                <p class="font-bold text-sm" contenteditable="true" spellcheck="false">Joint Director
                                    (Trg.),</p>
                                <p class="text-xs mt-1 font-sans text-[#52525b] font-medium" contenteditable="true"
                                    spellcheck="false">Administrative Training Institute</p>
                                <p class="text-xs font-sans text-[#52525b]" contenteditable="true" spellcheck="false">
                                    Mizoram : Aizawl</p>
                            </div>
                        </div>
                    </div>
                </section>
                <template v-for="(page, pageIndex) in tablePages" :key="'page-' + pageIndex">
                    <section
                        class="relative bg-white shadow-2xl print:shadow-none p-[25mm] w-[210mm] h-[296mm] flex flex-col mb-10 print:mb-0 page-break overflow-hidden">

                        <div
                            class="absolute inset-0 pointer-events-none z-[50] flex items-center justify-center opacity-[0.16] select-none">

                            <img src="../../assets/ati_logo_1.png" alt="Watermark"
                                class="w-[350px] h-[350px] object-contain grayscale" />

                        </div>

                        <div class="relative z-10 flex flex-col h-full">
                            <div v-if="page.isFirst" class="text-center mb-6">
                                <h2 class="text-lg font-bold underline decoration-2 underline-offset-4 uppercase tracking-widest"
                                    contenteditable="true" spellcheck="false">
                                    Annexure
                                </h2>
                                <div class="mt-4 space-y-1 uppercase text-[#52525b] text-xs font-sans">
                                    <p class="font-bold text-black font-serif" contenteditable="true"
                                        spellcheck="false">
                                        List of Officials who are selected for </p>
                                    <p class="text-sm font-bold italic text-[#27272a] font-serif" contenteditable="true"
                                        spellcheck="false">"{{ trainingDetails?.t_name }}"</p>
                                    <p contenteditable="true" spellcheck="false">Period: {{
                                        formatDate(trainingDetails?.t_start_date) }} to {{
                                            formatDate(trainingDetails?.t_end_date) }}</p>

                                    <p class="font-bold text-black font-serif pt-1" contenteditable="true"
                                        spellcheck="false">
                                        Total Selected Officials: {{ selectedTraineeList?.length || 0 }}
                                    </p>
                                </div>
                            </div>

                            <div v-else class="text-center mb-4">
                                <h2 class="text-sm font-bold uppercase tracking-widest text-[#52525b] font-sans"
                                    contenteditable="true" spellcheck="false">
                                    Annexure (Continued) - Page {{ pageIndex + 1 }}
                                </h2>
                            </div>

                            <table
                                class="w-full border-collapse border-[1.5px] border-[#000000] text-xs bg-transparent">
                                <thead>
                                    <tr class="bg-transparent font-bold uppercase text-[10px] h-8">
                                        <th class="border border-[#000000] p-2 w-12 text-center" contenteditable="true">
                                            Sl. No</th>
                                        <th class="border border-[#000000] p-3 text-left font-serif"
                                            contenteditable="true">Full Name</th>
                                        <th class="border border-[#000000] p-3 w-40 text-left font-serif"
                                            contenteditable="true">Designation</th>
                                        <th class="border border-[#000000] p-3 text-left font-serif"
                                            contenteditable="true">Department</th>
                                        <th class="border border-[#000000] p-3 text-left font-serif"
                                            contenteditable="true">Mobile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(trainee, rowIndex) in page.rows" :key="rowIndex" class="h-8">
                                        <td class="border border-[#000000] p-2 text-center" contenteditable="true">
                                            {{ trainee ? (page.startIndex + rowIndex + 1) : '' }}
                                        </td>
                                        <td class="border border-[#000000] px-3 font-bold" contenteditable="true"
                                            spellcheck="false">
                                            {{ trainee?.user?.full_name || '' }}
                                        </td>
                                        <td class="border border-[#000000] px-3" contenteditable="true"
                                            spellcheck="false">
                                            {{ trainee?.user?.designation || '' }}
                                        </td>
                                        <td class="border border-[#000000] px-3" contenteditable="true"
                                            spellcheck="false">
                                            {{ trainee?.user?.department || '' }}
                                        </td>
                                        <td class="border border-[#000000] px-3" contenteditable="true"
                                            spellcheck="false">
                                            {{ trainee?.user?.mobile || '' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </template>

            </template>
        </div>
    </div>

    <form ref="eMudhraForm" method="post" action="https://demogateway-core.emsigner.com/Secure/index" class="hidden">
        <input type="hidden" name="Parameter1" :value="store.params?.parameter1" />
        <input type="hidden" name="Parameter2" :value="store.params?.parameter2" />
        <input type="hidden" name="Parameter3" :value="store.params?.parameter3" />
    </form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../../store/alertStore';
import { useEnrollmentStore } from '../../store/enrollmentStore';
import { formatDate } from '../../utils/dateFormatter';

import { Extension } from '@tiptap/core';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';

const alert = useAlertStore();
const store = useEnrollmentStore();
const { trainingDetails, selectedTraineeList, isLoading } = storeToRefs(store);
const isSaving = ref(false);
const route = useRoute();
const router = useRouter();
const eMudhraForm = ref(null);

const copyToRecipients = ref([
    { designation: 'All concerned Heads if Department/Controlling Departments with a request to relieve the selected officials for training' },
    { designation: 'All officials concerned for information and necessary action.' },
    { designation: 'Website Manager, Administrative Training Institute, Mizoram' },
    { designation: 'Reception Counter, Administrative Training Institute, Mizoram' },
]);

const currentFormattedDate = computed(() => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
});

// Create Custom Font Size Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] }; },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {};
                        return { style: `font-size: ${attributes.fontSize}` };
                    },
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

// Initialize Tiptap Editor
const editor = useEditor({
    content: '',
    extensions: [StarterKit, Underline, TextStyle, FontFamily, FontSize],
    editorProps: { attributes: { class: 'focus:outline-none min-h-[150px]' } },
});

// --- DYNAMIC TABLE PAGINATION LOGIC ---
const tablePages = computed(() => {
    const trainees = selectedTraineeList.value || [];
    const pages = [];
    const ROWS_FIRST_PAGE = 22;
    const ROWS_OTHER_PAGES = 27;

    if (trainees.length === 0) {
        pages.push({ isFirst: true, rows: [], startIndex: 0 });
        return pages;
    }

    let currentIndex = 0;
    let isFirst = true;

    while (currentIndex < trainees.length) {
        let limit = isFirst ? ROWS_FIRST_PAGE : ROWS_OTHER_PAGES;
        let chunk = trainees.slice(currentIndex, currentIndex + limit);

        // 🚨 Removed padding loop here so table only renders exact rows

        pages.push({ isFirst: isFirst, rows: chunk, startIndex: currentIndex });
        currentIndex += limit;
        isFirst = false;
    }
    return pages;
});

const generateSelectedTraineeOrder = async (trainingId) => {
    const respone = await store.generateSelectedTraineeOrder(trainingId)
    if (respone.success) {
        alert.success(respone.message)
    } else {
        alert.error(respone.message)
        router.back();
    }
}

onMounted(async () => {
    const id = route.params.id;
    await generateSelectedTraineeOrder(id);

    if (editor.value && trainingDetails.value) {
        editor.value.commands.setContent(`
            <p style="margin-bottom: 1.25rem;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The following officials are selected to attend training on
                <strong>"${trainingDetails.value.t_name}"</strong> to be conducted during
                <strong>${formatDate(trainingDetails.value.t_start_date)}</strong> to
                <strong>${formatDate(trainingDetails.value.t_end_date)}</strong>,
                at Administrative Training Institute, Aizawl, Mizoram. They are to report themselves at
                the reception counter of the Administrative Training Institute for registration on the
                <strong>${formatDate(trainingDetails.value.t_start_date)}</strong>
                from 09:30 AM onwards.
            </p>
            <p style="text-indent: 4rem;">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Selected Candidates who are unable to attend the said training should inform the Course
                Director. Failure to do so shall invite non-selection in the next course training.
            </p>
            <p style="text-indent: 4rem;">
                <span style="font-style: italic;">
                    In case of queries regarding training, kindly contact the officers below:-
                </span>
            </p>
            <p style="text-indent: 4rem;">
                <strong>Course Director:</strong> ${trainingDetails.value.t_director?.full_name ?? ''}
                <br>
                <strong>Contact No:</strong> ${trainingDetails.value.t_director?.mobile ?? ''}
                <br>
                <strong>For Hostel Accommodation:</strong> Pi K.Lalneihthangi
                <br>
                <strong>Contact No:</strong> 9862532023
            </p>
        `);
    }
});

const saveSelectedOrder = async () => {
    const trainingId = trainingDetails.value?._id;
    if (!trainingId) return alert.error("Training data is not fully loaded yet.");

    try {
        isSaving.value = true;
        const originalElement = document.getElementById('release-order-document');
        const clonedElement = originalElement.cloneNode(true);

        // 🚨 NEW: Convert all images (Watermarks) to Base64 so Puppeteer can see them 🚨
        const originalImages = originalElement.querySelectorAll('img');
        const clonedImages = clonedElement.querySelectorAll('img');

        for (let i = 0; i < originalImages.length; i++) {
            // originalImages[i].src gets the absolute URL the browser is currently looking at
            const absoluteUrl = originalImages[i].src;
            const base64Data = await imageToBase64(absoluteUrl);
            clonedImages[i].src = base64Data;
        }

        // Clean up editor tags to lock the PDF
        const editableNodes = clonedElement.querySelectorAll('[contenteditable="true"]');
        editableNodes.forEach(node => {
            node.removeAttribute('contenteditable');
            node.removeAttribute('spellcheck');
        });

        const finalHtmlString = clonedElement.outerHTML;
        const filename = `EnrolledOrder_${Date.now()}.pdf`;

        const payload = {
            trainingId: trainingId,
            filename: filename,
            htmlContent: finalHtmlString
        };

        const response = await store.saveSelectedOrder(payload);

        if (response.success) {
            let id = response.data._id;
            await prepareForEsign(id);
        } else {
            alert.error(response.message);
        }
    } catch (error) {
        console.error("Server PDF Generation Failed", error);
        alert.error("Failed to communicate with the server to generate PDF.");
    } finally {
        isSaving.value = false;
    }
};

const prepareForEsign = async (id) => {
    try {
        const response = await store.handleSignature(trainingDetails.value?._id, id);
        if (response.success) {
            await nextTick();
            eMudhraForm.value.submit();
            alert.success(response.message || "Please wait while redirecting to eMudhra!");
        } else {
            alert.error(response.message);
        }
    } catch (ex) {
        console.error("Server PDF Generation Failed", ex);
        alert.error("Failed to communicate with the server to generate PDF.");
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
        return url; // Fallback to original URL if it fails
    }
};
</script>

<style>
.ProseMirror p {
    margin-bottom: 1rem;
}

.ProseMirror ul {
    list-style-type: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
}

[contenteditable="true"],
.ProseMirror {
    outline: none;
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
}

[contenteditable="true"]:hover,
.editor-wrapper:hover {
    background-color: rgba(99, 102, 241, 0.05);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

[contenteditable="true"]:focus,
.ProseMirror-focused {
    background-color: rgba(99, 102, 241, 0.08) !important;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3) !important;
}

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

    [contenteditable="true"]:hover,
    [contenteditable="true"]:focus,
    .editor-wrapper:hover,
    .ProseMirror-focused {
        background-color: transparent !important;
        box-shadow: none !important;
    }
}

.page-break {
    break-after: page;
}

.font-serif {
    font-family: 'Times New Roman', Times, serif;
}
</style>
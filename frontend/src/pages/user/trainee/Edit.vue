<template>
    <div class="max-w-4xl mx-auto pb-10">
        <Breadcrumbs :items="breadcrumbs" />

        <div v-if="isInitialLoading" class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Profile...</p>
        </div>

        <form v-else @submit.prevent="submitForm" class="space-y-6">
            <div class="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-white/10">

                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 gap-4">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Edit Personal Information
                        </h3>
                        <span v-if="form.is_blacklisted"
                            class="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase border border-rose-500/20 animate-pulse">
                            Blacklisted
                        </span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button v-if="form.is_blacklisted" type="button" @click="handleRevoke"
                            class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white cursor-pointer">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Revoke
                        </button>

                        <button type="button" @click="openBlacklistModal"
                            class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer"
                            :class="form.is_blacklisted
                                ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/20'
                                : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-rose-500 hover:text-white hover:border-rose-600'">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            {{ form.is_blacklisted ? 'Edit Dates' : 'Blacklist' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BaseInput v-model="form.full_name" label="Full Name" placeholder="John Doe" type="text" />
                    <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="john@example.com" />

                    <BaseInput v-model="form.mobile" type="text" label="Mobile Number" placeholder="017..." />
                    <BaseInput v-model="form.password" type="password" label="New Password"
                        placeholder="Leave blank to keep current" />

                    <SingleSelect :options="genderOptions" v-model="form.gender" option-label="name" track-by="name"
                        label="Gender" />
                    <SingleSelect :options="districts" v-model="form.district" track-by="_id" label="District" />
                    <DatePicker label="Date of Birth" v-model="form.dob" format="dd/MM/yyyy" />
                    <SingleSelect label="Category" :options="categoryOptions" v-model="form.category" track-by="name"
                        option-label="name" placeholder="Select category..." />
                </div>

                <div class="flex items-start gap-3 p-4 mt-5 rounded-xl border transition-all" :class="form.is_govt_employee
                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                    : 'bg-zinc-50 border-zinc-200 dark:bg-white/5 dark:border-white/10'">
                    <div class="flex items-center h-5">
                        <input id="govt-check" type="checkbox" v-model="form.is_govt_employee"
                            class="h-5 w-5 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900" />
                    </div>
                    <label for="govt-check" class="flex flex-col cursor-pointer">
                        <span class="text-sm font-bold transition-colors"
                            :class="form.is_govt_employee ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'">
                            Government Employee
                        </span>
                    </label>
                </div>

                <div v-if="form.is_govt_employee">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <BaseInput v-model="form.designation" type="text" label="Designation"
                            placeholder="e.g. Executive" />
                        <BaseInput v-model="form.department" type="text" label="Department"
                            placeholder="e.g. Operations" />
                        <SingleSelect :options="groups" v-model="form.group" track-by="_id" option-label="group_name"
                            label="Assign Groups" placeholder="Select groups..." />
                        <DatePicker label="Date of Joining Service" v-model="form.date_of_entry" format="dd/MM/yyyy" />
                        <DatePicker label="Date of Joining in Present Grade"
                            v-model="form.date_of_entry_in_present_grade" format="dd/MM/yyyy" />
                        <DatePicker label="Date of Superannuation" v-model="form.date_of_superannuation"
                            format="dd/MM/yyyy" />

                        <SingleSelect label="Recruitment" :options="recruitmentOptions" v-model="form.recruitment"
                            track-by="name" option-label="name" placeholder="Select recruitment..." />

                        <SingleSelect label="Confirmation" :options="confirmationOptions" v-model="form.confirmation"
                            track-by="name" option-label="name" placeholder="Select confirmation..." />
                        <BaseInput v-model="form.qualification" type="text" label="Qualification"
                            placeholder="e.g. BA/MA" />
                        <SingleSelect label="Service" :options="serviceOptions" v-model="form.service" track-by="name"
                            option-label="name" placeholder="Select service..." />
                        <BaseInput label="Service Cadre (if applicable)" v-model="form.service_cadre" />

                        <div class="md:col-span-2 space-y-4">
                            <div class="flex items-start gap-3 p-4 rounded-xl border transition-all" :class="form.mandatory_completion
                                ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                                : 'bg-zinc-50 border-zinc-200 dark:bg-white/5 dark:border-white/10'">
                                <div class="flex items-center h-5">
                                    <input id="mandatory-check" type="checkbox" v-model="form.mandatory_completion"
                                        class="h-5 w-5 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900" />
                                </div>
                                <label for="mandatory-check" class="flex flex-col cursor-pointer">
                                    <span class="text-sm font-bold transition-colors"
                                        :class="form.mandatory_completion ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'">
                                        Mandatory Foundation Training ka attend tawh e
                                    </span>
                                    <span class="text-xs text-zinc-500 mt-0.5">
                                        Mandatory Foundation Training i attend tawh chuan Tick la, i la attend loh chuan
                                        Tick suh
                                    </span>
                                </label>
                            </div>

                            <Transition name="fade">
                                <div v-if="!form.mandatory_completion && form.group"
                                    class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 items-center">
                                    <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span class="text-[11px] font-medium text-amber-700 dark:text-amber-500">
                                        User will be flagged as "Training Required" for government service compliance.
                                    </span>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <div
                    class="mt-10 pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ID: {{ route.params.id }}
                    </p>
                    <div class="flex gap-3 w-full sm:w-auto">
                        <button type="button" @click="router.back()"
                            class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 font-bold text-sm transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="flex-1 sm:flex-none flex items-center justify-center px-10 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md shadow-emerald-700/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            {{ isLoading ? 'Processing...' : 'Update Trainee Profile' }}
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <BaseModal :show="isBlacklistModalOpen" confirmVariant="danger"
            :confirmText="form.is_blacklisted ? 'Update Restriction' : 'Apply Blacklist'"
            @close="isBlacklistModalOpen = false" @confirm="confirmBlacklist">
            <template #title>Account Restriction</template>
            <template #content>
                <div class="space-y-4 py-2 text-left">
                    <p class="text-sm text-zinc-500">Define the parameters for this trainee's restriction.</p>
                    <div class="space-y-4">
                        <div>
                            <label
                                class="block text-[10px] font-black uppercase text-zinc-400 mb-1 tracking-widest">Reason</label>
                            <textarea v-model="blacklistForm.reason" rows="3"
                                class="w-full p-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/20"
                                placeholder="State the reason..."></textarea>
                        </div>
                        <div>
                            <label
                                class="block text-[10px] font-black uppercase text-zinc-400 mb-1 tracking-widest">Restriction
                                End Date</label>
                            <input v-model="blacklistForm.end_date" type="date"
                                class="w-full p-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/20" />
                        </div>
                    </div>
                </div>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import BaseModal from "../../../components/ui/BaseModal.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import DatePicker from "../../../components/ui/DatePicker.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useUserManageStore } from "../../../store/userManageStore.js";

const props = defineProps({
    id: { type: String, default: '' }
});

const route = useRoute();
const router = useRouter();
const alert = useAlertStore();
const store = useUserManageStore();
const { districts, groups } = storeToRefs(store);

const isLoading = ref(false);
const isInitialLoading = ref(true);
const isBlacklistModalOpen = ref(false);

const genderOptions = [
    { name: "Male" },
    { name: "Female" },
    { name: "Others" }
];

const recruitmentOptions = [
    { name: "Direct" },
    { name: "Regularisation" },
    { name: "Absorption" }
];

const confirmationOptions = [
    { name: "Confirmed" },
    { name: "Not Confirmed" }
];

const serviceOptions = [
    { name: 'State' },
    { name: 'Central' },
    { name: 'Others' }
];

const categoryOptions = [
    { name: 'ST' },
    { name: 'SC' },
    { name: 'General' },
    { name: 'OBC' },
    { name: 'Others' }
];

const form = reactive({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    district: '',
    designation: '',
    department: '',
    group: null,
    gender: '',
    mandatory_completion: true,
    is_govt_employee: true,
    date_of_entry: null,
    date_of_entry_in_present_grade: null,
    date_of_superannuation: null,
    recruitment: '',
    confirmation: '',
    service_cadre: '',
    dob: null,
    disclaimer: true,
    qualification: '',
    service: '',
    category: '',
    is_blacklisted: false,
    blacklist_details: null
});

const blacklistForm = reactive({
    reason: '',
    end_date: ''
});

const breadcrumbs = [
    { label: "Trainees", to: "/admin/trainee" },
    { label: "Edit Trainee", to: "" }
];

const fetchTraineeData = async () => {
    isInitialLoading.value = true;
    try {
        const traineeId = props.id || route.params.id;
        const data = await store.fetchTraineeById(traineeId);
        if (data) {
            Object.assign(form, {
                full_name: data.full_name || '',
                email: data.email || '',
                mobile: data.mobile || '',
                password: '',
                district: data.district?._id || data.district || '',
                designation: data.designation || '',
                department: data.department || '',
                group: data.group?._id || data.group || null,
                gender: data.gender || '',
                mandatory_completion: data.mandatory_completion ?? true,
                is_govt_employee: data.is_govt_employee ?? true,
                date_of_entry: data.date_of_entry ? new Date(data.date_of_entry) : null,
                date_of_entry_in_present_grade: data.date_of_entry_in_present_grade ? new Date(data.date_of_entry_in_present_grade) : null,
                date_of_superannuation: data.date_of_superannuation ? new Date(data.date_of_superannuation) : null,
                recruitment: data.recruitment || '',
                confirmation: data.confirmation || '',
                service_cadre: data.service_cadre || '',
                dob: data.dob ? new Date(data.dob) : null,
                disclaimer: data.disclaimer ?? true,
                qualification: data.qualification || '',
                service: data.service || '',
                category: data.category || '',
                is_blacklisted: data.is_blacklisted || false,
                blacklist_details: data.blacklist_details || null
            });
        }
    } catch (error) {
        alert.error("Failed to load trainee details.");
        router.push('/admin/trainee');
    } finally {
        isInitialLoading.value = false;
    }
};

const openBlacklistModal = () => {
    blacklistForm.reason = form.blacklist_details?.reason || '';
    blacklistForm.end_date = form.blacklist_details?.end_date
        ? new Date(form.blacklist_details.end_date).toISOString().split('T')[0]
        : '';
    isBlacklistModalOpen.value = true;
};

const confirmBlacklist = async () => {
    if (!blacklistForm.reason || !blacklistForm.end_date) {
        return alert.error("Please provide both a reason and an expiry date.");
    }
    try {
        const traineeId = props.id || route.params.id;
        const res = await store.blacklistTrainee(traineeId, { ...blacklistForm });
        if (res.success) {
            alert.success(res.message);
            isBlacklistModalOpen.value = false;
            fetchTraineeData();
        } else {
            alert.error(res.message);
        }
    } catch (e) {
        alert.error("Error updating blacklist status.");
    }
};

const handleRevoke = async () => {
    if (!confirm(`Revoke restriction for ${form.full_name}?`)) return;
    try {
        const traineeId = props.id || route.params.id;
        const res = await store.blacklistTrainee(traineeId, {
            reason: '',
            end_date: null,
            revoke: true
        });
        if (res.success) {
            alert.success("Access restored successfully.");
            fetchTraineeData();
        } else {
            alert.error(res.message);
        }
    } catch (e) {
        alert.error("Error revoking restriction.");
    }
};

const submitForm = async () => {
    isLoading.value = true;
    try {
        const traineeId = props.id || route.params.id;
        const payload = {
            ...form,
            gender: form.gender?.name || form.gender || undefined,
            category: form.category?.name || form.category || undefined,
            recruitment: form.recruitment?.name || form.recruitment || undefined,
            confirmation: form.confirmation?.name || form.confirmation || undefined,
            service: form.service?.name || form.service || undefined,
            district: form.district?._id || form.district || undefined,
            group: form.group?._id || form.group || undefined,
            password: form.password ? form.password : undefined
        };

        if (!payload.password) {
            delete payload.password;
        }

        const response = await store.updateTrainee(traineeId, payload);
        if (response.success) {
            alert.success(response.message || "Profile updated successfully");
            router.push('/admin/trainee');
        } else {
            alert.error(response.message);
        }
    } catch (error) {
        alert.error('An error occurred during update.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await Promise.all([
        store.fetchDistricts(),
        store.fetchGroups(),
        fetchTraineeData()
    ]);
});
</script>
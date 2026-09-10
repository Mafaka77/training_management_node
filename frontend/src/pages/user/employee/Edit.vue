<template>
    <div class="max-w-4xl mx-auto pb-10">
        <Breadcrumbs :items="breadcrumbs" />

        <div v-if="isInitialLoading" class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-sm font-bold text-zinc-500 uppercase tracking-widest">Loading Employee Details...</p>
        </div>

        <form v-else @submit.prevent="submitForm" class="space-y-6">
            <div class="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-white/10">

                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4 gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Edit Employee Details
                        </h3>
                        <p class="text-sm text-zinc-500">Update the personal and official information of this employee.</p>
                    </div>

                    <div>
                        <button type="button" @click="toggleEmployeeStatus" :disabled="isLoading" :class="[
                            'px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50 cursor-pointer',
                            form.is_active
                                ? 'text-amber-700 bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                                : 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                        ]">
                            {{ form.is_active ? 'Deactivate' : 'Activate' }}
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
                            class="h-5 w-5 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900" />
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
                        <BaseInput v-model="form.designation" type="text" label="Designation" placeholder="e.g. Executive" />

                        <SingleSelect :options="departmentParents" v-model="form.departmentParent" track-by="_id"
                            option-label="name" label="Department" placeholder="Select department..." searchable />
                        <BaseInput v-model="form.department" type="text" label="Office / Department"
                            placeholder="e.g. Operations / Directorate" />
                        <SingleSelect :options="groups" v-model="form.group" track-by="_id" option-label="group_name"
                            label="Assign Groups" placeholder="Select groups..." />
                        <DatePicker label="Date of Joining Service" v-model="form.date_of_entry" format="dd/MM/yyyy" />
                        <DatePicker label="Date of Joining in Present Grade" v-model="form.date_of_entry_in_present_grade"
                            format="dd/MM/yyyy" />
                        <DatePicker label="Date of Superannuation" v-model="form.date_of_superannuation" format="dd/MM/yyyy" />

                        <SingleSelect label="Recruitment" :options="recruitmentOptions" v-model="form.recruitment" track-by="name"
                            option-label="name" placeholder="Select recruitment..." />

                        <SingleSelect label="Confirmation" :options="confirmationOptions" v-model="form.confirmation"
                            track-by="name" option-label="name" placeholder="Select confirmation..." />
                        <BaseInput v-model="form.qualification" type="text" label="Qualification" placeholder="e.g. BA/MA" />
                        <SingleSelect label="Service" :options="serviceOptions" v-model="form.service" track-by="name"
                            option-label="name" placeholder="Select service..." />
                        <BaseInput label="Service Cadre (if applicable)" v-model="form.service_cadre" />

                        <div class="md:col-span-2 space-y-4">
                            <div class="flex items-start gap-3 p-4 rounded-xl border transition-all" :class="form.mandatory_completion
                                ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                                : 'bg-zinc-50 border-zinc-200 dark:bg-white/5 dark:border-white/10'">
                                <div class="flex items-center h-5">
                                    <input id="mandatory-check" type="checkbox" v-model="form.mandatory_completion"
                                        class="h-5 w-5 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900" />
                                </div>
                                <label for="mandatory-check" class="flex flex-col cursor-pointer">
                                    <span class="text-sm font-bold transition-colors"
                                        :class="form.mandatory_completion ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'">
                                        Mandatory Foundation Training ka attend tawh e
                                    </span>
                                    <span class="text-xs text-zinc-500 mt-0.5">
                                        Mandatory Foundation Training i attend tawh chuan Tick la, i la attend loh chuan Tick suh
                                    </span>
                                </label>
                            </div>

                            <Transition name="fade">
                                <div v-if="!form.mandatory_completion && form.group"
                                    class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 items-center">
                                    <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                <h3
                    class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-6 border-b border-zinc-100 dark:border-white/5 pb-2">
                    Roles & Signature
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Assign Roles</label>
                        <div class="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                            <label class="inline-flex items-center cursor-pointer space-x-3">
                                <input type="checkbox" v-model="form.trainer"
                                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Trainer</span>
                            </label>
                            <label class="inline-flex items-center cursor-pointer space-x-3">
                                <input type="checkbox" v-model="form.course_director"
                                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Course Director</span>
                            </label>
                            <label class="inline-flex items-center cursor-pointer space-x-3">
                                <input type="checkbox" v-model="form.director"
                                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Director</span>
                            </label>
                            <label class="inline-flex items-center cursor-pointer space-x-3">
                                <input type="checkbox" v-model="form.trainee"
                                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Trainee</span>
                            </label>
                        </div>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Upload Signature for Certificate
                        </label>
                        <SignaturePicker v-model="form.signature" accept=".png, .jpg, .jpeg" class="h-[188px]" @change="handleBanner" />
                    </div>
                </div>

                <div class="mt-10 pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-end gap-4">
                    <button type="button" @click="$router.back()"
                        class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isLoading"
                        class="flex items-center justify-center px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isLoading ? 'Updating...' : 'Update Employee' }}
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import DatePicker from "../../../components/ui/DatePicker.vue";
import SignaturePicker from "../../../components/ui/SignaturePicker.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useUserManageStore } from "../../../store/userManageStore.js";

const route = useRoute();
const alert = useAlertStore();
const store = useUserManageStore();
const { districts, groups, departmentParents } = storeToRefs(store);

const isLoading = ref(false);
const isInitialLoading = ref(true);

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
    departmentParent: null,
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
    trainer: false,
    course_director: false,
    director: false,
    trainee: false,
    signature: null,
    is_active: true,
});

const breadcrumbs = [
    { label: "Employee", to: "/admin/employee" },
    { label: "Update Employee" }
];

const fetchEmployee = async () => {
    isInitialLoading.value = true;
    try {
        const response = await store.fetchEmployee(route.params.id);
        if (response.success) {
            const user = response.data;
            const hasRole = (roleName) => {
                return user.roles?.some(role => role.name === roleName) || false;
            };

            Object.assign(form, {
                full_name: user.full_name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                password: '',
                district: user.district?._id || user.district || '',
                designation: user.designation || '',
                department: user.department || '',
                departmentParent: user.departmentParent?._id || user.departmentParent || null,
                group: user.group?._id || user.group || null,
                gender: user.gender || '',
                mandatory_completion: user.mandatory_completion ?? true,
                is_govt_employee: user.is_govt_employee ?? true,
                date_of_entry: user.date_of_entry ? new Date(user.date_of_entry) : null,
                date_of_entry_in_present_grade: user.date_of_entry_in_present_grade ? new Date(user.date_of_entry_in_present_grade) : null,
                date_of_superannuation: user.date_of_superannuation ? new Date(user.date_of_superannuation) : null,
                recruitment: user.recruitment || '',
                confirmation: user.confirmation || '',
                service_cadre: user.service_cadre || '',
                dob: user.dob ? new Date(user.dob) : null,
                disclaimer: user.disclaimer ?? true,
                qualification: user.qualification || '',
                service: user.service || '',
                category: user.category || '',
                trainer: hasRole('Trainer'),
                course_director: hasRole('Course Director'),
                director: hasRole('Director'),
                trainee: hasRole('Trainee'),
                is_active: user.is_active ?? true,
                signature: user.signature ? import.meta.env.VITE_IMAGE_URL + user.signature : null,
            });
        } else {
            alert.error(response.message || "Failed to fetch employee details");
        }
    } catch (e) {
        alert.error("Failed to load employee details.");
    } finally {
        isInitialLoading.value = false;
    }
};

function handleBanner(file) {
    form.signature = file;
}

const submitForm = async () => {
    if (!form.full_name || !form.email || !form.mobile) {
        alert.error("Please fill in the required fields (Full Name, Email, Mobile).");
        return;
    }
    isLoading.value = true;
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
        const value = form[key];
        if (typeof value === 'boolean') {
            formData.append(key, value.toString());
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'object' && value._id) {
                formData.append(key, value._id);
            } else if (key === 'signature') {
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else {
                formData.append(key, value);
            }
        }
    });

    try {
        const response = await store.updateEmployee(formData, route.params.id);

        if (!response.success) {
            alert.error(response.message);
        } else {
            alert.success(response.message);
            fetchEmployee();
        }
    } catch (error) {
        alert.error('An error occurred while saving the employee.');
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const toggleEmployeeStatus = async () => {
    try {
        const response = await store.toggleEmployeeStatus(route.params.id);
        if (response.success) {
            alert.success(response.message);
            fetchEmployee();
        } else {
            alert.error(response.message);
        }
    } catch (error) {
        alert.error('An error occurred while changing employee status.');
        console.error(error);
    }
};

onMounted(async () => {
    await Promise.all([
        store.fetchDistricts(),
        store.fetchGroups(),
        store.fetchDepartmentParents(),
        route.params.id ? fetchEmployee() : null
    ]);
});
</script>

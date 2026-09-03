<template>
    <div class="max-w-5xl mx-auto pb-12">
        <Breadcrumbs :items="breadcrumbs" />

        <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>

        <form v-else @submit.prevent="submitForm">
            <section
                class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">

                <div class="flex items-center gap-2 mb-6 text-blue-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Location
                        Configuration</h2>
                </div>

                <div class="space-y-4">
                    <BaseInput v-model="form.location_name" label="Location Name" placeholder="e.g. ATI Campus"
                        type="text" />
                    <BaseInput v-model.number="form.radius" label="Radius (in meters)" placeholder="e.g. 50"
                        type="number" />
                    <BaseInput v-model="form.latitude" label="Latitude" placeholder="e.g. 23.7271" type="text" />
                    <BaseInput v-model="form.longitude" label="Longitude" placeholder="e.g. 92.7176" type="text" />
                </div>

                <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
                    <button type="button" @click="$router.push('/admin/master/location')"
                        class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all">
                        Cancel
                    </button>

                    <button type="submit" :disabled="isUpdating"
                        class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]">
                        <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span>{{ isUpdating ? 'Updating...' : 'Update Location' }}</span>
                    </button>
                </div>
            </section>
        </form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useMasterStore } from "../../../store/masterStore.js";

const route = useRoute();
const router = useRouter();
const alert = useAlertStore();
const store = useMasterStore();

const loading = ref(true);
const isUpdating = ref(false);

const form = reactive({
    location_name: '',
    radius: 50,
    latitude: '',
    longitude: ''
});

const breadcrumbs = [
    { label: "Geo Locations", to: "/admin/master/location" },
    { label: "Edit Location" }
];

async function fetchLocationData(id) {
    if (!id) return;
    loading.value = true;
    try {
        const res = await store.fetchLocation(id);
        if (res.success && res.data) {
            const loc = res.data;
            form.location_name = loc.location_name || '';
            form.radius = loc.radius ?? 50;
            if (loc.location && Array.isArray(loc.location.coordinates)) {
                form.longitude = loc.location.coordinates[0]?.toString() || '';
                form.latitude = loc.location.coordinates[1]?.toString() || '';
            }
        } else {
            alert.error(res.message || "Could not fetch location details");
        }
    } catch (err) {
        alert.error("Error loading location details");
    } finally {
        loading.value = false;
    }
}

watch(() => route.params.id, (newId) => {
    if (newId) fetchLocationData(newId);
});

onMounted(() => {
    fetchLocationData(route.params.id);
});

const submitForm = async () => {
    if (!form.latitude || !form.longitude) {
        alert.warning("Please provide valid latitude and longitude coordinates.");
        return;
    }

    isUpdating.value = true;
    const payload = {
        location_name: form.location_name,
        radius: form.radius || 50,
        coordinates: [
            parseFloat(form.longitude),
            parseFloat(form.latitude)
        ]
    };

    try {
        const response = await store.updateLocation(route.params.id, payload);
        if (!response.success) {
            alert.error(response.message);
        } else {
            alert.success(response.message || "Location updated successfully!");
            router.push('/admin/master/location');
        }
    } catch (error) {
        alert.error(error.message || "Failed to update location");
    } finally {
        isUpdating.value = false;
    }
};
</script>

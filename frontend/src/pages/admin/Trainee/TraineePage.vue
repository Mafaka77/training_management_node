<template>
    <div class="q-pa-md">
        <q-btn color="primary" icon="add" label="Add Trainee" @click="showDialog = true" class="q-mb-md" />

        <!-- Trainee Table -->
        <q-table class="styled-table shadow-2 rounded-borders" flat bordered title="Trainees" :rows="trainees" :columns="columns" row-key="id"
            :loading="loading" @request="onRequest">
            <template v-slot:top-right>
                <q-input dense debounce="300" v-model="search" placeholder="Search..." outlined clearable
                    @update:model-value="onSearch">
                    <template #append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>

        <!-- Create Trainee Dialog -->
        <q-dialog v-model="showDialog" persistent>
            <q-card style="min-width: 500px" class="q-pa-md">
                <q-card-section>
                    <div class="text-h6 text-primary">Add New Trainee</div>
                </q-card-section>

                <q-separator />

                <q-card-section>
                    <q-form @submit.prevent="submitForm" class="q-gutter-md">
                        <q-input v-model="form.full_name" label="Full Name" outlined />
                        <q-input v-model="form.email" label="Email" outlined type="email" />
                        <q-input v-model="form.password" label="Password" outlined type="password" />
                        <q-input v-model="form.mobile" label="Mobile" outlined />
                        <q-input v-model="form.department" label="Department" outlined />
                        <q-select v-model="form.district"
                            :options="districts.map(d => ({ label: d.name, value: d._id }))" label="District" outlined
                            emit-value map-options />

                        <div class="row justify-end q-gutter-sm">
                            <q-btn flat label="Cancel" color="negative" v-close-popup />
                            <q-btn type="submit" label="Save" color="primary" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
        <!-- Success Dialog -->
        <q-dialog v-model="successDialog">
            <q-card>
                <q-card-section class="text-green text-center">
                    ✅ Trainee created successfully!
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const trainees = ref([]);
const showDialog = ref(false);
const loading = ref(false);
const search = ref("");
const districts = ref([])
// Form

const form = ref({
    full_name: "",
    email: "",
    password: "",
    mobile: "",
    department: "",
    district: "",
    roles: ["68b01472d1838d6cd773d6fa"] // trainee role
})


const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
});

// Table columns
const columns = [
    { name: "full_name", label: "Name", field: "full_name", sortable: true },
    { name: "email", label: "Email", field: "email" },
    { name: "mobile", label: "Mobile", field: "mobile" },
    { name: "department", label: "Department", field: "department" }
];

// Submit new trainee
const submitForm = async () => {
    try {
        const { data } = await api.post("/admin/trainee", form.value);
        showDialog.value = false;
        resetForm();

        // Immediately update table
        if (data?.trainee) {
            trainees.value.unshift(data.trainee);
        }

        // Then refresh from server
        fetchTrainees();
    } catch (err) {
        console.error("Submit trainee failed:", err);
    }
};


function resetForm() {
    form.value = {
        full_name: "",
        email: "",
        password: "",
        mobile: "",
        department: "",
        district: ["68a58be10e14dc50904566a3"],
        roles: ["68b01472d1838d6cd773d6fa"]
    };
}




async function fetchDistricts() {
    try {
        const res = await api.get("/admin/get-all-district")
        districts.value = res.data.districts || []
    } catch (err) {
        console.error("Error fetching districts:", err)
    }
}

// Fetch trainees
async function fetchTrainees() {
    loading.value = true;
    try {
        const { page, rowsPerPage } = pagination.value;
        const res = await api.get(
            `/admin/trainees?search=${search.value}&page=${page}&limit=${rowsPerPage}`
        );
        trainees.value = res.data.trainees || [];
        pagination.value.rowsNumber = res.data.pagination?.total || 0;
    } catch (err) {
        console.error("Error fetching trainees", err);
    } finally {
        loading.value = false;
    }
}

function onRequest(props) {
    pagination.value = props.pagination;
    fetchTrainees();
}

function onSearch() {
    pagination.value.page = 1;
    fetchTrainees();
}

onMounted(() => {
    fetchTrainees();
    fetchDistricts();
});
</script>

<style lang="sass">
.styled-table
  thead tr th
    background-color: #00b4ff
    color: white
    font-weight: bold
    text-transform: uppercase
  tbody tr:nth-child(even)
    background: #f5faff
  tbody tr:hover
    background: #e0f7ff
    transition: background 0.2s
</style>

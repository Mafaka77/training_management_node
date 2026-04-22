<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">

        <div class="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-lg">

            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-500 mx-auto" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <h4 class="mt-6 mb-2 text-3xl font-bold text-gray-800">
                Signature Complete!
            </h4>
            <p class="text-lg text-gray-500">
                The release order has been successfully signed and saved to the ATI database.
            </p>

            <router-link :to="`/admin/training/${trainingId}/session`"
                class="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out text-lg shadow-sm hover:shadow-md">
                Return to Training Details
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Extract the trainingId directly from the URL path
const trainingId = computed(() => route.params.id)

onMounted(() => {
    if (trainingId.value) {
        console.log(`Successfully returned from eMudhra for Training ID: ${trainingId.value}`)
    }
})
</script>
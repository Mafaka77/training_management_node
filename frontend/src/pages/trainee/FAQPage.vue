<template>
  <q-page class="q-pa-md">

    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Frequently Asked Questions</div>
    </div>

    <!-- FAQ List -->
    <q-card flat bordered v-if="faqs.length">
      <q-table
        :rows="faqs"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        dense
        :pagination="pagination"
      >
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
        </template>
      </q-table>
    </q-card>

    <q-banner v-else class="bg-grey-3 text-center q-pa-md">
      No FAQs available.
    </q-banner>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { date, Notify } from 'quasar'

const faqs = ref([])
const pagination = ref({ page: 1, rowsPerPage: 10 })

const columns = [
  { name: 'question', label: 'Question', field: 'question', align: 'left' },
  { name: 'answer', label: 'Answer', field: 'answer', align: 'left' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'createdAt', label: 'Created At', field: 'createdAt', align: 'left' }
]

const fetchFaqs = async () => {
  try {
    const res = await api.get('/api/faqs')
    faqs.value = res.data.faq || []
  } catch (err) {
    console.error('Failed to fetch FAQs:', err)
    Notify.create({ type: 'negative', message: 'Failed to fetch FAQs.' })
  }
}

const formatDate = (d) => date.formatDate(d, 'DD MMM YYYY, hh:mm A')

onMounted(fetchFaqs)
</script>

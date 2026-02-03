<template>
  <q-page class="q-pa-md faq-page">

    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Frequently Asked Questions</div>

      <!-- Category Filter -->
      <q-select
        v-model="selectedCategory"
        :options="categoryOptions"
        label="Filter by Category"
        dense
        outlined
        clearable
        class="category-filter"
        emit-value
        map-options
      />
    </div>

    <!-- FAQ List -->
    <div v-if="filteredFaqs.length">
      <q-card
        v-for="faq in filteredFaqs"
        :key="faq._id"
        flat
        bordered
        class="q-mb-md faq-card"
      >
        <q-expansion-item
          expand-icon-toggle
          header-class="faq-header"
        >
          <template #header>
            <div class="column">
              <div class="text-subtitle1 text-weight-medium">
                {{ faq.question }}
              </div>
              <div class="text-caption text-grey">
                {{ faq.category }} • {{ formatDate(faq.createdAt) }}
              </div>
            </div>
          </template>

          <q-card-section class="text-body2">
            {{ faq.answer }}
          </q-card-section>
        </q-expansion-item>
      </q-card>
    </div>

    <!-- Empty State -->
    <q-banner v-else class="bg-grey-2 text-grey-7 text-center q-pa-md">
      No FAQs found for the selected category.
    </q-banner>

  </q-page>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { date, Notify } from 'quasar'

const faqs = ref([])
const selectedCategory = ref(null)

const fetchFaqs = async () => {
  try {
    const res = await api.get('/api/faqs')
    faqs.value = res.data.faq || []
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch FAQs data: ' + err.message
    })
  }
}

const categoryOptions = computed(() => {
  const categories = faqs.value.map(f => f.category)
  return [...new Set(categories)].map(c => ({
    label: c,
    value: c
  }))
})

const filteredFaqs = computed(() => {
  if (!selectedCategory.value) return faqs.value
  return faqs.value.filter(f => f.category === selectedCategory.value)
})

const formatDate = (d) =>
  date.formatDate(d, 'DD MMM YYYY')

onMounted(fetchFaqs)
</script>

<style scoped>
.faq-page {
  max-width: 900px;
  margin: auto;
}

.category-filter {
  min-width: 220px;
}

.faq-card {
  border-radius: 12px;
}

.faq-header {
  padding: 16px;
}
</style>

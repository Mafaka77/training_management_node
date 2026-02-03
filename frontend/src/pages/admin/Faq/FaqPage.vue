<template>
  <div class="q-pa-md">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Frequently Asked Questions</div>
      <q-btn color="primary" icon="add" label="Add FAQ" @click="openAddDialog" />
    </div>

    <!-- Search + Category Filter -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-8">
        <q-input dense outlined debounce="300" v-model="filter" placeholder="Search FAQs...">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <q-select
          dense
          outlined
          clearable
          v-model="selectedCategory"
          :options="categoryOptions"
          label="Filter by Category"
        />
      </div>
    </div>

    <!-- FAQ Cards -->
    <div class="row q-col-gutter-md">
      <div v-for="faq in filteredFAQs" :key="faq._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered flat class="faq-card">
          <q-card-section>
            <div class="text-h6 text-primary ellipsis-2-lines cursor-pointer" @click="viewFAQ(faq)">
              {{ faq.question }}
            </div>
            <div class="text-caption text-grey q-mt-xs">
              {{ faq.category || 'Uncategorized' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-body2 text-grey-8 ellipsis-3-lines">
            {{ faq.answer }}
          </q-card-section>

          <q-separator />

          <q-card-actions align="around">
            <q-btn dense flat color="primary" icon="visibility" @click="viewFAQ(faq)" />
            <q-btn dense flat color="orange" icon="edit" @click="openEditDialog(faq)" />
            <q-btn dense flat color="negative" icon="delete" @click="deleteFAQ(faq._id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredFAQs.length && !loading" class="text-center q-mt-xl text-grey">
      <q-icon name="help_outline" size="56px" color="grey-5" />
      <div class="text-subtitle1 q-mt-sm">No FAQs found</div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 600px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-primary">
            {{ isEdit ? 'Edit FAQ' : 'Add FAQ' }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="saveFAQ" class="q-gutter-md">
            <q-input v-model="form.question" label="Question" outlined dense required />

            <q-input
              v-model="form.answer"
              label="Answer"
              type="textarea"
              outlined
              dense
              required
              autogrow
            />

            <!-- Category Select (select or add new) -->
            <q-select
              v-model="form.category"
              :options="categoryOptions"
              label="Category"
              outlined
              dense
              use-input
              clearable
              hide-dropdown-icon
              @new-value="addNewCategory"
              hint="Select existing or type to add new"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Press Enter to add new category
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveFAQ" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const faqs = ref([])
const loading = ref(false)
const filter = ref('')
const selectedCategory = ref(null)

const showDialog = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = ref({
  question: '',
  answer: '',
  category: '',
})

// 🔹 Category options (derived, no hardcoding)
const categoryOptions = computed(() => {
  return [...new Set(faqs.value.map((f) => f.category).filter(Boolean))]
})
const addNewCategory = (val) => {
  if (!val) return;

  const newCategory = val.trim();

  if (!newCategory) return;

  // prevent duplicates (case-insensitive)
  const exists = categoryOptions.value.some(
    c => c.toLowerCase() === newCategory.toLowerCase()
  );

  if (!exists) {
    // locally add for immediate UX feedback
    faqs.value.push({ category: newCategory });
  }

  // set model value explicitly
  form.value.category = newCategory;
};
const normalizeCategory = (cat) =>
  cat
    ?.trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());

form.value.category = normalizeCategory(form.value.category);


// 🔹 Combined filtering (category + search)
const filteredFAQs = computed(() => {
  let list = faqs.value

  if (selectedCategory.value) {
    list = list.filter((f) => f.category === selectedCategory.value)
  }

  if (filter.value) {
    const term = filter.value.toLowerCase()
    list = list.filter(
      (f) =>
        f.question.toLowerCase().includes(term) ||
        f.answer.toLowerCase().includes(term) ||
        f.category?.toLowerCase().includes(term),
    )
  }

  return list
})

// ✅ Fetch FAQs
const fetchFAQs = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin-api/faqs')
    faqs.value = res.data.faqs || []
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to fetch FAQs',
    })
  } finally {
    loading.value = false
  }
}

// ✅ View FAQ
const viewFAQ = (faq) => {
  $q.dialog({
    title: faq.question,
    message: `
      <b>Answer:</b> ${faq.answer}<br/>
      <b>Category:</b> ${faq.category || '—'}<br/>
      <b>Created At:</b> ${new Date(faq.createdAt).toLocaleString()}
    `,
    html: true,
  })
}

// ✅ Add / Edit Dialog
const openAddDialog = () => {
  isEdit.value = false
  currentId.value = null
  form.value = { question: '', answer: '', category: '' }
  showDialog.value = true
}

const openEditDialog = (faq) => {
  isEdit.value = true
  currentId.value = faq._id
  form.value = { question: faq.question, answer: faq.answer, category: faq.category }
  showDialog.value = true
}

// ✅ Save FAQ
const saveFAQ = async () => {
  try {
    if (isEdit.value && currentId.value) {
      await api.put(`https://staging2.egovmz.in/admin-api/faqs/${currentId.value}`, form.value)
      $q.notify({ type: 'positive', message: 'FAQ updated successfully' })
    } else {
      await api.post('https://staging2.egovmz.in/admin-api/faqs', form.value)
      $q.notify({ type: 'positive', message: 'FAQ created successfully' })
    }
    showDialog.value = false
    fetchFAQs()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Operation failed',
    })
  }
}

// ✅ Delete FAQ
const deleteFAQ = async (id) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this FAQ?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`https://staging2.egovmz.in/admin-api/faqs/${id}`)
      $q.notify({ type: 'positive', message: 'FAQ deleted successfully' })
      fetchFAQs()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Failed to delete FAQ',
      })
    }
  })
}

onMounted(fetchFAQs)
</script>

<style lang="sass">
.faq-card
  transition: all 0.2s ease
  min-height: 220px
  display: flex
  flex-direction: column
  justify-content: space-between
  &:hover
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
    transform: translateY(-3px)

.ellipsis-2-lines
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical

.ellipsis-3-lines
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 3
  -webkit-box-orient: vertical
</style>

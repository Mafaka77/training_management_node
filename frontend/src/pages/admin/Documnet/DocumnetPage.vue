<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-primary">📂 Document Management</div>

      <div class="row items-center q-gutter-sm">
        <q-input v-model="search" outlined dense debounce="400" placeholder="Search documents..."
          @update:model-value="fetchDocuments">
          <template #append><q-icon name="search" /></template>
        </q-input>

        <q-btn color="primary" icon="add" label="Add Document" unelevated @click="openAddDialog" />
      </div>
    </div>

    <!-- Card Grid -->
    <div class="row q-col-gutter-md">
      <div v-for="doc in filteredDocuments" :key="doc._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="shadow-2 hover:shadow-4 transition-all cursor-pointer" @click="openInNewTab(doc.fileUrl)">
          <q-img v-if="isImage(doc.fileType)" :src="getFileUrl(doc.fileUrl)" ratio="1" spinner-color="primary"
            class="rounded-t-borders" />
          <div v-else class="pdf-thumb flex flex-center bg-grey-2" style="height: 180px">
            <q-icon name="picture_as_pdf" color="red" size="64px" />
          </div>

          <q-card-section>
            <div class="text-subtitle1 ellipsis">{{ doc.title }}</div>
            <div class="text-caption text-grey-7 ellipsis">{{ doc.description }}</div>
            <div class="text-caption text-grey q-mt-xs">
              🕒 {{ new Date(doc.createdAt).toLocaleDateString() }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <!-- {{ doc }} -->
            <q-btn flat dense icon="visibility" color="primary" @click.stop="openInNewTab(doc.fileUrl)" />
            <q-btn flat dense icon="edit" color="blue" @click.stop="editDocument(doc)" />
            <q-btn flat dense icon="delete" color="negative" @click.stop="confirmDelete(doc._id)" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="!filteredDocuments.length" class="col-12 text-center q-mt-xl">
        <q-icon name="inbox" size="64px" color="grey-5" />
        <div class="text-grey q-mt-sm">No documents found</div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="maxPages > 1" class="q-pa-md flex flex-center">
      <q-pagination v-model="currentPage" :max="maxPages" @update:model-value="fetchDocuments" color="primary"
        direction-links />
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
  <q-card style="min-width: 400px;">
    <q-card-section>
      <div class="text-h6">{{ editingDoc ? "Edit Document" : "Add New Document" }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit.prevent="submitForm" class="q-gutter-md">
        <q-input
          v-model="form.title"
          label="Document Title"
          outlined
          dense
          :rules="[val => !!val || 'Required']"
        />
        <q-input
          v-model="form.description"
          label="Description"
          outlined
          dense
          type="textarea"
        />

        <!-- ✅ Replace uploader with q-file -->
        <q-file
          v-model="form.file"
          label="Select Document"
          outlined
          dense
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          use-chips
          counter
        >
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <div class="row justify-end q-gutter-sm">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Save" color="primary" type="submit" :loading="saving" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</q-dialog>


    <!-- File Preview Dialog -->
    <q-dialog v-model="previewDialog" maximized>
      <q-card class="bg-white">
        <q-bar>
          <div class="text-h6">{{ previewDoc?.title }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="q-pa-none">
          <!-- Preview PDF -->
          <iframe v-if="previewDoc && previewDoc.fileType.includes('pdf')" :src="getFileUrl(previewDoc.fileUrl)"
            width="100%" height="90vh" frameborder="0"></iframe>

          <!-- Preview Image -->
          <q-img v-else-if="isImage(previewDoc?.fileType)" :src="getFileUrl(previewDoc.fileUrl)" fit="contain"
            class="bg-grey-2" style="height: 90vh" />

          <!-- Fallback -->
          <div v-else class="text-center q-pa-xl text-grey">
            <q-icon name="insert_drive_file" size="64px" />
            <div class="q-mt-sm">Preview not available for this file type</div>
            <q-btn color="primary" flat label="Open File" class="q-mt-md" :href="getFileUrl(previewDoc.fileUrl)"
              target="_blank" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const documents = ref([]);
const search = ref("");
const currentPage = ref(1);
const rowsPerPage = 8;
const total = ref(0);
const showDialog = ref(false);
const previewDialog = ref(false);
const editingDoc = ref(null);
const previewDoc = ref(null);
const form = ref({ title: "", description: "", file: null });
// const uploader = ref(null);
const saving = ref(false);

const maxPages = computed(() => Math.ceil(total.value / rowsPerPage));
const filteredDocuments = computed(() =>
  !search.value
    ? documents.value
    : documents.value.filter(d => d.title.toLowerCase().includes(search.value.toLowerCase()))
);

// const getFileUrl = (path) => path.startsWith("http") ? path : `${window.location.origin}${path}`;
const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // ✅ prepend correct domain
  return `https://staging2.egovmz.in${path}`;
};
console.log("Preview URL:", getFileUrl(documents.value[0]?.fileUrl));



const isImage = (type) => /(jpg|jpeg|png|gif)$/i.test(type);

const fetchDocuments = async () => {
  try {
    const res = await api.get(`/api/documents?page=${currentPage.value}&limit=${rowsPerPage}&search=${search.value}`);
    documents.value = res.data.documents || [];
    total.value = res.data.pagination?.total || 0;
    console.log("Fetched documents:", res.data.documents);
  } catch (err) {
    console.error(err);
    $q.notify({ type: "negative", message: "Failed to fetch documents" });
  }
};


// const onFileAdded = (files) => {
//   form.value.file = files[0];
// };

const openAddDialog = () => {
  editingDoc.value = null;
  form.value = { title: "", description: "", file: null };
  showDialog.value = true;
};

const editDocument = (doc) => {
  editingDoc.value = doc;
  form.value = { title: doc.title, description: doc.description, file: null };
  showDialog.value = true;
};

const submitForm = async () => {
  saving.value = true;
  const fd = new FormData();
  fd.append("title", form.value.title);
  fd.append("description", form.value.description);

  // ✅ Your API expects key "documents" not "file"
  if (form.value.file) fd.append("documents", form.value.file);

  try {
    const url = editingDoc.value
      ? `/admin/api/document/${editingDoc.value._id}`
      : "/admin/api/documents";
    const method = editingDoc.value ? "put" : "post";

    const res = await api[method](url, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    $q.notify({
      type: "positive",
      message: "✅ Document saved successfully",res
    });
    showDialog.value = false;
    fetchDocuments();
  } catch (err) {
    console.error(err);
    $q.notify({
      type: "negative",
      message: "❌ Failed to upload document",
    });
  } finally {
    saving.value = false;
  }
};


const confirmDelete = (id) => {
  $q.dialog({
    title: "Confirm Delete",
    message: "Are you sure you want to delete this document?",
    cancel: true,
    persistent: true,
  }).onOk(() => deleteDocument(id));
};

const deleteDocument = async (id) => {
  try {
    await api.delete(`/admin/api/document/${id}`);
    $q.notify({ type: "positive", message: "Document deleted" });
    fetchDocuments();
  } catch (err) {
    console.error(err);
    $q.notify({ type: "negative", message: "Failed to delete" });
  }
};


const openInNewTab = (fileUrl) => {
  if (!fileUrl) return;
  const url = fileUrl.startsWith("http")
    ? fileUrl
    : `https://staging2.egovmz.in${fileUrl}`;
  window.open(url, "_blank");
};
onMounted(fetchDocuments);
</script>

<style scoped>
.hover\:shadow-4:hover {
  box-shadow: var(--q-shadow-4);
}

.pdf-thumb {
  border-bottom: 1px solid #ddd;
}
</style>

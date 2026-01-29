<template>
  <q-page class="q-pa-md bg-grey-1">

    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Support Tickets</div>
      <q-btn color="primary" label="Raise New Ticket" icon="add_circle" @click="showNewTicketDialog = true" />
    </div>

    <!-- Tickets List -->
    <div v-if="tickets.length" class="row q-col-gutter-md">
      <div v-for="ticket in tickets" :key="ticket._id" class="col-12 col-md-6">
        <q-card flat bordered class="ticket-card hover-scale q-mb-md" @click="viewTicket(ticket)">
          
          <!-- Card Header -->
          <div class="ticket-header flex items-center justify-between q-pa-sm bg-primary text-white rounded-top">
            <div class="text-h6 ellipsis">{{ ticket.subject }}</div>
            <q-badge :color="statusColor(ticket.status)" class="text-white">{{ ticket.status }}</q-badge>
          </div>

          <!-- Card Body -->
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey">Category: {{ selectedTicket?.category }}</div>
            <div class="text-caption text-grey">Priority: {{ selectedTicket?.priority }}</div>
            <div class="text-caption text-grey">Created At: {{ formatDate(ticket?.createdAt) }}</div>
            <p class="text-body2 ellipsis-2-lines q-mt-sm">{{ ticket?.description }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <q-banner v-else class="bg-grey-3 text-center q-pa-xl">
      <q-icon name="support_agent" size="64px" color="grey-5" />
      <div class="text-h6 q-mt-md">No tickets found</div>
      <div class="text-subtitle2">Click "Raise New Ticket" to create one.</div>
    </q-banner>

    <!-- Raise Ticket Dialog -->
    <q-dialog v-model="showNewTicketDialog" persistent>
      <q-card style="max-width: 500px; width: 100%" class="rounded-borders shadow-2">
        <q-card-section class="bg-primary text-white text-h6 rounded-top">Raise a New Ticket</q-card-section>
        <q-card-section class="q-pa-md">
          <q-input v-model="newTicket.subject" label="Subject" outlined dense class="q-mb-sm" />
          <q-input v-model="newTicket.description" label="Description" type="textarea" outlined dense class="q-mb-sm" />
          <q-select v-model="newTicket.category" :options="categories" label="Category" outlined dense class="q-mb-sm" />
          <q-select v-model="newTicket.priority" :options="priorities" label="Priority" outlined dense />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Submit" :loading="loading" @click="raiseTicket" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Ticket Details Dialog -->
    <q-dialog v-model="showTicketDialog">
      <q-card style="max-width: 700px; width: 100%" class="rounded-borders shadow-2">
        <!-- Header Banner -->
        <div class="ticket-banner bg-primary text-white flex items-center q-pa-md">
          <div class="text-h6">{{ selectedTicket?.subject }}</div>
          <q-space />
          <q-badge :color="statusColor(selectedTicket?.status)" class="text-white">{{ selectedTicket?.status }}</q-badge>
        </div>

        <q-card-section class="scroll q-pa-md" style="max-height: 70vh; overflow-y: auto;">
          <!-- Ticket Info -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6"><strong>Category:</strong> {{ selectedTicket?.category }}</div>
            <div class="col-6"><strong>Priority:</strong> {{ selectedTicket?.priority }}</div>
          </div>
          <div class="q-mb-md"><strong>Description:</strong> <p class="text-body2 q-mt-sm">{{ selectedTicket?.description }}</p></div>

          <!-- Replies -->
          <div class="text-subtitle2 q-mb-sm">Replies</div>
          <div v-if="selectedTicket?.replies?.length">
            <div v-for="(reply, idx) in selectedTicket.replies" :key="idx" class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders shadow-1">
              <div class="text-caption text-grey">{{ reply.user?.email || reply.sender?.email || 'Unknown' }} • {{ formatDate(reply.createdAt) }}</div>
              <div>{{ reply.message }}</div>
            </div>
          </div>
          <div v-else class="text-grey q-mb-sm">No replies yet.</div>

          <!-- Add Reply -->
          <div class="text-subtitle2 q-mt-md q-mb-sm">Add Reply</div>
          <q-input v-model="replyMessage" type="textarea" outlined placeholder="Type your reply..." autogrow dense />
          <div class="text-right q-mt-sm">
            <q-btn color="primary" label="Send" icon="send" :loading="replying" :disable="!replyMessage.trim()" @click="sendReply" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { date, Notify } from 'quasar'

const tickets = ref([])
const showNewTicketDialog = ref(false)
const showTicketDialog = ref(false)
const selectedTicket = ref(null)
const loading = ref(false)
const replying = ref(false)
const replyMessage = ref('')

const newTicket = ref({ subject: '', description: '', category: 'Technical', priority: 'Low' })
const categories = ['Technical', 'General', 'Billing', 'Account']
const priorities = ['Low', 'Medium', 'High']



// Fetch all tickets
const fetchTickets = async () => {
  try {
    const res = await api.get('/api/tickets')
    tickets.value = res.data.tickets || []
  } catch (err) {
    console.error('Failed to fetch tickets:', err)
    Notify.create({ type: 'negative', message: 'Failed to fetch tickets.' })
  }
}

// Fetch single ticket details
const viewTicket = async (row) => {
  if (!row?._id) {
    Notify.create({ type: 'negative', message: 'Ticket ID not found' })
    return
  }
  try {
    const res = await api.get(`/api/tickets/${row._id}`)
    selectedTicket.value = res.data.ticket
    showTicketDialog.value = true
  } catch (err) {
    console.error('Failed to fetch ticket:', err)
    Notify.create({ type: 'negative', message: 'Failed to fetch ticket.' })
  }
}

// Raise new ticket
const raiseTicket = async () => {
  if (!newTicket.value.subject || !newTicket.value.description) {
    Notify.create({ type: 'warning', message: 'Please fill all required fields.' })
    return
  }
  loading.value = true
  try {
    await api.post('/api/tickets', newTicket.value)
    Notify.create({ type: 'positive', message: 'Ticket raised successfully.' })
    showNewTicketDialog.value = false
    newTicket.value = { subject: '', description: '', category: 'Technical', priority: 'Low' }
    fetchTickets()
  } catch (err) {
    console.error('Failed to raise ticket:', err)
    Notify.create({ type: 'negative', message: 'Failed to raise ticket.' })
  } finally {
    loading.value = false
  }
}

// Send reply
const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedTicket.value?._id) return
  replying.value = true
  try {
    const res = await api.post(`/api/ticket/${selectedTicket.value._id}/reply`, { message: replyMessage.value })
    selectedTicket.value = res.data.ticket
    replyMessage.value = ''
    Notify.create({ type: 'positive', message: 'Reply sent successfully.' })
  } catch (err) {
    console.error('Failed to send reply:', err)
    Notify.create({ type: 'negative', message: 'Failed to send reply.' })
  } finally {
    replying.value = false
  }
}

// Helpers
const statusColor = (status) => ({ Open: 'orange', Closed: 'grey', Resolved: 'green' }[status] || 'blue')
const formatDate = (d) => date.formatDate(d, 'DD MMM YYYY, hh:mm A')

onMounted(fetchTickets)
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<style scoped>
.ticket-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.ticket-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.banner-image {
  height: 120px;
  object-fit: cover;
}

.banner-fallback {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-header {
  font-weight: 600;
}

.ticket-banner {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scroll::-webkit-scrollbar {
  width: 6px;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 3px;
}
</style>
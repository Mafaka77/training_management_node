<template>
  <q-page class="q-pa-md">

    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold text-primary">All Support Tickets</div>
    </div>

    <!-- Search -->
    <q-input
      dense
      outlined
      debounce="300"
      v-model="filter"
      placeholder="Search by subject, user, or status..."
      class="q-mb-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- Tickets Card Grid -->
    <div class="row q-col-gutter-md">
      <div
        v-for="ticket in filteredTickets"
        :key="ticket._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card flat bordered class="ticket-card cursor-pointer" @click="viewTicket(ticket)">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle1 text-weight-medium ellipsis-2-lines">{{ ticket.subject }}</div>
              <q-badge :color="statusColor(ticket.status)" class="text-white">
                {{ ticket.status }}
              </q-badge>
            </div>
            <div class="text-caption text-grey q-mt-xs">
              {{ ticket.user?.email || 'Unknown user' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="text-grey-8 text-body2 ellipsis-3-lines">
            {{ ticket.description || 'No description provided.' }}
          </q-card-section>

          <q-separator />

          <q-card-section class="text-caption text-right text-grey">
            {{ formatDate(ticket.createdAt) }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredTickets.length && !loading" class="text-center q-mt-xl text-grey">
      <q-icon name="support_agent" size="56px" color="grey-5" />
      <div class="text-subtitle1 q-mt-sm">No tickets found</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-my-lg">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Ticket Dialog -->
    <q-dialog v-model="showTicketDialog" persistent>
      <q-card style="max-width: 700px; width: 100%">
        <q-card-section class="text-h6 text-primary">
          {{ selectedTicket?.subject }}
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div><strong>User:</strong> {{ selectedTicket?.user?.email || 'Unknown' }}</div>
          <div><strong>Category:</strong> {{ selectedTicket?.category || '-' }}</div>
          <div><strong>Priority:</strong> {{ selectedTicket?.priority || '-' }}</div>
          <div>
            <strong>Status:</strong>
            <q-badge :color="statusColor(selectedTicket?.status)" class="text-white q-ml-xs">
              {{ selectedTicket?.status }}
            </q-badge>
          </div>

          <div class="q-mt-sm"><strong>Description:</strong></div>
          <div class="text-body2 q-ml-sm">{{ selectedTicket?.description }}</div>

          <q-separator class="q-my-md" />

          <!-- Replies -->
          <div class="text-subtitle2">Replies</div>
          <div v-if="selectedTicket?.replies?.length">
            <div
              v-for="(reply, idx) in selectedTicket.replies"
              :key="idx"
              class="q-pa-sm bg-grey-2 q-mt-sm rounded-borders"
            >
              <div class="text-caption text-grey">
                {{ reply.user?.email || reply.sender?.email || 'Admin' }}
                • {{ formatDate(reply.createdAt) }}
              </div>
              <div>{{ reply.message }}</div>
            </div>
          </div>
          <div v-else class="text-grey q-mt-sm">No replies yet.</div>

          <q-separator class="q-my-md" />

          <!-- Status Update -->
          <div class="text-subtitle2 q-mb-sm">Change Status</div>
          <div class="row q-mb-md">
            <q-btn dense color="orange" label="Open" @click="changeStatus('Open')" class="q-mr-sm" />
            <q-btn dense color="blue" label="In Progress" @click="changeStatus('In Progress')" class="q-mr-sm" />
            <q-btn dense color="grey" label="Closed" @click="changeStatus('Closed')" />
          </div>

          <!-- Reply Section -->
          <div class="text-subtitle2 q-mb-sm">Add Reply</div>
          <q-input
            v-model="replyMessage"
            type="textarea"
            outlined
            placeholder="Type your reply..."
            autogrow
            dense
          />
          <div class="text-right q-mt-sm">
            <q-btn
              color="primary"
              label="Send"
              icon="send"
              :loading="replying"
              :disable="!replyMessage.trim()"
              @click="sendReply"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup @click="resetSelectedTicket" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { date, Notify } from 'quasar'

const tickets = ref([])
const loading = ref(false)
const filter = ref('')
const showTicketDialog = ref(false)
const selectedTicket = ref(null)
const replying = ref(false)
const replyMessage = ref('')

// Fetch Tickets
const fetchTickets = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin-api/tickets?page=1&limit=50')
    tickets.value = res.data.tickets || []
  } catch (err) {
    console.error('Failed to fetch tickets:', err)
    Notify.create({ type: 'negative', message: 'Failed to fetch tickets.' })
  } finally {
    loading.value = false
  }
}

// Filtered Tickets
const filteredTickets = computed(() => {
  if (!filter.value) return tickets.value
  const term = filter.value.toLowerCase()
  return tickets.value.filter(
    t =>
      t.subject.toLowerCase().includes(term) ||
      t.status.toLowerCase().includes(term) ||
      t.user?.email?.toLowerCase().includes(term)
  )
})

// View Ticket
const viewTicket = async (ticket) => {
  try {
    const res = await api.get(`/admin-api/tickets/${ticket._id}`)
    selectedTicket.value = res.data.ticket
    showTicketDialog.value = true
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Failed to fetch ticket.',err })
  }
}

// Send Reply
const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedTicket.value?._id) return
  replying.value = true
  try {
    const res = await api.post(`/admin/tickets/${selectedTicket.value._id}/replies`, { message: replyMessage.value })
    selectedTicket.value = res.data.ticket
    replyMessage.value = ''
    Notify.create({ type: 'positive', message: 'Reply sent successfully.' })
    fetchTickets()
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to send reply.' })
  } finally {
    replying.value = false
  }
}

// Change Status
const changeStatus = async (status) => {
  if (!selectedTicket.value?._id) return
  try {
    const res = await api.patch(`/admin/tickets/${selectedTicket.value._id}/status`, { status })
    selectedTicket.value = res.data.ticket
    Notify.create({ type: 'positive', message: 'Ticket status updated.' })
    fetchTickets()
  } catch {
    Notify.create({ type: 'negative', message: 'Failed to update status.' })
  }
}

// Helpers
const statusColor = (status) => ({ Open: 'orange', 'In Progress': 'blue', Closed: 'grey' }[status] || 'blue')
const formatDate = (d) => date.formatDate(d, 'DD MMM YYYY, hh:mm A')
const resetSelectedTicket = () => {
  selectedTicket.value = null
  replyMessage.value = ''
}

onMounted(fetchTickets)
</script>

<style scoped lang="sass">
.ticket-card
  transition: all 0.2s ease
  min-height: 180px
  &:hover
    transform: translateY(-3px)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

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

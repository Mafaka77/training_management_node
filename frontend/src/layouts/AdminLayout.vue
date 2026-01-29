<!--<template>-->
<!--  <q-layout view="lHh Lpr lFf">-->
<!--    &lt;!&ndash; Header &ndash;&gt;-->
<!--    <q-header elevated class="bg-primary text-white">-->
<!--      <q-toolbar>-->
<!--        <q-chip>-->
<!--        <q-avatar>-->
<!--          <img src="https://cdn.quasar.dev/img/boy-avatar.png">-->
<!--        </q-avatar>-->
<!--        John-->
<!--      </q-chip>-->
<!--        <q-toolbar-title>Admin Dashboard</q-toolbar-title>-->
<!--        <q-btn flat dense icon="logout" @click="logout" />-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    &lt;!&ndash; Drawer (Sidebar) &ndash;&gt;-->
<!--    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>-->
<!--      <q-list>-->
<!--        &lt;!&ndash; Dashboard &ndash;&gt;-->
<!--        <q-item clickable v-ripple to="/admin/dashboard">-->
<!--          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>-->
<!--          <q-item-section>Dashboard</q-item-section>-->
<!--        </q-item>-->



<!--        &lt;!&ndash; Dropdown / Collapsible &ndash;&gt;-->
<!--        <q-expansion-item-->
<!--          icon="folder"-->
<!--          label="More Pages"-->
<!--          expand-separator-->
<!--        >-->
<!--          <q-item clickable v-ripple to="/admin/text1">-->
<!--            <q-item-section avatar><q-icon name="description" /></q-item-section>-->
<!--            <q-item-section>Text1</q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable v-ripple to="/admin/text2">-->
<!--            <q-item-section avatar><q-icon name="description" /></q-item-section>-->
<!--            <q-item-section>Text2</q-item-section>-->
<!--          </q-item>-->

<!--          <q-item clickable v-ripple to="/admin/text3">-->
<!--            <q-item-section avatar><q-icon name="description" /></q-item-section>-->
<!--            <q-item-section>Text3</q-item-section>-->
<!--          </q-item>-->
<!--        </q-expansion-item>-->
<!--        &lt;!&ndash; Users &ndash;&gt;-->
<!--        <q-item clickable v-ripple to="/admin/users">-->
<!--          <q-item-section avatar><q-icon name="group" /></q-item-section>-->
<!--          <q-item-section>Users</q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable v-ripple to="/admin/users">-->
<!--          <q-item-section avatar><q-icon name="group" /></q-item-section>-->
<!--          <q-item-section>Users</q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable v-ripple to="/admin/users">-->
<!--          <q-item-section avatar><q-icon name="group" /></q-item-section>-->
<!--          <q-item-section>Users</q-item-section>-->
<!--        </q-item>-->
<!--      </q-list>-->
<!--    </q-drawer>-->

<!--    &lt;!&ndash; Main content &ndash;&gt;-->
<!--    <q-page-container>-->
<!--      <router-view />-->
<!--    </q-page-container>-->
<!--  </q-layout>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref } from 'vue'-->
<!--import { useAdminAuth } from 'src/stores/adminAuth'-->
<!--import { useRouter } from 'vue-router'-->

<!--const leftDrawerOpen = ref(true)-->
<!--const auth = useAdminAuth()-->
<!--const router = useRouter()-->

<!--function logout() {-->
<!--  auth.logout()-->
<!--  router.push('/admin/login')-->
<!--}-->
<!--</script>-->
<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Sidebar Toggle -->
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <!-- Logo + Title -->
        <!-- <q-toolbar-title >
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          ATI Admin
        </q-toolbar-title> -->
        <q-toolbar-title>
          <q-icon name="admin_panel_settings" size="32px" class="q-mr-sm" />
          ATI Admin
        </q-toolbar-title>

        <!-- Global Search -->
        <q-input dense standout="bg-white text-black" v-model="search" placeholder="Search..." class="q-mx-md"
          @keyup.enter="performSearch">
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="performSearch" />
          </template>
        </q-input>

        <q-space />

        <!-- Notifications -->
        <q-btn dense flat round icon="notifications">
          <q-badge v-if="notifications.length > 0" color="red" floating>{{ notifications.length }}</q-badge>
          <q-menu>
            <q-list style="min-width: 250px">
              <q-item v-for="n in notifications" :key="n.id" clickable>
                <q-item-section>{{ n.message }}</q-item-section>
                <q-item-section side caption>{{ n.time }}</q-item-section>
              </q-item>

              <q-item v-if="notifications.length === 0">
                <q-item-section>No new notifications</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-ripple @click="clearNotifications">
                <q-item-section class="text-center text-negative">
                  Clear All
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>


        <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="yellow"
          keep-color
          @update:model-value="toggleDarkMode"
        />

        <!-- Quick Settings -->
        <q-btn dense flat round icon="settings">
          <q-menu>
            <q-list>
              
              <q-item clickable v-ripple to="/admin/system-config">
                <q-item-section>System Config</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- User Profile -->
        <q-avatar size="32px" class="cursor-pointer">
          <template v-if="userStore.avatar">
            <img :src="userStore.avatar" />
          </template>
          <template v-else>
            <q-icon name="account_circle" size="28px" />
          </template>

          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-ripple to="/admin/profile">
                <q-item-section>My Profile</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/admin/settings">
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple @click="confirmLogout">
                <q-item-section class="text-negative">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>

      </q-toolbar>
    </q-header>

    <!-- Drawer (Sidebar) -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <!-- User Info -->
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <template v-if="userStore.avatar">
                <img :src="userStore.avatar" />
              </template>
              <template v-else>
                <q-icon name="account_circle" size="28px" />
              </template>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ userStore.name }}</q-item-label>
            <q-item-label caption class="text-grey">{{ userStore.role }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item clickable v-ripple to="/admin/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <!-- Dropdown / Collapsible -->
        <q-expansion-item icon="manage_accounts" label="Training" expand-separator>
          <q-item clickable v-ripple to="/admin/training">
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section>Manage Training Programme</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/training-course">
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section>Manage Training Course</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/trainer">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Manage Trainers</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Users -->
        <q-item clickable v-ripple to="/admin/trainee">
          <q-item-section avatar><q-icon name="school" /></q-item-section>
          <q-item-section>Trainee</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/enrollment">
          <q-item-section avatar><q-icon name="how_to_reg" /></q-item-section>
          <q-item-section>Enrollment</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/user">
          <q-item-section avatar><q-icon name="group" /></q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>

        <!-- Master Data -->
        <q-expansion-item icon="list" label="MasterData" expand-separator>
          <q-item clickable v-ripple to="/admin/department">
            <q-item-section avatar><q-icon name="business" /></q-item-section>
            <q-item-section>Department</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/room">
            <q-item-section avatar><q-icon name="meeting_room" /></q-item-section>
            <q-item-section>Room</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/category">
            <q-item-section avatar><q-icon name="category" /></q-item-section>
            <q-item-section>Category</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/doc">
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section>Document</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/faqs">
            <q-item-section avatar><q-icon name="help" /></q-item-section>
            <q-item-section>FAQs</q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item clickable v-ripple to="/admin/tickets">
          <q-item-section avatar><q-icon name="help" /></q-item-section>
          <q-item-section>Tickets</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "src/stores/user"
import { Dark, Dialog } from "quasar"
import { api } from "boot/axios"

const router = useRouter()
const userStore = useUserStore()

const leftDrawerOpen = ref(false)
const search = ref("")
const notifications = ref([])
// dark mode state
const darkMode = ref(Dark.isActive)

// Toggle drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Search function
const performSearch = async () => {
  if (!search.value) return
  try {
    const res = await api.get("/admin/search", {
      params: { q: search.value }
    })
    console.log("Search Results:", res.data)
    // Navigate to search results page if you have one
    router.push({ path: "/admin/search", query: { q: search.value } })
  } catch (err) {
    console.error("Search error:", err)
  }
}

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const res = await api.get("/admin/notifications")
    notifications.value = res.data || []
  } catch (err) {
    console.error("Failed to load notifications:", err)
  }
}

// Clear notifications
const clearNotifications = () => {
  notifications.value = []
}

// Dark mode toggle (with persistence)
const toggleDarkMode = (val) => {
  Dark.set(val)
  localStorage.setItem("darkMode", val ? "1" : "0")
}
// Restore dark mode preference on load
onMounted(() => {
  
  fetchNotifications()
})

// Confirm logout
const confirmLogout = () => {
  Dialog.create({
    title: "Confirm Logout",
    message: "Are you sure you want to log out?",
    cancel: true,
    persistent: true
  }).onOk(() => {
    userStore.logout()
    router.push("/")
  })
}
</script>

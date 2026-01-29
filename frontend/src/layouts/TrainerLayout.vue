<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Sidebar Toggle -->
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <!-- Logo + Title -->
        <q-toolbar-title>
          <q-icon name="school" size="32px" class="q-mr-sm" />
          Trainer Panel
        </q-toolbar-title>

        <!-- Global Search -->
        <q-input
          dense
          standout="bg-white text-black"
          v-model="search"
          placeholder="Search..."
          class="q-mx-md"
          @keyup.enter="performSearch"
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="performSearch" />
          </template>
        </q-input>

        <q-space />

        <!-- Notifications -->
        <q-btn dense flat round icon="notifications">
          <q-badge v-if="notifications.length > 0" color="red" floating>
            {{ notifications.length }}
          </q-badge>
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

        <!-- Dark Mode Toggle -->
        <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="yellow"
          keep-color
          @update:model-value="toggleDarkMode"
        />

        <!-- User Profile -->
        <q-avatar size="32px" class="cursor-pointer">
          <template v-if="userStore.profilePic">
            <img :src="userStore.profilePic" alt="Trainer Avatar" />
          </template>
          <template v-else>
            <q-icon name="account_circle" size="28px" />
          </template>

          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-ripple to="/trainer/profile">
                <q-item-section>My Profile</q-item-section>
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

    <!-- Sidebar -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <!-- Profile -->
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <template v-if="userStore.profilePic">
                <img :src="userStore.profilePic" alt="Trainer Avatar" />
              </template>
              <template v-else>
                <q-icon name="person" size="md" />
              </template>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ userStore.name }}</q-item-label>
            <q-item-label caption class="text-grey">Trainer</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <!-- Menu -->
        <q-item clickable v-ripple to="/trainer/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>My Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/trainer/trainings">
          <q-item-section avatar><q-icon name="school" /></q-item-section>
          <q-item-section>My Trainings</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/trainer/proficiency">
          <q-item-section avatar><q-icon name="star_rate" /></q-item-section>
          <q-item-section>Proficiency</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/trainer/materials">
          <q-item-section avatar><q-icon name="upload_file" /></q-item-section>
          <q-item-section>Upload Materials</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main content -->
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

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Search function
const performSearch = async () => {
  if (!search.value) return
  try {
    const res = await api.get("/trainer/search", {
      params: { q: search.value }
    })
    console.log("Search Results:", res.data)
    router.push({ path: "/trainer/search", query: { q: search.value } })
  } catch (err) {
    console.error("Search error:", err)
  }
}

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const res = await api.get("/trainer/notifications")
    notifications.value = res.data || []
  } catch (err) {
    console.error("Failed to load notifications:", err)
  }
}

// Clear notifications
const clearNotifications = () => {
  notifications.value = []
}

// Dark mode toggle
const toggleDarkMode = (val) => {
  Dark.set(val)
  localStorage.setItem("darkMode", val ? "1" : "0")
}

// Restore dark mode preference
onMounted(() => {
  const saved = localStorage.getItem("darkMode")
  if (saved) {
    const isDark = saved === "1"
    darkMode.value = isDark
    Dark.set(isDark)
  }
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
    router.push("/login")
  })
}
</script>

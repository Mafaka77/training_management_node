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
                    Trainee Panel
                </q-toolbar-title>
                <!-- Global Search -->
                <q-input
                    dense
                    standout="bg-white text-black"
                    v-model="search"
                    placeholder="Search trainings..."
                    class="q-mx-md"
                    @keyup.enter="performSearch"
                >
                    <template v-slot:append>
                        <q-icon name="search" class="cursor-pointer" @click="performSearch" />
                    </template>
                </q-input>
                <q-space />
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
                        <img :src="userStore.profilePic" alt="Trainee Avatar" />
                    </template>
                    <template v-else>
                        <q-icon name="account_circle" size="28px" />
                    </template>
                    <q-menu>
                        <q-list style="min-width: 150px">
                            <q-item clickable v-ripple to="/trainee/profile">
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
                                <img :src="userStore.profilePic" alt="Trainee Avatar" />
                            </template>
                            <template v-else>
                                <q-icon name="person" size="md" />
                            </template>
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="text-weight-medium">{{ userStore.name }}</q-item-label>
                        <q-item-label caption class="text-grey">Trainee</q-item-label>
                    </q-item-section>
                </q-item>
                <q-separator spaced />
                <!-- Menu -->
                <q-item clickable v-ripple to="/trainee/dashboard">
                    <q-item-section avatar>
                        <q-icon name="dashboard" />
                    </q-item-section>
                    <q-item-section>Dashboard</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/trainings">
                    <q-item-section avatar>
                        <q-icon name="school" />
                    </q-item-section>
                    <q-item-section>My Trainings</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/enrollments">
                    <q-item-section avatar>
                        <q-icon name="assignment" />
                    </q-item-section>
                    <q-item-section>My Enrollments</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/tickets">
                    <q-item-section avatar>
                        <q-icon name="support_agent" />
                    </q-item-section>
                    <q-item-section>Support Tickets</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/materials">
                    <q-item-section avatar>
                        <q-icon name="menu_book" />
                    </q-item-section>
                    <q-item-section>Study Materials</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/upcoming">
                    <q-item-section avatar>
                        <q-icon name="event" />
                    </q-item-section>
                    <q-item-section>Upcoming Trainings</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/trainee/faq">
                    <q-item-section avatar>
                        <q-icon name="event" />
                    </q-item-section>
                    <q-item-section>FAQ</q-item-section>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { Dark, Dialog } from "quasar";
import { api } from "boot/axios";

const router = useRouter();
const userStore = useUserStore();
const leftDrawerOpen = ref(false);
const search = ref("");
// const notifications = ref([]);

// dark mode state
const darkMode = ref(Dark.isActive);

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Search function (trainee search endpoint)
const performSearch = async () => {
    if (!search.value) return;
    try {
        const res = await api.get("/trainee/search", { params: { q: search.value } });
        console.log("Search Results:", res.data);
        router.push({ path: "/trainee/search", query: { q: search.value } });
    } catch (err) {
        console.error("Search error:", err);
    }
};

// Dark mode toggle
const toggleDarkMode = (val) => {
    Dark.set(val);
    localStorage.setItem("darkMode", val ? "1" : "0");
};

// Restore dark mode preference
onMounted(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) {
        const isDark = saved === "1";
        darkMode.value = isDark;
        Dark.set(isDark);
    }
});

// Confirm logout
const confirmLogout = () => {
    Dialog.create({
        title: "Confirm Logout",
        message: "Are you sure you want to log out?",
        cancel: true,
        persistent: true
    }).onOk(() => {
        userStore.logout();
        router.push("/login");
    });
};
</script>

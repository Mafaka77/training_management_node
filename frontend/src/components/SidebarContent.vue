<template>
  <div class="space-y-6">
    <section>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <SidebarItem v-if="userRole?.some(role => ['Trainer', 'Director'].includes(role))" to="/admin/trainer/dashboard"
          :isDark="isDark" icon="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z">
          Dashboard
        </SidebarItem>

        <SidebarItem v-else to="/admin/dashboard" :isDark="isDark"
          icon="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z">
          Dashboard
        </SidebarItem>
      </nav>
    </section>

    <section>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">TRAINING</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>

      <nav class="space-y-1">
        <SidebarItem v-if="userRole.includes('Trainer')" to="/trainer/trainings" :isDark="isDark"
          icon="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M3 10h18 M9 22V10">
          My Trainings
        </SidebarItem>

        <SidebarItem v-if="userRole?.some(role => ['Admin', 'Director'].includes(role))" to="/admin/training/program"
          :isDark="isDark" icon="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6">
          Programs
        </SidebarItem>

        <SidebarItem v-if="userRole.includes('Admin')" to="/admin/training/enrollments" :isDark="isDark"
          icon="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87">
          Enrollments
        </SidebarItem>
      </nav>
    </section>

    <section v-if="userRole.includes('Admin')">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Users</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <button @click="$emit('update:trainingOpen', !trainingOpen)" :class="buttonClasses">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
              :class="trainingOpen ? 'text-blue-500' : 'opacity-70'" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="font-bold tracking-tight">Manage Users</span>
          </div>
          <svg class="h-3 w-3 transition-transform duration-500"
            :class="trainingOpen ? 'rotate-180 text-blue-500' : 'opacity-40'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <Transition name="expand">
          <div v-if="trainingOpen"
            class="mt-1 ml-4 border-l border-zinc-200 dark:border-white/5 pl-2 space-y-1 overflow-hidden">
            <SidebarItem to="/admin/trainer" :isDark="isDark"
              icon="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z">Trainers</SidebarItem>
            <SidebarItem to="/admin/trainee" :isDark="isDark"
              icon="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z">Trainees
            </SidebarItem>
            <SidebarItem to="/admin/employee" :isDark="isDark"
              icon="M17 21v-2a4 4 0 0 0-3-3.87 M9 21v-2a4 4 0 0 0-3-3.87 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z">Employees
            </SidebarItem>
          </div>
        </Transition>
      </nav>
    </section>

    <section v-if="userRole.includes('Admin')">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Infrastructure</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <button @click="$emit('update:masterOpen', !masterOpen)" :class="buttonClasses">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="masterOpen ? 'text-blue-500' : 'opacity-70'"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span class="font-bold tracking-tight">System Data</span>
          </div>
          <svg class="h-3 w-3 transition-transform duration-500"
            :class="masterOpen ? 'rotate-180 text-blue-500' : 'opacity-40'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <Transition name="expand">
          <div v-if="masterOpen"
            class="mt-1 ml-4 border-l border-zinc-200 dark:border-white/5 pl-2 space-y-1 overflow-hidden">
            <SidebarItem to="/admin/master/room" :isDark="isDark" icon="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
              Rooms</SidebarItem>
            <SidebarItem to="/admin/master/category" :isDark="isDark"
              icon="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z">Categories
            </SidebarItem>
            <SidebarItem to="/admin/master/documents" :isDark="isDark"
              icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z">Documents</SidebarItem>
            <SidebarItem to="/admin/master/faq" :isDark="isDark" icon="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01">
              FAQs</SidebarItem>
            <SidebarItem to="/admin/master/banner" :isDark="isDark"
              icon="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z">Banners</SidebarItem>
          </div>
        </Transition>
      </nav>
    </section>

    <section v-if="userRole.includes('Admin')">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Assistance</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <SidebarItem to="/admin/ticket" :isDark="isDark"
          icon="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2">
          <div class="flex items-center justify-between w-full group/ticket">
            <span>Support Tickets</span>
            <span
              class="bg-blue-500/10 text-blue-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Live</span>
          </div>
        </SidebarItem>
      </nav>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from "../store/authStore.js";
import SidebarItem from './SidebarItem.vue';
const store = useAuthStore();
const props = defineProps({
  trainingOpen: { type: Boolean, default: false },
  masterOpen: { type: Boolean, default: false },
  isDark: Boolean
})

defineEmits(['update:trainingOpen', 'update:masterOpen'])
const userRole = computed(() => {
  const roles = store.roles;

  // 1. If roles is null/undefined, return an empty array
  if (!roles) return [];

  // 2. If roles is already an array, return it
  if (Array.isArray(roles)) return roles;

  // 3. If roles is a single string (like "Admin"), wrap it in an array
  return [roles];
});
const buttonClasses = computed(() => [
  'flex w-full items-center justify-between py-2 px-3 text-left text-sm rounded-xl transition-all duration-300 group',
  props.isDark
    ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
    : 'text-zinc-600 hover:bg-white hover:shadow-md hover:shadow-black/5 hover:text-blue-600'
])
</script>

<style scoped>
.expand-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 400px;
}

.expand-leave-active {
  transition: all 0.3s ease-in;
  max-height: 400px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateX(-10px);
}
</style>
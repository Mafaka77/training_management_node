<template>
  <div v-if="userRole==='Admin'"  class="space-y-6">
    <section>
      <div class="flex items-center gap-2  mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <SidebarItem to="/admin/dashboard" :isDark="isDark" icon="LayoutGrid">
          Dashboard
        </SidebarItem>
      </nav>
    </section>


    <section>
      <div class="flex items-center gap-2  mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">TRAINING</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <SidebarItem to="/admin/training/program" :isDark="isDark" isChild>Programs</SidebarItem>
        <SidebarItem to="/admin/training/enrollments" :isDark="isDark" isChild>Enrollments</SidebarItem>

      </nav>
    </section>


    <section>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Users</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <div>
          <button @click="$emit('update:trainingOpen', !trainingOpen)" :class="buttonClasses">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="trainingOpen ? 'text-blue-500' : 'opacity-70'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="font-bold tracking-tight">Manage Users</span>
            </div>
            <svg class="h-3 w-3 transition-transform duration-500" :class="trainingOpen ? 'rotate-180 text-blue-500' : 'opacity-40'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd" />
            </svg>
          </button>
          <Transition name="expand">
            <div v-if="trainingOpen" class="mt-1 ml-4 border-l border-zinc-200 dark:border-white/5 pl-2 space-y-1 overflow-hidden">
              <SidebarItem to="/admin/trainer" :isDark="isDark" icon="Users">Manage Trainers</SidebarItem>
              <SidebarItem to="/admin/trainee" :isDark="isDark" icon="UserCircle">Manage Trainees</SidebarItem>
              <SidebarItem to="/admin/employee" :isDark="isDark" icon="UserCircle">Manage Employee</SidebarItem>
            </div>
          </Transition>
        </div>
      </nav>
    </section>
    <section>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Infrastructure</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <div>
          <button @click="$emit('update:masterOpen', !masterOpen)" :class="buttonClasses">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="masterOpen ? 'text-blue-500' : 'opacity-70'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <span class="font-bold tracking-tight">System Data</span>
            </div>
            <svg class="h-3 w-3 transition-transform duration-500" :class="masterOpen ? 'rotate-180 text-blue-500' : 'opacity-40'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clip-rule="evenodd" />
            </svg>
          </button>
          <Transition name="expand">
            <div v-if="masterOpen" class="mt-1 ml-4 border-l border-zinc-200 dark:border-white/5 pl-2 space-y-1 overflow-hidden">
              <SidebarItem to="/admin/master/room" :isDark="isDark" isChild icon="Home">Rooms</SidebarItem>
              <SidebarItem to="/admin/master/category" :isDark="isDark" isChild icon="Tag">Categories</SidebarItem>
              <SidebarItem to="/admin/master/documents" :isDark="isDark" isChild icon="FileText">Documents</SidebarItem>
              <SidebarItem to="/admin/master/faq" :isDark="isDark" isChild icon="HelpCircle">FAQs</SidebarItem>
              <SidebarItem to="/admin/master/banner" :isDark="isDark" isChild icon="HelpCircle">Banner</SidebarItem>
            </div>
          </Transition>
        </div>
      </nav>
    </section>
    <section>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Assistance</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <nav class="space-y-1">
        <SidebarItem to="/admin/ticket" :isDark="isDark" icon="Ticket">
          <div class="flex items-center justify-between w-full group/ticket">
            <span>Support Tickets</span>
            <span class="bg-blue-500/10 text-blue-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Live</span>
          </div>
        </SidebarItem>
      </nav>
    </section>
  </div>
  <div v-else>
    <section>
      <div class="flex items-center gap-2 px-3 mb-3">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core</span>
        <div class="h-px flex-1 bg-gradient-to-r from-zinc-500/20 to-transparent"></div>
      </div>
      <div class="flex flex-col gap-4 py-8">
        <nav>
        <SidebarItem to="/trainer/dashboard" :isDark="isDark" icon="LayoutGrid">
          Dashboard
        </SidebarItem>
        </nav>
        <nav>
          <SidebarItem to="/trainer/trainings" :isDark="isDark" icon="LayoutGrid">
            My Trainings
          </SidebarItem>
        </nav>
      </div>

    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SidebarItem from './SidebarItem.vue'
import {useAuthStore} from "../store/authStore.js";
const store=useAuthStore();
const props = defineProps({
  trainingOpen: { type: Boolean, default: false },
  masterOpen: { type: Boolean, default: false },
  isDark: Boolean
})

defineEmits(['update:trainingOpen', 'update:masterOpen'])
const userRole = computed(() => store.role || 'Guest')
console.log(userRole.value);
const buttonClasses = computed(() => [
  'flex w-full items-center justify-between py-2 px-3 text-left text-sm rounded-xl transition-all duration-300 group',
  props.isDark
      ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
      : 'text-zinc-600 hover:bg-white hover:shadow-md hover:shadow-black/5 hover:text-blue-600'
])
</script>

<style scoped>
.expand-enter-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); max-height: 400px; }
.expand-leave-active { transition: all 0.3s ease-in; max-height: 400px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateX(-10px); }
</style>
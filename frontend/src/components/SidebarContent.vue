<template>
  <div class="space-y-6">
    <div v-for="section in filteredMenu" :key="section.title">
      <!-- Section Header -->
      <div class="flex items-center gap-3 mb-4 group/section">
        <div
          class="h-1.5 w-1.5 rounded-full bg-indigo-500/50 dark:bg-indigo-500/40 transition-all duration-300 group-hover/section:scale-150 group-hover/section:bg-indigo-500">
        </div>
        <span
          class="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 transition-colors duration-300 group-hover/section:text-indigo-500 dark:group-hover/section:text-indigo-400">
          {{ section.title }}
        </span>
        <div class="h-px flex-1 bg-gradient-to-r from-indigo-500/10 via-slate-500/5 to-transparent"></div>
      </div>

      <!-- Navigation Items -->
      <nav class="space-y-1.5">
        <!-- If it's a dropdown group -->
        <template v-if="section.isGroup">
          <button @click="$emit('update:' + section.groupKey, !props[section.groupKey])"
            :class="buttonClasses(props[section.groupKey])">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                :class="props[section.groupKey] ? 'text-indigo-500' : 'opacity-70'" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="section.icon" />
              </svg>
              <span class="font-bold tracking-tight">{{ section.label }}</span>
            </div>
            <svg class="h-3 w-3 transition-transform duration-500"
              :class="props[section.groupKey] ? 'rotate-180 text-indigo-500' : 'opacity-40'" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <Transition name="expand">
            <div v-if="props[section.groupKey]"
              class="mt-1.5 space-y-1.5 overflow-hidden">
              <SidebarItem v-for="child in section.children" :key="child.to" :to="child.to" :isDark="isDark"
                :icon="child.icon" :isChild="false">
                {{ child.label }}
              </SidebarItem>
            </div>
          </Transition>
        </template>

        <!-- Standard Items -->
        <template v-else>
          <SidebarItem v-for="item in section.items" :key="item.to" :to="item.to" :isDark="isDark" :icon="item.icon">
            {{ item.label }}
          </SidebarItem>
        </template>
      </nav>
    </div>
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
  if (!roles) return [];
  if (Array.isArray(roles)) return roles;
  return [roles]; // Wrap string roles in array so .some works
});

const buttonClasses = (isOpen) => [
  'flex w-full items-center justify-between py-2.5 px-3 text-left text-sm rounded-xl transition-all duration-300 group active:scale-[0.98] border border-transparent',
  isOpen
    ? (props.isDark
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.03)] font-semibold'
      : 'bg-indigo-50 text-indigo-600 border-indigo-500/10 shadow-[0_4px_12px_rgba(99,102,241,0.03)] font-semibold')
    : (props.isDark
      ? 'text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/5'
      : 'text-slate-600 hover:bg-white hover:shadow-md hover:shadow-black/[0.02] hover:text-indigo-600 hover:border-slate-100')
]

const filteredMenu = computed(() => {
  const sections = [
    {
      title: "Core",
      items: [
        {
          label: "Dashboard",
          to: userRole.value.some(role => ['Trainer', 'Director', 'Course Director'].includes(role))
            ? "/admin/trainer/dashboard"
            : "/admin/dashboard",
          icon: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
          show: true
        }
      ]
    },
    {
      title: "Training",
      items: [
        {
          label: "My Sessions",
          to: "/trainer/trainings",
          icon: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M3 10h18 M9 22V10",
          show: userRole.value.includes("Trainer")
        },
        {
          label: "Courses",
          to: "/admin/training/program",
          icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6",
          show: userRole.value.some(role => ['Admin', 'Director', 'Course Director'].includes(role))
        }
      ]
    },
    {
      title: "Users",
      show: userRole.value.some(role => ['Admin', 'Director'].includes(role)),
      isGroup: true,
      groupKey: "trainingOpen",
      label: "Manage Users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      children: [
        {
          label: "Trainers",
          to: "/admin/trainer",
          icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        },
        {
          label: "Trainees",
          to: "/admin/trainee",
          icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        },
        {
          label: "ATI Faculty",
          to: "/admin/employee",
          icon: "M17 21v-2a4 4 0 0 0-3-3.87 M9 21v-2a4 4 0 0 0-3-3.87 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        }
      ]
    },
    {
      title: "Infrastructure",
      show: userRole.value.some(role => ['Admin', 'Director'].includes(role)),
      isGroup: true,
      groupKey: "masterOpen",
      label: "System Data",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      children: [
        {
          label: "Rooms",
          to: "/admin/master/room",
          icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        },
        {
          label: "Geo Location",
          to: "/admin/master/location",
          icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        },
        {
          label: "Categories",
          to: "/admin/master/category",
          icon: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        },
        {
          label: "Notice Board",
          to: "/admin/master/documents",
          icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        },
        {
          label: "FAQs",
          to: "/admin/master/faq",
          icon: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01"
        },
        {
          label: "Banners",
          to: "/admin/master/banner",
          icon: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        },
        {
          label: "Evaluation",
          to: "/admin/master/evaluation",
          icon: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          label: "Tickets",
          to: "/admin/ticket",
          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
          show: userRole.value.some(role => ['Admin', 'Director'].includes(role))
        },
        {
          label: "Notification",
          to: "/admin/notification",
          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
          show: userRole.value.some(role => ['Admin', 'Director'].includes(role))
        }
      ]
    }
  ];

  return sections
    .map(section => {
      if (section.isGroup) return section;
      return {
        ...section,
        items: section.items.filter(item => item.show)
      };
    })
    .filter(section => {
      if (section.isGroup) return section.show;
      return section.items.length > 0;
    });
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 400px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
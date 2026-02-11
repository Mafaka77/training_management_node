<template>
  <div class="max-w-[90rem] mx-auto pb-10">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Enrollment Requests
        </h2>
        <p class="text-sm text-zinc-500 mt-1">Manage and review trainee applications for programs.</p>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
          <button 
            v-for="status in ['All', 'Pending', 'Approved', 'Rejected', 'Waitlisted']" 
            :key="status"
            @click="handleFilterChange(status)"
            :class="[
              activeFilter === status 
                ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            ]"
            class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
          >
            {{ status }}
          </button>
        </div>

        <div class="relative group">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            @input="handleSearch"
            type="text" 
            placeholder="Search trainee or program..." 
            class="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64"
          />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Trainee</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Training Program</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="item in enrollments" :key="item._id" class="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-xs uppercase">
                    {{ item.user?.full_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ item.user?.full_name }}</p>
                    <p class="text-[11px] text-zinc-500">{{ item.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                {{ item.training_program?.t_name }}
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="getStatusClass(item.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="{name:'admin.enrollment.detail', params:{id:item._id}}" class="p-2 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button v-if="item.status === 'Pending'" @click="updateStatus(item._id, 'Approved')" class="p-2 text-zinc-400 hover:text-emerald-500">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
        <span class="text-xs text-zinc-500 font-medium">
            Showing {{ enrollments.length }} of {{ pagination.total }} results
        </span>
        
        <div class="flex items-center gap-1">
          <button 
            @click="changePage(pagination.page - 1)" 
            :disabled="pagination.page <= 1"
            class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <span class="text-xs font-bold px-3 text-zinc-700 dark:text-zinc-300">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>

          <button 
            @click="changePage(pagination.page + 1)" 
            :disabled="pagination.page >= pagination.totalPages"
            class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEnrollmentStore } from '../../../store/enrollmentStore';
import { useAlertStore } from '../../../store/alertStore';
import { storeToRefs } from 'pinia';

const store = useEnrollmentStore();
const alert = useAlertStore();
const { enrollments, pagination } = storeToRefs(store);

const activeFilter = ref('All');
const searchQuery = ref('');
let searchTimer = null;

// --- ACTIONS ---

const fetchData = (page = 1) => {
  store.fetchEnrollments({
    page,
    status: activeFilter.value === 'All' ? '' : activeFilter.value,
    search: searchQuery.value
  });
};

const handleFilterChange = (status) => {
  activeFilter.value = status;
  fetchData(1); // Always reset to page 1 on filter change
};

const handleSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchData(1);
  }, 500); // Debounce search for 500ms
};

const changePage = (newPage) => {
  fetchData(newPage);
};

const getStatusClass = (status) => {
  const map = {
    'Approved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Rejected': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'Waitlisted': 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };
  return map[status] || 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
};

const updateStatus = async (id, status) => {
  const res = await store.updateEnrollmentStatus(id, status);
  if (res.success) {
    alert.success(res.message);
    // Refresh current page to update list (or handle locally in store)
    fetchData(pagination.value.page); 
  } else {
    alert.error(res.message);
  }
};

onMounted(() => fetchData());
</script>
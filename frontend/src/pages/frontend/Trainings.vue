<template>
  <div class="bg-[#071a13] min-h-screen p-6 lg:px-20 lg:py-12 font-sans selection:bg-emerald-500/30 text-zinc-50">
    <div class="max-w-7xl mx-auto mb-20 text-center">
      <h1 class="text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
        Excellence in <span class="text-emerald-400 font-normal">Public Service</span>
      </h1>
      <p class="text-emerald-200/70 text-sm max-w-lg mx-auto font-light leading-relaxed">
        Explore ongoing, upcoming, and foundation training programs curated by the Administrative Training Institute.
      </p>
    </div>

    <div v-if="loading && trainings.length === 0"
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i"
        class="bg-[#0a2319]/50 border border-emerald-500/15 rounded-[1.5rem] overflow-hidden animate-pulse">
        <div class="h-56 bg-[#061811]/60"></div>
        <div class="p-7 space-y-6">
          <div class="h-3 w-24 bg-emerald-950 rounded"></div>
          <div class="space-y-2">
            <div class="h-5 w-full bg-emerald-950 rounded"></div>
            <div class="h-5 w-2/3 bg-emerald-950 rounded"></div>
          </div>
          <div class="grid grid-cols-2 gap-4 py-5 border-y border-emerald-500/10">
            <div class="space-y-2">
              <div class="h-2 w-10 bg-emerald-950 rounded"></div>
              <div class="h-3 w-20 bg-emerald-950 rounded"></div>
            </div>
            <div class="space-y-2">
              <div class="h-2 w-10 bg-emerald-950 rounded ml-auto"></div>
              <div class="h-3 w-20 bg-emerald-950 rounded ml-auto"></div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="h-2 w-16 bg-emerald-950 rounded"></div>
            <div class="flex gap-2">
              <div class="h-6 w-16 bg-emerald-950 rounded-md"></div>
              <div class="h-6 w-16 bg-emerald-950 rounded-md"></div>
            </div>
          </div>
          <div class="h-12 w-full bg-emerald-950 rounded-xl mt-4"></div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="training in trainings" :key="training.id"
        class="group relative flex flex-col bg-[#0a2319]/80 border border-emerald-500/15 rounded-[1.5rem] overflow-hidden hover:border-emerald-400/40 transition-all duration-500 shadow-sm hover:shadow-2xl">
        <div class="relative h-56 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-[#071a13]/90 to-transparent z-10"></div>
          <img :src="getImageUrl(training.t_banner)" :alt="training.t_name"
            class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />

          <div class="absolute top-5 left-5 z-20">
            <span
              :class="['px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-widest backdrop-blur-md border shadow-xl', getStatusStyle(training.t_status).badge]">
              {{ training.t_status }}
            </span>
          </div>

          <div class="absolute bottom-4 left-6 z-20">
            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              {{ training.t_category?.name }}
            </span>
          </div>
        </div>

        <div class="p-7 flex-1 flex flex-col justify-between">
          <h3 class="text-xl font-normal text-zinc-100 mb-6 leading-snug group-hover:text-white transition-colors">
            {{ training.t_name }}
          </h3>

          <div class="grid grid-cols-2 gap-4 py-5 border-y border-emerald-500/15 mb-6">
            <div class="space-y-1">
              <p class="text-[9px] text-emerald-400/80 uppercase tracking-widest font-medium">Timeline</p>
              <p class="text-[12px] text-emerald-100/90 font-light">{{ formatDateRange(training.t_start_date,
                training.t_end_date) }}</p>
            </div>
            <div class="space-y-1 text-right">
              <p class="text-[9px] text-emerald-400/80 uppercase tracking-widest font-medium">Capacity</p>
              <p class="text-[12px] text-emerald-100/90 font-light">{{ training.t_capacity }} Participants</p>
            </div>
          </div>

          <div class="mb-8">
            <p class="text-[9px] text-emerald-400/80 uppercase tracking-widest font-medium mb-3">Target Group</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="group in training.t_eligibility" :key="group._id"
                class="px-2.5 py-1 rounded-md text-[10px] font-normal bg-emerald-500/10 text-emerald-200/90 border border-emerald-500/20">
                {{ group.group_name }}
              </span>
            </div>
          </div>

          <div class="mt-auto">
            <button @click="handleApply(training.id || training._id)"
              class="group/btn relative w-full flex items-center justify-center gap-2 py-3.5 bg-white text-[#071a13] rounded-xl font-medium text-[11px] uppercase tracking-wider transition-all hover:bg-emerald-600 hover:text-white active:scale-[0.98] cursor-pointer shadow-md">
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop App Download Modal -->
    <div v-if="showDesktopModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        class="relative w-full max-w-md bg-[#0a2319] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button @click="showDesktopModal = false"
          class="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">ATI Mizoram Mobile App</h3>
            <p class="text-xs text-emerald-300/70">Application Submission</p>
          </div>
        </div>

        <p class="text-sm text-emerald-100/90 leading-relaxed">
          To enroll and submit your training application, please open the <strong class="text-white">ATI Mobile
            App</strong> on your mobile device. If you haven't installed it yet, get it below:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a :href="PLAY_STORE_URL" target="_blank" rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 p-3 bg-[#061811] hover:bg-[#103828] border border-emerald-500/20 rounded-xl text-white text-xs font-semibold transition-all">
            <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.67.4.67 1.4 0 1.8l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
            </svg>
            Google Play
          </a>
          <a :href="APP_STORE_URL" target="_blank" rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 p-3 bg-[#061811] hover:bg-[#103828] border border-emerald-500/20 rounded-xl text-white text-xs font-semibold transition-all">
            <svg class="w-5 h-5 text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.51 2.63-1.24z" />
            </svg>
            App Store
          </a>
        </div>
      </div>
    </div>

    <div class="mt-20 flex flex-col items-center gap-6 pb-20">
      <button v-if="store.hasMore" @click="loadMore" :disabled="store.loading"
        class="px-10 py-4 bg-transparent border border-emerald-500/20 rounded-xl font-medium text-emerald-200/80 transition-all hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-30">
        <div class="flex items-center gap-3">
          <span v-if="store.loading"
            class="w-4 h-4 border border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          <span class="tracking-[0.15em] uppercase text-[10px]">{{ store.loading ? 'Syncing Catalog...' :
            'Load More Programs' }}</span>
        </div>
      </button>
      <p v-else-if="trainings.length > 0" class="text-emerald-400/50 font-medium text-[9px] uppercase tracking-[0.4em]">
        End of official catalog
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useHomeStore } from "../../store/homeStore.js";

const store = useHomeStore();
const { trainings, loading } = storeToRefs(store);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const currentPage = ref(1);
const showDesktopModal = ref(false);

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.msegs.training_apps";
const APP_STORE_URL = "https://apps.apple.com/in/app/atimiz/id6788260969";
const APP_SCHEME = "ati://training";

const handleApply = (trainingId) => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const programId = trainingId || "";

  const customSchemeUrl = `${APP_SCHEME}/${programId}`;

  if (isAndroid) {
    const start = Date.now();
    window.location.href = customSchemeUrl;

    setTimeout(() => {
      if (document.visibilityState === "visible" || Date.now() - start < 2000) {
        window.location.href = PLAY_STORE_URL;
      }
    }, 1500);
  } else if (isIOS) {
    const start = Date.now();
    window.location.href = customSchemeUrl;

    setTimeout(() => {
      if (document.visibilityState === "visible" || Date.now() - start < 2000) {
        window.location.href = APP_STORE_URL;
      }
    }, 1500);
  } else {
    showDesktopModal.value = true;
  }
};

const loadMore = async () => {
  currentPage.value++;
  await store.fetchPrograms(currentPage.value);
};

function getImageUrl(path) {
  if (!path) return "https://via.placeholder.com/400x400?text=No+Banner"
  return `${IMAGE_URL}${path}`
}

const statusStyles = {
  Draft: { badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  Upcoming: { badge: "bg-teal-500/10 text-teal-300 border-teal-500/20" },
  Ongoing: { badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  Completed: { badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20" },
}

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming

const formatDateRange = (start, end) => {
  if (!start) return "To be announced"
  const opt = { month: "short", day: "numeric" }
  const s = new Date(start).toLocaleDateString("en-US", opt)
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })
  return `${s} — ${e}`
}

onMounted(() => {
  currentPage.value = 1;
  store.fetchPrograms(1);
});
</script>
<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.animate-pulse {
  background: linear-gradient(90deg, #071a13 25%, #0a2319 50%, #071a13 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
</style>
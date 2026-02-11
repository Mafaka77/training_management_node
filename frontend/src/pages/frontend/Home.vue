<template>
  <div class="relative w-full font-sans selection:bg-blue-500/30">
    <section class="relative min-h-[80vh] md:min-h-[90vh] w-full flex items-center justify-center bg-zinc-950 overflow-hidden">

      <div class="absolute inset-0">
        <img
            src="https://ati.mizoram.gov.in/uploads/attachments/2025/08/ca901cffabd9f078f3150ffb8e9dc406/ati-1.jpg"
            class="w-full h-full object-fill block grayscale-[0.2]"
            alt="ATI Mizoram Campus"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-920/40"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/[0.03] border border-blue-500/20 backdrop-blur-xl mb-8 group hover:border-blue-500/40 transition-all duration-500">
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-40"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-red-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
  </span>
          <span class="text-[10px] font-semibold text-blue-400 uppercase tracking-[0.25em] drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]">
    Training Calendar 2026 Active
  </span>
        </div>

        <h1 class="text-4xl md:text-7xl font-light text-white tracking-tight mb-6 leading-[1.1]">
          Empowering Governance <br />
          <span class="text-blue-400 font-normal">Through Administrative Excellence.</span>
        </h1>

        <p class="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-10">
          The premier institute for capacity building in Mizoram—shaping proficient civil servants
          through systematic foundation courses and specialized administrative training.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
              to="/trainings/calendar"
              class="group/btn relative w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-zinc-100 text-zinc-950 rounded-xl font-medium text-[11px] uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98]"
          >
            View Training Calendar
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>

          <button class="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/10 rounded-xl font-medium text-zinc-400 transition-all hover:border-blue-500/40 hover:text-blue-400 text-[11px] uppercase tracking-widest">
            About the Institute
          </button>
        </div>
      </div>
    </section>

    <section class="relative z-20  bg-zinc-950 border-t border-white/[0.05]">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div
            v-for="feature in features"
            :key="feature.title"
            class="group p-8 rounded-[1.5rem] bg-zinc-900/20 border border-white/[0.05] hover:border-blue-500/30 transition-all duration-500"
        >
          <div class="w-12 h-12 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400/80 mb-8 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <component :is="feature.icon" class="w-5 h-5" />
          </div>

          <div class="mb-3">
            <span class="text-blue-500/60 text-[9px] font-medium uppercase tracking-[0.2em]">Institutional Pillar</span>
          </div>

          <h3 class="text-xl font-normal text-zinc-100 mb-4 tracking-tight group-hover:text-white transition-colors">
            {{ feature.title }}
          </h3>

          <p class="text-zinc-500 text-[13px] leading-relaxed font-light">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { AcademicCapIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';

const features = [
  {
    title: 'Resource Persons',
    desc: 'Instruction by veteran administrators and subject matter experts with deep insights into state governance.',
    icon: AcademicCapIcon
  },
  {
    title: 'Service Cadres',
    desc: 'Tailored induction and mid-career programs for MCS, MSS, MFAS, and various Technical Service wings.',
    icon: UserGroupIcon
  },
  {
    title: 'Institutional Integrity',
    desc: 'Committed to fostering transparency, efficiency, and ethical leadership within the public workforce.',
    icon: ShieldCheckIcon
  }
];
</script>
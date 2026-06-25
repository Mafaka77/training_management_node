<template>
  <div class="relative w-full font-sans selection:bg-blue-500/30 bg-zinc-950 text-zinc-50 overflow-hidden">

    <!-- Background Grid & Glows -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>
    <div
      class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full glow-orb pointer-events-none z-0">
    </div>
    <div
      class="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full glow-orb pointer-events-none z-0">
    </div>
    <div
      class="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full glow-orb pointer-events-none z-0">
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        <!-- Left Side: Main Title & Actions -->
        <div class="lg:col-span-7 space-y-6 text-left">

          <!-- Government Tagline Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md hover:border-blue-500/20 transition-all duration-300">
            <img src="../../assets/seal.png" class="w-5 h-5 object-contain" alt="Government of Mizoram Seal" />
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em]">
              ATI Mizoram • Government of Mizoram
            </span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Empowering Governance<br />
            <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Through Administrative Excellence.
            </span>
          </h1>

          <!-- Description -->
          <p class="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed font-light">
            The premier institute for capacity building in Mizoram—shaping proficient civil servants through systematic
            foundation courses, mid-career training, and specialized administrative programs.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <router-link to="/trainings/calendar"
              class="group/btn relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98]">
              View Training Calendar
              <ArrowRightIcon class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </router-link>

            <router-link to="/about-us"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 backdrop-blur-md">
              <span>About the Institute</span>
            </router-link>
          </div>
        </div>

        <!-- Right Side: Floating Interactive Mockups -->
        <div class="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-[420px] group">

            <!-- Glow background effect -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200">
            </div>

            <!-- Main Campus Card -->
            <div class="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <!-- Render Banner Image, fallback to remote if missing -->
              <img src="../../assets/ati_banner.jpg"
                class="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                alt="ATI Mizoram Campus"
                @error="$event.target.src = 'https://ati.mizoram.gov.in/uploads/attachments/2025/08/ca901cffabd9f078f3150ffb8e9dc406/ati-1.jpg'" />
              <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

              <!-- Floating Location Details -->
              <div
                class="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-zinc-950/80 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <div>
                  <p class="text-xs font-semibold text-white">ATI Campus Building</p>
                  <p class="text-[10px] text-zinc-400">Chaltlang, Aizawl, Mizoram</p>
                </div>
                <span
                  class="px-2.5 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider rounded-md">
                  Aizawl
                </span>
              </div>
            </div>

            <!-- Floating Active Program Widget -->
            <div
              class="absolute -bottom-6 -left-6 bg-zinc-900/90 border border-white/10 p-5 rounded-xl shadow-2xl backdrop-blur-xl max-w-[240px] hidden sm:block hover:border-blue-500/30 transition-all duration-300">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <CalendarDaysIcon class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Latest Schedule</h4>
                  <p class="text-[9px] text-zinc-400">Year 2026</p>
                </div>
              </div>
              <p class="text-[11px] text-zinc-300 leading-relaxed font-light mb-3">
                Calendar updated with current service cadre foundation schedules.
              </p>
              <router-link to="/trainings"
                class="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Browse Trainings
                <ArrowRightIcon class="w-3 h-3" />
              </router-link>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Metrics Bar Section -->
    <section class="relative z-10 border-y border-white/[0.08] bg-zinc-950/40 backdrop-blur-sm py-10">
      <div class="max-w-7xl mx-auto px-6">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">

          <div class="md:px-8 first:pl-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">15K+</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Civil Officers Trained</p>
            <p class="text-xs text-zinc-400 font-light">Equipped with state-of-the-art public administration skills.</p>
          </div>

          <div class="md:px-8 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-blue-400 tracking-tight">120+</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Courses Annually</p>
            <p class="text-xs text-zinc-400 font-light">Targeted programs across financial rules, governance, and IT.
            </p>
          </div>

          <div class="md:px-8 last:pr-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">35+ Years</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Institutional Legacy</p>
            <p class="text-xs text-zinc-400 font-light">Serving the Government of Mizoram with high distinction.</p>
          </div>

        </div>
      </div>
    </section>


    <!-- Director's Welcome Section -->
    <section class="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <div
        class="relative bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        <!-- Glow accents -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full glow-orb pointer-events-none">
        </div>
        <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full glow-orb pointer-events-none">
        </div>

        <div class="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Quote symbol icon -->
          <div class="md:col-span-1 flex justify-center md:justify-start">
            <svg class="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div class="md:col-span-11 space-y-6 text-center md:text-left">
            <p class="text-zinc-300 text-sm md:text-base leading-relaxed font-light italic">
              "Welcome to the Administrative Training Institute. Our mission is to inspire, train, and support the
              state's public service officers in delivering efficient, clean, and citizen-centric governance. Through
              modern pedagogy and continuous learning, we strive to make public administration in Mizoram a model of
              excellence."
            </p>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <img src="../../assets/seal.png" class="w-6 h-6 object-contain" alt="ATI Crest" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Director, ATI Mizoram</h4>
                <p class="text-[10px] text-zinc-500 font-medium">Administrative Training Institute, Aizawl</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



  </div>
</template>

<script setup>
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline';

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

<style scoped>
.grid-bg {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 30px 30px;
}

.glow-orb {
  filter: blur(120px);
}
</style>
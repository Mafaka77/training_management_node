<template>
  <div class="relative w-full font-sans selection:bg-emerald-500/30 bg-[#071a13] text-zinc-50 overflow-hidden">

    <!-- Background Grid & Forest Green Atmospheric Glows -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>
    <div
      class="absolute top-0 left-1/4 w-[520px] h-[520px] bg-emerald-600/15 rounded-full glow-orb pointer-events-none z-0">
    </div>
    <div
      class="absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-teal-600/10 rounded-full glow-orb pointer-events-none z-0">
    </div>
    <div
      class="absolute bottom-10 left-10 w-[350px] h-[350px] bg-green-500/10 rounded-full glow-orb pointer-events-none z-0">
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        <!-- Left Side: Main Title & Actions -->
        <div class="lg:col-span-7 space-y-6 text-left">

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Empowering Governance<br />
            <span class="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent">
              Through Administrative Excellence.
            </span>
          </h1>

          <!-- Description -->
          <p class="text-emerald-100/75 text-base md:text-lg max-w-xl leading-relaxed font-light">
            The premier institute for capacity building in Mizoram—shaping proficient civil servants through systematic
            foundation courses, mid-career training, and specialized administrative programs.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <router-link to="/trainings/calendar"
              class="group/btn relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#071a13] rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-[0.98]">
              View Training Calendar
              <ArrowRightIcon class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </router-link>

            <router-link to="/about-us"
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#0d2a1f]/80 hover:bg-[#133d2e] border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100 hover:text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 backdrop-blur-md">
              <span>About the Institute</span>
            </router-link>
          </div>
        </div>

        <!-- Right Side: Floating Interactive Mockups -->
        <div class="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-[420px] group">

            <!-- Glow background effect -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200">
            </div>

            <!-- Main Campus Card -->
            <div class="relative bg-[#0a2319] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl">
              <!-- Render Banner Image, fallback to remote if missing -->
              <img
                src="https://ati.mizoram.gov.in/uploads/attachments/2026/06/24550fb8066171d64a946c86c76e4528/front-final-banner.jpeg"
                class="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                alt="ATI Mizoram Campus" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#071a13] via-[#071a13]/40 to-transparent"></div>

              <!-- Floating Location Details -->
              <div
                class="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#061811]/90 border border-emerald-500/25 p-4 rounded-xl backdrop-blur-md">
                <div>
                  <p class="text-xs font-semibold text-white">ATI Campus Building</p>
                  <p class="text-[10px] text-emerald-200/60">Chaltlang, Aizawl, Mizoram</p>
                </div>
                <span
                  class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider rounded-md">
                  Aizawl
                </span>
              </div>
            </div>

            <!-- Floating Active Program Widget -->
            <div
              class="absolute -bottom-6 -left-6 bg-[#0a2319]/95 border border-emerald-500/25 p-5 rounded-xl shadow-2xl backdrop-blur-xl max-w-[240px] hidden sm:block hover:border-emerald-400/40 transition-all duration-300">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <CalendarDaysIcon class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-bold text-white">Latest Schedule</h4>
                  <p class="text-[9px] text-emerald-200/60">Year 2026</p>
                </div>
              </div>
              <p class="text-[11px] text-emerald-100/80 leading-relaxed font-light mb-3">
                Calendar updated with current service cadre foundation schedules.
              </p>
              <router-link to="/trainings"
                class="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Browse Trainings
                <ArrowRightIcon class="w-3 h-3" />
              </router-link>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Metrics Bar Section -->
    <section class="relative z-10 border-y border-emerald-500/15 bg-[#05140e]/60 backdrop-blur-sm py-10">
      <div class="max-w-7xl mx-auto px-6">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-emerald-500/15">

          <div class="md:px-8 first:pl-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">15K+</h3>
            <p class="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Civil Officers Trained</p>
            <p class="text-xs text-emerald-200/70 font-light">Equipped with state-of-the-art public administration
              skills.</p>
          </div>

          <div class="md:px-8 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-emerald-300 tracking-tight">120+</h3>
            <p class="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Courses Annually</p>
            <p class="text-xs text-emerald-200/70 font-light">Targeted programs across financial rules, governance, and
              IT.
            </p>
          </div>

          <div class="md:px-8 last:pr-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">35+ Years</h3>
            <p class="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Institutional Legacy</p>
            <p class="text-xs text-emerald-200/70 font-light">Serving the Government of Mizoram with high distinction.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Director's Welcome Section -->
    <section class="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <div
        class="relative bg-gradient-to-b from-[#0a271c]/90 to-[#061811] border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        <!-- Glow accents -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full glow-orb pointer-events-none">
        </div>
        <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-teal-500/10 rounded-full glow-orb pointer-events-none">
        </div>

        <div class="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Quote symbol icon -->
          <div class="md:col-span-1 flex justify-center md:justify-start">
            <svg class="w-12 h-12 text-emerald-400/30" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div class="md:col-span-11 space-y-6 text-center md:text-left">
            <p
              class="text-emerald-100/90 text-sm md:text-base leading-relaxed font-light italic text-justify md:text-left">
              "Welcome to the Administrative Training Institute, the cornerstone of administrative excellence and
              capacity building in Mizoram. Our primary mission is clear: to foster transparent, accountable, and
              profoundly citizen-centric governance by making training a continuous, holistic, and inclusive process. We
              are actively moving beyond traditional classroom instruction by adopting a structured, competency-based
              approach that directly addresses the emerging challenges faced by our civil service. Our recent national
              accreditation under Mission Karmayogi is a testament to the rigorous self-assessment and high standards
              maintained by our dedicated 40-member team. As we look to the future, we are rapidly transforming our
              operational landscape—integrating smart classrooms, developing specialized e-learning modules in the Mizo
              language through our new Digital Learning Laboratory, and working hand-in-hand with individual departments
              to craft targeted annual training plans. By institutionalizing these modern methodologies and focusing
              strongly on behavioural and attitudinal shifts, we are ensuring that every public servant who walks
              through our doors leaves fully equipped to deliver responsive, future-ready service to the people of
              Mizoram."
            </p>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <img src="../../assets/seal.png" class="w-6 h-6 object-contain" alt="ATI Crest" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Director, ATI Mizoram</h4>
                <p class="text-[10px] text-emerald-300/70 font-medium">Administrative Training Institute, Aizawl</p>
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
    linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
  background-size: 30px 30px;
}

.glow-orb {
  filter: blur(120px);
}
</style>
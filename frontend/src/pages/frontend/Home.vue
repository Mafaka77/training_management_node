<template>
  <div class="relative w-full font-sans selection:bg-blue-500/30 bg-zinc-950 text-zinc-50 overflow-hidden">
    
    <!-- Background Grid & Glows -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full glow-orb pointer-events-none z-0"></div>
    <div class="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full glow-orb pointer-events-none z-0"></div>
    <div class="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full glow-orb pointer-events-none z-0"></div>

    <!-- Hero Section -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Left Side: Main Title & Actions -->
        <div class="lg:col-span-7 space-y-6 text-left">
          
          <!-- Government Tagline Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md hover:border-blue-500/20 transition-all duration-300">
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
            The premier institute for capacity building in Mizoram—shaping proficient civil servants through systematic foundation courses, mid-career training, and specialized administrative programs.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <router-link
                to="/trainings/calendar"
                class="group/btn relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98]"
            >
              View Training Calendar
              <ArrowRightIcon class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </router-link>

            <router-link
                to="/about-us"
                class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white rounded-xl font-semibold text-[11px] uppercase tracking-widest transition-all duration-300 backdrop-blur-md"
            >
              <span>About the Institute</span>
            </router-link>
          </div>
        </div>

        <!-- Right Side: Floating Interactive Mockups -->
        <div class="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-[420px] group">
            
            <!-- Glow background effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <!-- Main Campus Card -->
            <div class="relative bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <!-- Render Banner Image, fallback to remote if missing -->
              <img
                  src="../../assets/ati_banner.jpg"
                  class="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  alt="ATI Mizoram Campus"
                  @error="$event.target.src = 'https://ati.mizoram.gov.in/uploads/attachments/2025/08/ca901cffabd9f078f3150ffb8e9dc406/ati-1.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
              
              <!-- Floating Location Details -->
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-zinc-950/80 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <div>
                  <p class="text-xs font-semibold text-white">ATI Campus Building</p>
                  <p class="text-[10px] text-zinc-400">Chaltlang, Aizawl, Mizoram</p>
                </div>
                <span class="px-2.5 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider rounded-md">
                  Aizawl
                </span>
              </div>
            </div>

            <!-- Floating Active Program Widget -->
            <div class="absolute -bottom-6 -left-6 bg-zinc-900/90 border border-white/10 p-5 rounded-xl shadow-2xl backdrop-blur-xl max-w-[240px] hidden sm:block hover:border-blue-500/30 transition-all duration-300">
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
              <router-link to="/trainings" class="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          
          <div class="md:px-8 first:pl-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">15K+</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Civil Officers Trained</p>
            <p class="text-xs text-zinc-400 font-light">Equipped with state-of-the-art public administration skills.</p>
          </div>

          <div class="md:px-8 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-blue-400 tracking-tight">120+</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Courses Annually</p>
            <p class="text-xs text-zinc-400 font-light">Targeted programs across financial rules, governance, and IT.</p>
          </div>

          <div class="md:px-8 last:pr-0 space-y-2 py-4 md:py-0">
            <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">35+ Years</h3>
            <p class="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Institutional Legacy</p>
            <p class="text-xs text-zinc-400 font-light">Serving the Government of Mizoram with high distinction.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- Quick Portals / Access Tracks -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span class="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]">Quick Access Portals</span>
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white">Select Your Interface</h2>
        <p class="text-zinc-400 text-sm font-light">
          Whether you are a nominating department, active trainee, or faculty trainer, access your dedicated workflow interface.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Trainee Portal -->
        <div class="group relative bg-zinc-900/20 border border-white/[0.06] rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <UserIcon class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">For Trainees</h3>
            <p class="text-zinc-400 text-xs leading-relaxed font-light mb-6">
              View your course schedules, enrollments, daily attendance records, and download official course completion certificates.
            </p>
          </div>
          <router-link to="/trainings" class="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            <span>Explore Programs</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <!-- Faculty/Trainer Portal -->
        <div class="group relative bg-zinc-900/20 border border-white/[0.06] rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <BookOpenIcon class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">For Trainers</h3>
            <p class="text-zinc-400 text-xs leading-relaxed font-light mb-6">
              Access your training assignments, manage session plans, upload course materials, and submit participant evaluations.
            </p>
          </div>
          <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            <span>Faculty Login</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <!-- Departments Portal -->
        <div class="group relative bg-zinc-900/20 border border-white/[0.06] rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
              <BuildingOfficeIcon class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">For Departments</h3>
            <p class="text-zinc-400 text-xs leading-relaxed font-light mb-6">
              Browse the annual training calendar, submit official officer nominations, and monitor status updates on nominated candidates.
            </p>
          </div>
          <router-link to="/trainings/calendar" class="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            <span>Nominate Officers</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>

      </div>
    </section>

    <!-- Core Pillars of Excellence -->
    <section class="relative z-10 bg-zinc-900/10 border-t border-white/[0.05] py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span class="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]">Core Philosophy</span>
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white">Pillars of the Institute</h2>
          <p class="text-zinc-400 text-sm font-light">
            Our foundations are built on high administrative competencies and deep commitment to state capability growth.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
              v-for="feature in features"
              :key="feature.title"
              class="group relative p-8 rounded-2xl bg-zinc-950/40 border border-white/[0.06] hover:border-blue-500/30 hover:bg-zinc-900/20 transition-all duration-500"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400/80 mb-6 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <component :is="feature.icon" class="w-5 h-5" />
            </div>

            <span class="text-blue-500/60 text-[9px] font-bold uppercase tracking-[0.2em] block mb-2">Institutional Pillar</span>
            <h3 class="text-xl font-semibold text-zinc-100 mb-3 tracking-tight group-hover:text-white transition-colors">
              {{ feature.title }}
            </h3>

            <p class="text-zinc-400 text-[13px] leading-relaxed font-light">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Director's Welcome Section -->
    <section class="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <div class="relative bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        <!-- Glow accents -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full glow-orb pointer-events-none"></div>
        <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full glow-orb pointer-events-none"></div>

        <div class="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <!-- Quote symbol icon -->
          <div class="md:col-span-1 flex justify-center md:justify-start">
            <svg class="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <div class="md:col-span-11 space-y-6 text-center md:text-left">
            <p class="text-zinc-300 text-sm md:text-base leading-relaxed font-light italic">
              "Welcome to the Administrative Training Institute. Our mission is to inspire, train, and support the state's public service officers in delivering efficient, clean, and citizen-centric governance. Through modern pedagogy and continuous learning, we strive to make public administration in Mizoram a model of excellence."
            </p>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <div class="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
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

    <!-- Upcoming Trainings Preview -->
    <section class="relative z-10 max-w-7xl mx-auto px-6 pb-24">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Training Timeline</span>
          <h2 class="text-3xl font-bold tracking-tight text-white">Upcoming Programs Spotlight</h2>
        </div>
        <router-link to="/trainings/calendar" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
          <span>View Detailed Calendar</span>
          <ArrowRightIcon class="w-4 h-4" />
        </router-link>
      </div>

      <div class="space-y-4">
        
        <!-- Course Row 1 -->
        <div class="group relative bg-zinc-900/10 hover:bg-zinc-900/30 border border-white/[0.04] hover:border-blue-500/20 p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-wider">Digital Gov</span>
              <span class="text-[10px] text-zinc-500">Duration: 5 Days</span>
            </div>
            <h4 class="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">e-Governance & Digital Public Infrastructure Module</h4>
            <p class="text-zinc-400 text-xs font-light">Enabling department nodal officers to implement citizen-facing digital services.</p>
          </div>
          <div class="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div class="text-left md:text-right">
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Date Schedule</p>
              <p class="text-xs font-semibold text-white">June 22 - June 26, 2026</p>
            </div>
            <router-link to="/trainings" class="px-4 py-2 bg-zinc-800 hover:bg-blue-600 text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors">
              Details
            </router-link>
          </div>
        </div>

        <!-- Course Row 2 -->
        <div class="group relative bg-zinc-900/10 hover:bg-zinc-900/30 border border-white/[0.04] hover:border-indigo-500/20 p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Induction</span>
              <span class="text-[10px] text-zinc-500">Duration: 2 Weeks</span>
            </div>
            <h4 class="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">Mid-Career Training Program for MCS Officers</h4>
            <p class="text-zinc-400 text-xs font-light">Administrative leadership course for mid-level Mizoram Civil Service officers.</p>
          </div>
          <div class="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div class="text-left md:text-right">
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Date Schedule</p>
              <p class="text-xs font-semibold text-white">July 06 - July 17, 2026</p>
            </div>
            <router-link to="/trainings" class="px-4 py-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors">
              Details
            </router-link>
          </div>
        </div>

        <!-- Course Row 3 -->
        <div class="group relative bg-zinc-900/10 hover:bg-zinc-900/30 border border-white/[0.04] hover:border-cyan-500/20 p-6 rounded-2xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Foundation</span>
              <span class="text-[10px] text-zinc-500">Duration: 2 Weeks</span>
            </div>
            <h4 class="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">Office Procedures and Financial Rules Foundation</h4>
            <p class="text-zinc-400 text-xs font-light">Fundamental regulations, procurement procedures, and accounting rules for state staff.</p>
          </div>
          <div class="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
            <div class="text-left md:text-right">
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Date Schedule</p>
              <p class="text-xs font-semibold text-white">August 03 - August 14, 2026</p>
            </div>
            <router-link to="/trainings" class="px-4 py-2 bg-zinc-800 hover:bg-cyan-600 text-zinc-200 hover:text-white rounded-lg text-xs font-medium transition-colors">
              Details
            </router-link>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  BookOpenIcon,
  UserIcon,
  BuildingOfficeIcon
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
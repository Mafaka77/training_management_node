<template>
    <div
        class="relative min-h-screen w-full font-sans selection:bg-emerald-500/30 bg-[#071a13] text-zinc-50 overflow-hidden">

        <!-- Background Grid & Atmospheric Glows -->
        <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>
        <div
            class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full glow-orb pointer-events-none z-0">
        </div>
        <div
            class="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-teal-600/10 rounded-full glow-orb pointer-events-none z-0">
        </div>
        <div
            class="absolute bottom-10 left-10 w-[400px] h-[400px] bg-green-500/10 rounded-full glow-orb pointer-events-none z-0">
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-20">

            <!-- Hero Header Section -->
            <section class="space-y-6 max-w-4xl">

                <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                    About <span
                        class="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent">Us</span>
                </h1>

                <div
                    class="relative p-6 sm:p-8 rounded-2xl bg-[#0a2319]/90 border border-emerald-500/20 backdrop-blur-xl shadow-2xl space-y-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
                            <BuildingLibraryIcon class="w-5 h-5" />
                        </div>
                        <p
                            class="text-emerald-100/90 text-base md:text-lg leading-relaxed font-light text-justify sm:text-left">
                            The <strong class="text-white font-semibold">Administrative Training Institute
                                (ATI)</strong> is committed to developing knowledge, skills, awareness, and
                            responsiveness for citizen-centric governance by actively involving all stakeholders of
                            Government of Mizoram in training activities and related developmental initiatives. ATI
                            serves as a premier institution for capacity building and professional development of
                            government officials, aiming to strengthen governance through quality training and
                            systematic reforms.
                        </p>
                    </div>
                    <p
                        class="text-emerald-200/70 text-sm md:text-base leading-relaxed font-light text-justify sm:text-left pl-0 sm:pl-14">
                        The institute promotes competency-based learning, enhances professional knowledge and attitudes
                        for efficient public service, and ensures that training remains an inclusive and continuous
                        process. Through innovative training methodologies, strategic planning, and the implementation
                        of the State and Central Training Policies, ATI strives to maintain high standards of training
                        programmes and establish itself as a model organization dedicated to excellence in governance
                        and public administration.
                    </p>
                </div>
            </section>

            <!-- Vision & Mission Grid -->
            <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <!-- VISION CARD -->
                <div class="lg:col-span-5 relative group">
                    <div
                        class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500">
                    </div>
                    <div
                        class="relative h-full bg-[#0a2319] border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300">
                        <div>
                            <div class="flex items-center justify-between mb-6">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                                    <EyeIcon class="w-6 h-6" />
                                </div>
                                <span
                                    class="text-[11px] font-bold text-emerald-300 uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                                    Core Purpose
                                </span>
                            </div>
                            <h2 class="text-2xl font-bold text-white mb-4 tracking-tight">OUR VISION</h2>
                            <p class="text-emerald-100/80 text-base md:text-lg leading-relaxed font-light">
                                “Developing knowledge, skills, awareness and responsiveness for citizen centric
                                governance by involving all stakeholders in training activities and other related
                                projects.”
                            </p>
                        </div>

                        <div
                            class="mt-8 pt-6 border-t border-emerald-500/15 flex items-center gap-2 text-xs text-emerald-300/70 font-medium">
                            <SparklesIcon class="w-4 h-4 text-emerald-400" />
                            <span>Citizen-Centric Governance Focus</span>
                        </div>
                    </div>
                </div>

                <!-- MISSION CARD -->
                <div class="lg:col-span-7 relative group">
                    <div
                        class="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500">
                    </div>
                    <div
                        class="relative h-full bg-[#0a2319] border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300">
                        <div>
                            <div class="flex items-center justify-between mb-6">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
                                    <FlagIcon class="w-6 h-6" />
                                </div>
                                <span
                                    class="text-[11px] font-bold text-teal-300 uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30">
                                    Strategic Goals
                                </span>
                            </div>
                            <h2 class="text-2xl font-bold text-white mb-6 tracking-tight">OUR MISSION</h2>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div v-for="(mission, index) in missions" :key="index"
                                    class="p-4 rounded-xl bg-[#061811]/70 border border-emerald-500/15 hover:border-emerald-400/30 transition-colors flex items-start gap-3">
                                    <span
                                        class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {{ index + 1 }}
                                    </span>
                                    <p class="text-emerald-100/90 text-sm leading-snug">
                                        {{ mission }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-8 pt-6 border-t border-emerald-500/15 flex items-center gap-2 text-xs text-emerald-300/70 font-medium">
                            <ShieldCheckIcon class="w-4 h-4 text-emerald-400" />
                            <span>High Standards & Systematic Reforms</span>
                        </div>
                    </div>
                </div>

            </section>

            <!-- Objectives Section -->
            <section class="space-y-8">
                <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a2319] border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                            <CheckCircleIcon class="w-4 h-4" />
                            Core Pillars
                        </div>
                        <h2 class="text-3xl font-extrabold text-white tracking-tight">Our Key Objectives</h2>
                    </div>
                    <p class="text-emerald-200/70 text-sm max-w-md">
                        Guiding principles designed to build professional capability and responsive public
                        administration.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(objective, idx) in objectives" :key="idx"
                        class="group p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#0d2e21] transition-all duration-300 backdrop-blur-xl flex items-start gap-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
                            0{{ idx + 1 }}
                        </div>
                        <div class="space-y-1">
                            <h3
                                class="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                                {{ objective.title }}
                            </h3>
                            <p class="text-emerald-200/70 text-sm leading-relaxed">
                                {{ objective.desc }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Functions Section -->
            <section class="space-y-8">
                <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a2319] border border-emerald-500/20 text-teal-300 text-xs font-bold uppercase tracking-widest mb-3">
                            <Cog6ToothIcon class="w-4 h-4" />
                            Institutional Mandate
                        </div>
                        <h2 class="text-3xl font-extrabold text-white tracking-tight">Institutional Functions</h2>
                    </div>
                    <p class="text-emerald-200/70 text-sm max-w-md">
                        Operational responsibilities undertaken by ATI Mizoram to support departments across the state.
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(func, index) in functions" :key="index"
                        class="p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 hover:border-teal-400/40 hover:bg-[#0d2e21] transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div
                                    class="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                                    <component :is="func.icon" class="w-5 h-5" />
                                </div>
                                <span class="text-xs font-bold text-emerald-400/60">#0{{ index + 1 }}</span>
                            </div>
                            <p class="text-emerald-100/90 text-sm font-medium leading-relaxed">
                                {{ func.text }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Call to Action Banner -->
            <section
                class="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-emerald-500/20 bg-gradient-to-r from-[#0a271c] via-[#082017] to-[#0a2b1f] backdrop-blur-xl">
                <div class="max-w-2xl space-y-4 text-left">
                    <h3 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Explore Training Programs & Sessions
                    </h3>
                    <p class="text-emerald-100/80 text-sm md:text-base leading-relaxed">
                        Stay updated with upcoming foundation courses, workshops, and administrative capacity building
                        sessions.
                    </p>
                    <div class="flex flex-wrap gap-4 pt-2">
                        <router-link to="/trainings/calendar"
                            class="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#071a13] hover:bg-emerald-600 hover:text-white rounded-xl font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-black/40">
                            View Calendar
                            <ArrowRightIcon class="w-4 h-4" />
                        </router-link>
                        <router-link to="/trainings"
                            class="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0d2a1f] hover:bg-[#133d2e] border border-emerald-500/30 text-white rounded-xl font-semibold text-xs uppercase tracking-widest transition-all duration-300">
                            All Programs
                        </router-link>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script setup>
import {
    AcademicCapIcon,
    ArrowRightIcon,
    BuildingLibraryIcon,
    CheckCircleIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    EyeIcon,
    FlagIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserGroupIcon
} from '@heroicons/vue/24/outline';

const missions = [
    'To mainstream training in the process of governance.',
    'To maintain high standards of training programmes.',
    'To make training a holistic and inclusive activity.',
    'To maximize opportunities for systematic reforms.'
];

const objectives = [
    {
        title: 'Competency-Based Approach',
        desc: 'Adopt a structured, competency-based approach to training that aligns with contemporary administrative demands.'
    },
    {
        title: 'Professional Capacity Building',
        desc: 'Address the needs for developing professional knowledge, skills, and attitudes for an efficient and responsive civil service.'
    },
    {
        title: 'Inclusive & Continuous Learning',
        desc: 'Administer appropriate programmes to make training an ongoing, comprehensive, and inclusive developmental activity.'
    },
    {
        title: 'Governance Impact & Excellence',
        desc: 'Assess the effectiveness of training programmes on governance to achieve enduring institutional excellence.'
    }
];

const functions = [
    {
        text: 'Implement the State Training Policy across departments and administrative cadres.',
        icon: DocumentTextIcon
    },
    {
        text: 'Initiate a systematic approach to training and institutional development.',
        icon: Cog6ToothIcon
    },
    {
        text: 'Involve with various government departments to formulate annual training plans.',
        icon: UserGroupIcon
    },
    {
        text: 'Introduce appropriate training programmes and modern instructional methodologies.',
        icon: AcademicCapIcon
    },
    {
        text: 'Institutionalize good practices for ATI to be a benchmark model organization.',
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
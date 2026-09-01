<template>
    <div
        class="relative min-h-screen w-full font-sans selection:bg-emerald-500/30 bg-[#071a13] text-zinc-50 overflow-hidden">

        <!-- Atmospheric Background Grid & Glows -->
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

        <div class="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">

            <!-- Header Section -->
            <section class="space-y-1 max-w-3xl">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                    Contact <span
                        class="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 bg-clip-text text-transparent">Us</span>
                </h1>

                <p class="text-emerald-200/75 text-base md:text-lg leading-relaxed font-light">
                    Get in touch with the Administrative Training Institute for training program queries, admissions,
                    institutional coordination, and administrative assistance.
                </p>
            </section>

            <!-- Main Contact Details & Interactive Grid -->
            <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <!-- Contact Cards (Left 5 Cols) -->
                <div class="lg:col-span-5 space-y-5">

                    <!-- Address Card -->
                    <div
                        class="p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300 group">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <MapPinIcon class="w-6 h-6" />
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Office Address</p>
                                <h3 class="text-base font-bold text-white leading-tight">Administrative Training
                                    Institute</h3>
                                <p class="text-emerald-200/70 text-sm leading-relaxed pt-1">
                                    New Secretariat Complex, Khatla<br />
                                    Aizawl - 796001, Mizoram
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Phone & Fax Card -->
                    <div
                        class="p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 backdrop-blur-xl hover:border-teal-400/40 transition-all duration-300 group">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <PhoneIcon class="w-6 h-6" />
                            </div>
                            <div class="space-y-3 w-full">
                                <p class="text-xs font-bold text-teal-400 uppercase tracking-widest">Telephone & Fax
                                </p>
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-emerald-200/70 font-medium">Telephone:</span>
                                        <a href="tel:038922335830"
                                            class="text-white font-semibold hover:text-emerald-300 transition-colors">
                                            0389-22335830
                                        </a>
                                    </div>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-emerald-200/70 font-medium">Fax:</span>
                                        <span class="text-zinc-200 font-semibold">
                                            0389-22335831
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Email Card -->
                    <div
                        class="p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300 group">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <EnvelopeIcon class="w-6 h-6" />
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Email Address</p>
                                <a href="mailto:atimizoram@gmail.com"
                                    class="text-base font-semibold text-white hover:text-emerald-300 transition-colors block break-all">
                                    atimizoram@gmail.com
                                </a>
                                <p class="text-xs text-emerald-200/50">For general inquiries and correspondence</p>
                            </div>
                        </div>
                    </div>

                    <!-- Official Website Card -->
                    <div
                        class="p-6 rounded-2xl bg-[#0a2319]/80 border border-emerald-500/20 backdrop-blur-xl hover:border-green-400/40 transition-all duration-300 group">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <GlobeAltIcon class="w-6 h-6" />
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-bold text-green-400 uppercase tracking-widest">Official Portal
                                </p>
                                <a href="https://ati.mizoram.gov.in" target="_blank" rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 text-base font-semibold text-white hover:text-green-300 transition-colors">
                                    ati.mizoram.gov.in
                                    <ArrowTopRightOnSquareIcon
                                        class="w-4 h-4 text-emerald-400/60 group-hover:text-green-300 transition-colors" />
                                </a>
                                <p class="text-xs text-emerald-200/50">Official Government of Mizoram portal</p>
                            </div>
                        </div>
                    </div>

                    <!-- Working Hours Banner -->
                    <div
                        class="p-5 rounded-2xl bg-[#061811]/70 border border-emerald-500/15 flex items-center gap-3 text-xs text-emerald-200/70">
                        <ClockIcon class="w-5 h-5 text-emerald-400 shrink-0" />
                        <span><strong>Office Working Hours:</strong> Monday – Friday, 9:00 AM – 5:00 PM (Closed on State
                            Holidays)</span>
                    </div>

                </div>

                <!-- Google Map Section (Right 7 Cols) -->
                <div class="lg:col-span-7 space-y-4">
                    <div
                        class="relative group rounded-3xl overflow-hidden border border-emerald-500/20 bg-[#0a2319] shadow-2xl">
                        <!-- Glow Border -->
                        <div
                            class="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500 pointer-events-none">
                        </div>

                        <div class="relative z-10 w-full flex flex-col">
                            <!-- Map Header Bar -->
                            <div
                                class="px-6 py-4 bg-[#0a2319]/95 border-b border-emerald-500/20 flex items-center justify-between backdrop-blur-md">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span class="text-xs font-bold text-zinc-100 uppercase tracking-wider">Campus
                                        Location Map</span>
                                </div>
                                <a href="https://www.google.com/maps/search/?api=1&query=Administrative+Training+Institute+New+Secretariat+Complex+Khatla+Aizawl"
                                    target="_blank" rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                                    <span>Open in Google Maps</span>
                                    <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                                </a>
                            </div>

                            <!-- Map Embed Frame -->
                            <div class="w-full h-[460px] bg-[#071a13]">
                                <iframe title="ATI Mizoram Location Map"
                                    class="w-full h-full border-0 filter brightness-[0.88] contrast-[1.12]"
                                    src="https://maps.google.com/maps?q=Administrative+Training+Institute,+New+Secretariat+Complex,+Khatla,+Aizawl,+Mizoram+796001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    loading="lazy" allowfullscreen></iframe>
                            </div>

                            <!-- Map Footer Details -->
                            <div
                                class="p-4 bg-[#0a2319]/95 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-200/70 gap-2">
                                <p>📍 Khatla, New Secretariat Complex, Aizawl, Mizoram - 796001</p>
                                <span class="text-emerald-400 font-medium">Accessible via Khatla Road</span>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </div>
    </div>
</template>

<script setup>
import {
    ArrowTopRightOnSquareIcon,
    ClockIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    MapPinIcon,
    PhoneIcon
} from '@heroicons/vue/24/outline';
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
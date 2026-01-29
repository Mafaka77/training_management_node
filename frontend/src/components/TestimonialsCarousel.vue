<template>
  <q-section class="bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-8">What Our Trainees Say</h2>

      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        navigation
        navigation-position="bottom"
        control-color="primary"
        autoplay
        infinite
        transition-prev="slide-right"
        transition-next="slide-left"
        class="rounded-2xl shadow-md bg-white"
        height="250px"
      >
        <q-carousel-slide
          v-for="(t, i) in testimonials"
          :key="i"
          :name="i"
          class="flex flex-col items-center justify-center px-6"
        >
          <p class="text-gray-600 italic text-lg">"{{ t.quote }}"</p>
          <div class="mt-4 font-semibold text-primary">{{ t.name }}</div>
          <div class="text-sm text-gray-500">{{ t.role }}</div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-section>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(0)

const testimonials = [
  {
    name: "Amit Kumar",
    role: "Software Trainee",
    quote: "The training sessions were hands-on and practical. I feel confident about applying my skills."
  },
  {
    name: "Neha Sharma",
    role: "Web Developer",
    quote: "ATI has an amazing curriculum. The instructors were supportive and knowledgeable."
  },
  {
    name: "Rajesh Singh",
    role: "Data Analyst",
    quote: "Loved the structure of the program. The projects really helped me learn."
  }
]
</script>

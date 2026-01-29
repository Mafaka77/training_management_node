<template>
  <q-page class="landing-page">

    <!-- Hero Section -->
     <section class="hero-section relative flex flex-center column text-center text-white">
    <!-- Background Carousel -->
    <q-carousel
      v-model="slide"
      animated
      infinite
      class="absolute-full"
      control-color="white"
      arrows
      height="100%"
    >
      <q-carousel-slide v-for="(img, i) in slides" :key="i" :name="i">
        <img :src="img" class="absolute-full fit-cover" />
      </q-carousel-slide>
    </q-carousel>

    <!-- Hero Content -->
    <div class="hero-content z-index-10">
      <div class="text-h2 text-weight-bold q-mb-md">Grow with Knowledge</div>
      <div class="text-subtitle1 q-mb-lg">
        Learn from top mentors, explore trending courses, and shape your future with us.
      </div>
      <q-btn unelevated no-caps class="btn-primary" label="Get Started" icon="school" />
    </div>
  </section>

    <!-- Features -->
    <section class="section bg-white">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">Our Features</div>
      <div class="row q-col-gutter-xxl q-mt-lg justify-center">
        <q-card v-for="(feature, i) in features" :key="i" class="col-12 col-md-3 shadow-2 feature-card q-mb-xl">
          <q-card-section class="text-center">
            <q-icon :name="feature.icon" size="40px" class="text-primary q-mb-md" />
            <div class="text-subtitle1 text-weight-medium">{{ feature.title }}</div>
            <div class="text-caption text-grey-7">{{ feature.desc }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- Popular Courses -->
    <section class="section bg-light">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">Popular Courses</div>
      <div class="row q-col-gutter-xl q-mt-lg justify-center">
        <q-card v-for="(course, i) in courses" :key="i" class="col-12 col-md-3 shadow-2 course-card q-mb-xl">
          <q-img :src="course.image" :alt="course.title" ratio="16/9" />
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium">{{ course.title }}</div>
            <div class="text-caption text-grey-7">{{ course.desc }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>


    <!-- Mentors -->
    <section class="section bg-white">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">Meet Our Mentors</div>
      <div class="row q-col-gutter-lg justify-center">
        <q-card v-for="(mentor, i) in mentors" :key="i" class="col-12 col-md-3 shadow-2 mentor-card">
          <q-img :src="mentor.image" :alt="mentor.name" ratio="1" />
          <q-card-section class="text-center">
            <div class="text-subtitle1 text-weight-medium">{{ mentor.name }}</div>
            <div class="text-caption">{{ mentor.title }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section bg-light">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">FAQ</div>
      <q-list bordered class="rounded-borders" style="max-width: 800px; margin: 0 auto;">
        <q-expansion-item v-for="(faq, i) in faqs" :key="i" :label="faq.q" expand-icon="help"
          header-class="text-primary">
          <div class="q-pa-sm text-grey-7">{{ faq.a }}</div>
        </q-expansion-item>
      </q-list>
    </section>

    <!-- Testimonials -->
    <section class="section bg-white">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">What Our Learners Say</div>
      <div class="row q-col-gutter-lg justify-center">
        <q-card v-for="(testi, i) in testimonials" :key="i" class="col-12 col-md-3 shadow-2 testi-card">
          <q-card-section>
            <div class="text-subtitle2">"{{ testi.feedback }}"</div>
            <div class="text-caption text-grey-7 q-mt-sm">- {{ testi.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- Visitors Chart -->
    <section class="section bg-light">
      <div class="text-h4 text-center text-weight-bold q-mb-xl">Visitors Overview</div>
      <div style="max-width: 700px; margin: 0 auto;">
        <q-card class="shadow-2 rounded-borders q-pa-md">
          <Bar :data="chartData" :options="chartOptions" />
        </q-card>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer-section text-white">
      <div class="row justify-between items-center">
        <div>
          <div class="text-h6">EduGarden</div>
          <div class="text-caption text-grey-5">Grow with Knowledge</div>
        </div>
        <div class="row q-gutter-md">
          <q-btn flat round dense icon="facebook" class="text-white" />
          <q-btn flat round dense icon="twitter" class="text-white" />
          <q-btn flat round dense icon="linkedin" class="text-white" />
        </div>
      </div>
      <div class="text-caption text-grey-6 text-center q-mt-md">
        © 2025 EduGarden. All Rights Reserved.
      </div>
    </footer>

  </q-page>
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { ref } from 'vue'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const slide = ref(0)
const slides = [
  '/images/banner1.jpg',
  '/images/banner2.jpg',
  '/images/banner3.jpg',
  '/images/banner4.jpg'
]
const features = [
  { icon: 'school', title: 'Expert Mentors', desc: 'Learn from industry experts with real-world experience.' },
  { icon: 'computer', title: 'Interactive Courses', desc: 'Engaging courses with quizzes, projects, and more.' },
  { icon: 'trending_up', title: 'Career Growth', desc: 'Upgrade your skills and boost your career.' }
]

const courses = [
  { title: 'Web Development', desc: 'Learn full-stack web dev.', image: 'https://via.placeholder.com/300x180' },
  { title: 'Data Science', desc: 'Master data analysis & ML.', image: 'https://via.placeholder.com/300x180' },
  { title: 'UI/UX Design', desc: 'Design beautiful interfaces.', image: 'https://via.placeholder.com/300x180' }
]

const mentors = [
  { name: 'Dr. A. Mentor', title: 'AI Specialist', image: 'https://via.placeholder.com/300' },
  { name: 'Jane Doe', title: 'Web Developer', image: 'https://via.placeholder.com/300' },
  { name: 'John Smith', title: 'Data Scientist', image: 'https://via.placeholder.com/300' }
]

const faqs = [
  { q: 'How do I enroll in a course?', a: 'Simply click on enroll and follow the instructions.' },
  { q: 'Are courses self-paced?', a: 'Yes, most of our courses are self-paced.' },
  { q: 'Do I get a certificate?', a: 'Yes, you will receive a certificate after completion.' }
]

const testimonials = [
  { name: 'Alice', feedback: 'Amazing platform! Learned so much.' },
  { name: 'Bob', feedback: 'The mentors are really helpful.' },
  { name: 'Charlie', feedback: 'Best investment for my career.' }
]

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Visitors',
      backgroundColor: '#4e805e',
      data: [300, 450, 500, 700, 650]
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#365f5b' } },
    title: {
      display: true,
      text: 'Monthly Visitors',
      color: '#291E00'
    }
  },
  scales: {
    x: { 
      type: 'category', // Explicitly set scale type
      ticks: { color: '#291E00' } 
    },
    y: { 
      type: 'linear', // Explicitly set scale type
      ticks: { color: '#291E00' } 
    }
  }
}
</script>

<style lang="scss" scoped>
/* General Sections */
.section {
  padding: 80px 20px;
}
.hero-section {
  height: 500px; /* adjust as needed */
  position: relative;
  overflow: hidden;
}
.hero-content {
  position: relative;
  z-index: 10;
}
.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.fit-cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
/* Hero */
.hero-section {
  background: linear-gradient(rgba(78, 128, 94, 0.9), rgba(78, 128, 94, 0.9)), url('https://via.placeholder.com/1600x600') center/cover no-repeat;
  padding: 120px 20px;
}

.hero-content {
  max-width: 700px;
}

/* Cards */
.feature-card,
.course-card,
.mentor-card,
.testi-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}

.feature-card:hover,
.course-card:hover,
.mentor-card:hover,
.testi-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Custom Button */
.btn-primary {
  background-color: #291E00 !important;
  color: #fff !important;
  border-radius: 8px;
  padding: 12px 28px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: #4e805e !important;
}

/* Footer */
.footer-section {
  background-color: #171c1d;
  padding: 60px 20px;
  margin-top: 40px;
}
</style>

<template>
  <div class="bar-chart-wrapper">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register everything needed for bar chart
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true }
});

const canvas = ref(null);
let chartInstance = null;

onMounted(() => {
  if (canvas.value) {
    chartInstance = new Chart(canvas.value, {
      type: "bar",
      data: props.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Enrollments Last 7 Days", color: "#2c3e50" },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#2c3e50" },
            grid: { color: "#e0e0e0" }
          },
          x: {
            ticks: { color: "#2c3e50" },
            grid: { color: "#f5f5f5" }
          }
        },
        elements: {
          bar: {
            borderRadius: 6, // Rounded bars
            borderSkipped: false
          }
        }
      }
    });
  }
});

// Watch for data updates
watch(
  () => props.data,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData;
      chartInstance.update();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.bar-chart-wrapper {
  height: 300px; /* fits nicely in Quasar card */
  width: 100%;
}
canvas {
  /* optional: smooth rendering */
  display: block;
}
</style>

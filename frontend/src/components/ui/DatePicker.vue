<template>
    <div class="w-full relative" ref="datePickerRef">

        <!-- Label -->
        <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>

        <!-- Input Trigger -->
        <div class="relative cursor-pointer" @click="!disabled && toggleCalendar()">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </span>
            <input :id="id" type="text" readonly :value="formattedDate" :placeholder="placeholder" :required="required"
                :disabled="disabled" :class="[
                    'pl-10 cursor-pointer bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                    error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600',
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                ]" />
        </div>

        <!-- Error Text -->
        <p v-if="error" class="mt-1 text-xs text-red-600 dark:text-red-500">
            {{ error }}
        </p>

        <!-- Invisible Backdrop -->
        <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40"></div>

        <!-- Calendar Popover -->
        <div v-if="isOpen"
            class="absolute z-50 mt-2 w-72 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl transform opacity-100 scale-100 transition-all origin-top-left">

            <!-- Header / Quick Selectors -->
            <div class="flex items-center justify-between mb-4 gap-2">
                <button @click="changeMonth(-1)" type="button"
                    class="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- Quick Jump Selectors -->
                <div class="flex flex-1 gap-1">
                    <select v-model="currentMonth"
                        class="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white cursor-pointer outline-none appearance-none text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-1">
                        <option v-for="(name, index) in monthNames" :key="name" :value="index"
                            class="text-gray-900 dark:bg-gray-800 dark:text-white">
                            {{ name.substring(0, 3) }}
                        </option>
                    </select>

                    <select v-model="currentYear"
                        class="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white cursor-pointer outline-none appearance-none text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-1">
                        <option v-for="year in yearRange" :key="year" :value="year"
                            class="text-gray-900 dark:bg-gray-800 dark:text-white">
                            {{ year }}
                        </option>
                    </select>
                </div>

                <button @click="changeMonth(1)" type="button"
                    class="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Days of Week -->
            <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in daysOfWeek" :key="day"
                    class="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {{ day }}
                </div>
            </div>

            <!-- Dates Grid -->
            <div class="grid grid-cols-7 gap-1">
                <!-- Blank spaces for start of month -->
                <div v-for="blank in blankDays" :key="'blank-' + blank" class="h-8"></div>

                <!-- Actual Days -->
                <button v-for="date in daysInMonth" :key="date" @click="selectDate(date)" type="button" :class="[
                    'h-8 w-full rounded-lg text-sm font-medium transition-all flex items-center justify-center',
                    isSelectedDate(date)
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isToday(date)
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]">
                    {{ date }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Date, null],
        default: null
    },
    id: String,
    label: String,
    placeholder: {
        type: String,
        default: 'Select a date'
    },
    error: String,
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

// State
const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Constants
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// --- Logic & Calculations ---

// Generate a reasonable range of years (e.g., 100 years back, 10 years forward)
const yearRange = computed(() => {
    const currentYr = new Date().getFullYear();
    const years = [];
    // Start from 100 years ago up to 10 years in the future
    for (let i = currentYr - 100; i <= currentYr + 50; i++) {
        years.push(i);
    }
    // Reverse it so most recent/current years are closer to the top of the dropdown
    return years.reverse();
});

const syncCalendarWithSelection = () => {
    if (props.modelValue) {
        const d = new Date(props.modelValue);
        if (!isNaN(d.getTime())) {
            currentMonth.value = d.getMonth();
            currentYear.value = d.getFullYear();
        }
    }
};

onMounted(() => {
    syncCalendarWithSelection();
});

watch(() => props.modelValue, () => {
    syncCalendarWithSelection();
});

const toggleCalendar = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) syncCalendarWithSelection();
};

const changeMonth = (step) => {
    let newMonth = currentMonth.value + step;
    if (newMonth < 0) {
        newMonth = 11;
        currentYear.value--;
    } else if (newMonth > 11) {
        newMonth = 0;
        currentYear.value++;
    }
    currentMonth.value = newMonth;
};

// Returns number of days in the current viewing month
const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

// Returns empty slots before the 1st of the month
const blankDays = computed(() => {
    return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Format the selected date for the input field display
const formattedDate = computed(() => {
    if (!props.modelValue) return '';
    const d = new Date(props.modelValue);
    if (isNaN(d.getTime())) return '';

    const day = d.getDate();
    const suffix = ["th", "st", "nd", "rd"][
        day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10
    ] || "th";

    return `${day}${suffix} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
});

// Handlers
const selectDate = (date) => {
    // Construct date using UTC so the local timezone doesn't shift the day backwards
    const selected = new Date(Date.UTC(currentYear.value, currentMonth.value, date));

    // Emit purely as YYYY-MM-DD
    emit('update:modelValue', selected.toISOString().split('T')[0]);
    isOpen.value = false;
};

const isSelectedDate = (date) => {
    if (!props.modelValue) return false;
    const d = new Date(props.modelValue);
    return d.getUTCDate() === date && d.getUTCMonth() === currentMonth.value && d.getUTCFullYear() === currentYear.value;
};

const isToday = (date) => {
    const today = new Date();
    return date === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
};
</script>

<style scoped>
/* Hide the default dropdown arrow so it looks cleaner next to each other */
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';
}

/* For IE */
select::-ms-expand {
    display: none;
}
</style>
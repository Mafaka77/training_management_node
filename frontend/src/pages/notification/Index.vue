<template>
    <div>
        <h1>Notification</h1>
        <ul>
            <li v-for="notification in notifications" :key="notification.id">
                {{ notification.title }}
            </li>
        </ul>
    </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '../../store/alertStore';
import { useNotificationStore } from '../../store/notificationStore';
const alert = useAlertStore()
const store = useNotificationStore();

const { notifications } = storeToRefs(store)
</script>
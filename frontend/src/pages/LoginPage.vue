<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card q-pa-lg shadow-2">
      <!-- Logo & Welcome -->
      <q-card-section class="text-center">
        <q-avatar size="64px" class="q-mb-md">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="Quasar Logo">
        </q-avatar>
        <div class="text-h6">Welcome to SmartATI 👋</div>
        <div class="text-subtitle2 text-grey-7 q-mt-sm">
          Please sign-in to your account and start the adventure
        </div>
      </q-card-section>

      <!-- Inputs -->
      <q-card-section>
        <q-input v-model="email" label="Email OR Username" dense outlined class="q-mb-md" />
        <q-input v-model="password" label="Password" dense outlined type="password" />

        <div class="row items-center q-mt-sm">
          <q-checkbox v-model="rememberMe" label="Remember Me" />
          <q-space />
          <q-btn flat color="primary" label="Forgot Password?" size="sm" @click="handleForgot" />
        </div>
      </q-card-section>

      <!-- Sign in Button -->
      <q-card-actions>
        <q-btn
          label="Sign In"
          color="primary"
          class="full-width"
          @click="handleLogin"
          :loading="loading"
        />
      </q-card-actions>

      <!-- Signup Link -->
      <q-card-section class="text-center text-caption q-mt-md">
        New on our platform?
        <q-btn flat dense color="primary" label="Create An Account" @click="goToSignup" />
      </q-card-section>

      <!-- Divider -->
      <q-separator spaced />

      <!-- Social Logins -->
      <q-card-section class="text-center">
        <q-btn flat round icon="mdi-facebook" size="sm" class="q-mx-sm" />
        <q-btn flat round icon="mdi-google" size="sm" class="q-mx-sm" />
        <q-btn flat round icon="mdi-twitter" size="sm" class="q-mx-sm" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { Notify } from "quasar";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  try {
    loading.value = true;
    let response = await userStore.login(email.value, password.value);
    if (response.success === false) {
      Notify.create({ type: "negative", message: response.message });
    } else {
      const role = response.data.user.roles[0];
      if (role === "Admin") {
        router.push("/admin/dashboard");
      } else if (role === "Trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/");
      }
    }
  } catch (err) {
    Notify.create({ type: "negative", message: err.message || "Login failed" });
  } finally {
    loading.value = false;
  }
};

const handleForgot = () => {
  router.push("/forgot-password");
};

const goToSignup = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background: #f9f9fc;
}
.login-card {
  width: 400px;
  max-width: 90vw;
}
</style>

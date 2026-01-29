<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Expanded Desktop Navigation -->
    <q-header elevated class="bg-primary expanded-nav floating-header text-white">
      <q-toolbar class="q-px-xl">
        <!-- Logo -->
        <q-toolbar-title class="logo">
          ATI Training
        </q-toolbar-title>

        <!-- Desktop Navigation Links -->
        <div class="desktop-links row items-center q-gutter-xl">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/courses" class="nav-link">Courses</router-link>
          <router-link to="/mentors" class="nav-link">Mentors</router-link>
          <router-link to="/resources" class="nav-link">Resources</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>

        <!-- Login Button and Hamburger -->
        <div class="row items-center">
          <q-btn unelevated label="LOGIN" to="/login" color="primary" class="login-btn q-mr-md" />
          <q-btn 
            flat 
            round 
            dense 
            :icon="menuOpen ? 'close' : 'menu'" 
            class="hamburger" 
            @click="toggleMenu"
          />
        </div>
      </q-toolbar>

      <!-- Mobile Navigation Links -->
      <div :class="['nav-links', menuOpen ? 'expanded' : '']">
        <div class="column q-pa-md">
          <router-link to="/" class="nav-link q-py-sm" @click="closeMenu">Home</router-link>
          <router-link to="/courses" class="nav-link q-py-sm" @click="closeMenu">Courses</router-link>
          <router-link to="/mentors" class="nav-link q-py-sm" @click="closeMenu">Mentors</router-link>
          <router-link to="/resources" class="nav-link q-py-sm" @click="closeMenu">Resources</router-link>
          <router-link to="/about" class="nav-link q-py-sm" @click="closeMenu">About</router-link>
          <q-btn unelevated label="LOGIN" to="/login" color="primary" class="q-mt-md mobile-login-btn" @click="closeMenu" />
        </div>
      </div>
    </q-header>

    <!-- Page container -->
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-8 text-white text-center q-pa-md">
      © 2025 ATI Training Platform
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};
</script>

<style scoped>
/* Expanded desktop navigation styles */

.floating-header {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1200px;
  border-radius: 12px;
  /* box-shadow: 0 4px 12px rgba(78, 128, 94, 1); */
  z-index: 1000;
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s;
  width: calc(100% - 40px);
}
.floating-header:hover {
  box-shadow: 0 8px 20px rgba(78, 128, 94, 1);
}

.expanded-nav {
  /* box-shadow: 0 2px 15px rgba(78, 128, 94, 1); */
  border-bottom: 1px solid #4E805E;
}

.logo {
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

.nav-link {
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-link:hover {
  color: #1976d2;
  background-color: #f0f5ff;
}

.nav-link.router-link-active {
  color: #ffffff;
  background-color: #363331;
}

.login-btn {
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 6px;
}

.mobile-login-btn {
  width: 100%;
}

.hamburger {
  display: none;
}

.nav-links {
  transition: max-height 0.3s ease;
  background: white;
  display: none;
}

@media (max-width: 1024px) {
  .expanded-nav .q-toolbar {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .desktop-links {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .desktop-links {
    display: none;
  }
  
  .hamburger {
    display: block;
  }
  
  .nav-links {
    display: block;
    max-height: 0;
    overflow: hidden;
  }
  
  .nav-links.expanded {
    max-height: 400px;
    border-top: 1px solid #e0e0e0;
  }
  
  .login-btn {
    display: none;
  }
}

/* Adjust page container to account for nav */
.q-page-container {
  padding-top: 0;
}
</style>
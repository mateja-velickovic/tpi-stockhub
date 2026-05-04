<template>
  <div class="flex min-h-screen bg-gray-50">
    <AppSidebar :open="sidebarOpen" />
    <div class="flex-1 flex flex-col">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
import { useAuthStore } from '@/stores/auth.store';

const sidebarOpen = ref(false);
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchProfile();
  }
});
</script>

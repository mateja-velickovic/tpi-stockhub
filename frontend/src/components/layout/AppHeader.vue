<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <button
        class="text-gray-500 hover:text-gray-700 lg:hidden"
        @click="$emit('toggle-sidebar')"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-semibold text-gray-800">
        StockHub
      </h1>
    </div>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">{{ user?.username }}</span>
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="user?.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
      >
        {{ user?.role }}
      </span>
      <button
        class="text-sm text-gray-500 hover:text-red-600 transition-colors"
        @click="handleLogout"
      >
        Déconnexion
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineEmits(['toggle-sidebar']);

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

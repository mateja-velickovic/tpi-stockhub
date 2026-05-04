<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg
            class="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">
          StockHub
        </h1>
        <p class="text-gray-500 mt-1">
          Gestion d'inventaire
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form
          class="space-y-5"
          @submit.prevent="handleLogin"
        >
          <div
            v-if="error"
            class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            {{ error }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="admin@stockhub.ch"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (err: unknown) {
    const e = err as { response?: { data?: { error?: string } } };
    error.value = e.response?.data?.error || 'Erreur de connexion';
  } finally {
    loading.value = false;
  }
}
</script>

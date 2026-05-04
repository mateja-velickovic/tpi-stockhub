import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, LoginCredentials } from '@/types';
import { authApi } from '@/services/api.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  async function login(credentials: LoginCredentials) {
    const response = await authApi.login(credentials);
    user.value = response.data.user;
    token.value = response.data.token;
    localStorage.setItem('token', response.data.token);
  }

  async function fetchProfile() {
    const response = await authApi.profile();
    user.value = response.data.user;
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, login, fetchProfile, logout };
});

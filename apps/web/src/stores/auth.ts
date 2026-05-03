import { defineStore } from 'pinia';
import axios from 'axios';
import { User } from '@retro/models';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: true
  }),
  actions: {
    async fetchUser() {
      this.loading = true;
      try {
        const response = await api.get('/api/me');
        this.user = response.data;
      } catch (error) {
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await api.post('/auth/logout');
        this.user = null;
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout failed', error);
      }
    },
    loginWithGoogle() {
      window.location.href = 'http://localhost:4000/auth/google';
    }
  }
});

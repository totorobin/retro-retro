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
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const parts = cookie.trim().split('=');
          if (parts.length === 2) {
            acc[parts[0]] = parts[1];
          }
          return acc;
        }, {} as Record<string, string>);

        const mockUserId = cookies['mock_user_id'];
        const params = mockUserId ? { mock_user_id: mockUserId } : {};
        console.log('fetchUser - sending request to /api/me with params:', params);
        const response = await api.get('/api/me', { params });
        console.log('fetchUser - response:', response.data);
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

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useTheme } from './composables/useTheme';

const auth = useAuthStore();
const { } = useTheme();

onMounted(() => auth.fetchUser());
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; padding: 0; }
.retro-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9em;
}
.retro-button:hover { filter: brightness(1.1); }
.retro-button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

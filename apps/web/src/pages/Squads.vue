<template>
  <div class="squads-container">
    <div class="squads-header">
      <span class="app-logo">🔄 Retro-Retro</span>
    </div>

    <div class="squads-body">
      <div v-if="squads.length > 0" class="my-squads">
        <h2>Mes Squads</h2>
        <ul class="squad-list">
          <li v-for="squad in squads" :key="squad.id" class="squad-item">
            <span class="squad-name">{{ squad.name }}</span>
            <span v-if="auth.user && squad.adminId === auth.user.id" class="squad-role">Admin</span>
            <button class="retro-button" @click="router.push(`/squads/${squad.id}`)">Accéder</button>
          </li>
        </ul>
      </div>

      <div class="join-create">
        <div class="section">
          <h2>Rejoindre une Squad</h2>
          <div class="form-row">
            <input v-model="joinId" placeholder="ID de la Squad" @keydown.enter="joinSquad" />
            <button class="retro-button" @click="joinSquad" :disabled="!joinId.trim()">Rejoindre</button>
          </div>
        </div>
        <div class="section">
          <h2>Créer une nouvelle Squad</h2>
          <div class="form-row">
            <input v-model="newSquadName" placeholder="Nom de la Squad" @keydown.enter="createSquad" />
            <button class="retro-button" @click="createSquad" :disabled="creating || !newSquadName.trim()">Créer</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { Squad } from '@retro/models';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const squads = ref<Squad[]>([]);
const newSquadName = ref('');
const joinId = ref('');
const creating = ref(false);
const error = ref('');

const api = axios.create({ baseURL: 'http://localhost:4000', withCredentials: true });

async function fetchSquads() {
  try {
    const res = await api.get('/api/squads');
    squads.value = res.data;
    if (squads.value.length > 0) router.replace(`/squads/${squads.value[0].id}`);
  } catch (e) {
    console.error('Failed to fetch squads', e);
  }
}

async function joinSquad() {
  const id = joinId.value.trim();
  if (!id) return;
  try {
    await api.post(`/api/squads/${id}/join`);
    router.push(`/squads/${id}`);
  } catch (e) {
    error.value = 'Impossible de rejoindre cette squad. Vérifiez l\'ID.';
  }
}

async function createSquad() {
  if (!newSquadName.value.trim()) return;
  creating.value = true;
  try {
    const res = await api.post('/api/squads', { name: newSquadName.value.trim() });
    router.push(`/squads/${res.data.id}`);
  } catch (e) {
    error.value = 'Erreur lors de la création de la squad.';
  } finally {
    creating.value = false;
  }
}

onMounted(async () => {
  const joinParam = route.params.id as string;
  if (joinParam && route.path.includes('/join/')) {
    try {
      await api.post(`/api/squads/${joinParam}/join`);
      router.replace(`/squads/${joinParam}`);
      return;
    } catch (e) {
      error.value = 'Impossible de rejoindre cette squad.';
    }
  }
  await fetchSquads();
});
</script>

<style scoped>
.squads-container { min-height: 100vh; background: var(--bg-color); display: flex; flex-direction: column; }
.squads-header { padding: 16px 24px; background: var(--header-bg); border-bottom: 1px solid var(--border-color); }
.app-logo { font-size: 1.2em; font-weight: bold; color: var(--primary-color); }
.squads-body { max-width: 640px; width: 100%; margin: 40px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 32px; }
.my-squads h2, .join-create h2 { margin: 0 0 12px; color: var(--text-color); font-size: 1em; }
.squad-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.squad-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 6px; }
.squad-name { flex: 1; font-weight: 500; color: var(--text-color); }
.squad-role { font-size: 0.75em; background: var(--primary-color); color: white; border-radius: 10px; padding: 2px 8px; }
.join-create { display: flex; flex-direction: column; gap: 20px; }
.section { background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; }
.form-row { display: flex; gap: 8px; }
.form-row input { flex: 1; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-color); color: var(--text-color); font-size: 0.9em; }
.error-msg { color: #e74c3c; text-align: center; padding: 8px; }
</style>

<template>
  <div class="squads-container">
    <h1>Mes Squads</h1>
    
    <div v-if="squads.length === 0" class="no-squads">
      <p>Vous n'appartenez à aucune squad pour le moment.</p>
    </div>
    <ul v-else class="squad-list">
      <li v-for="squad in squads" :key="squad.id" class="squad-item">
        <span class="squad-name">{{ squad.name }}</span>
        <span class="squad-id" style="font-size: 0.8em; color: #888;">#{{ squad.id }}</span>
        <span v-if="auth.user && squad.adminId === auth.user.id" class="squad-role">Admin</span>
        <button @click="goToSquad(squad.id)">Entrer</button>
      </li>
    </ul>

    <div class="create-squad">
      <h2>Créer une nouvelle Squad</h2>
      <form @submit.prevent="createSquad">
        <input v-model="newSquadName" placeholder="Nom de la Squad (ex: Squad Innovation)" required />
        <button type="submit" :disabled="creating">Créer</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { Squad } from '@retro/models';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const squads = ref<Squad[]>([]);
const newSquadName = ref('');
const creating = ref(false);
const router = useRouter();
const route = useRoute();

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
});

const fetchSquads = async () => {
  try {
    const response = await api.get('/api/squads');
    squads.value = response.data;
  } catch (error) {
    console.error('Failed to fetch squads', error);
  }
};

const handleJoin = async () => {
  const squadId = route.params.id as string;
  if (route.path.includes('/join/') && squadId) {
    try {
      await api.post(`/api/squads/${squadId}/join`);
      await fetchSquads();
      router.push('/squads');
    } catch (error) {
      console.error('Failed to join squad', error);
    }
  }
};

const createSquad = async () => {
  if (!newSquadName.value) return;
  creating.value = true;
  try {
    const response = await api.post('/api/squads', { name: newSquadName.value });
    squads.value.push(response.data);
    newSquadName.value = '';
    // Rediriger vers la page d'accueil de la squad
    router.push(`/board/${response.data.id}`); // Temporaire, simuler redirection vers board
  } catch (error) {
    console.error('Failed to create squad', error);
  } finally {
    creating.value = false;
  }
};

const goToSquad = (id: string) => {
  // router.push(`/squads/${id}`);
  console.log('Go to squad', id);
};

onMounted(async () => {
  await fetchSquads();
  await handleJoin();
});
</script>

<style scoped>
.squads-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

.squad-list {
  list-style: none;
  padding: 0;
}

.squad-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.create-squad {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
}
</style>

<template>
  <div id="app">
    <header v-if="auth.user" class="header">
      <div class="logo">Retro-Retro</div>
      <div class="menu-burger" @click="showMenu = !showMenu" title="Ouvrir le menu">
        ☰
      </div>
      <div v-if="showMenu" class="dropdown-menu">
        <div class="user-info">
          {{ auth.user.firstName }} {{ auth.user.lastName }}
        </div>
        <hr />
        <router-link to="/squads" @click="showMenu = false">Mes Squads</router-link>
        <!-- Liste des squads pour basculer (Scénario: Basculer vers une autre Squad) -->
        <div v-for="squad in squads" :key="squad.id" class="squad-link" @click="switchSquad(squad.id)">
          {{ squad.name }}
        </div>
        <hr />
        <button @click="logout">Se déconnecter</button>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Squad } from '@retro/models';

const auth = useAuthStore();
const router = useRouter();
const showMenu = ref(false);
const squads = ref<Squad[]>([]);

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
});

const fetchSquads = async () => {
  if (auth.user) {
    try {
      const response = await api.get('/api/squads');
      squads.value = response.data;
    } catch (error) {
      console.error(error);
    }
  }
};

const logout = async () => {
  showMenu.value = false;
  await auth.logout();
};

const switchSquad = (id: string) => {
  showMenu.value = false;
  router.push(`/board/${id}`);
  console.log('Switch to squad', id);
};

onMounted(async () => {
  await auth.fetchUser();
  if (auth.user) {
    fetchSquads();
  }
});

watch(() => auth.user, (newUser) => {
  if (newUser) fetchSquads();
});
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #333;
  color: white;
  position: relative;
}

.menu-burger {
  font-size: 24px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  color: black;
  border: 1px solid #ccc;
  width: 200px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-menu a, .dropdown-menu .squad-link, .dropdown-menu button {
  padding: 10px;
  text-decoration: none;
  color: black;
  text-align: left;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
}

.dropdown-menu a:hover, .dropdown-menu .squad-link:hover, .dropdown-menu button:hover {
  background: #eee;
}

.user-info {
  padding: 10px;
  font-weight: bold;
}
</style>

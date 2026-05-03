<template>
  <div class="burger-wrapper">
    <button class="burger-btn menu-burger" @click="open = !open" title="Menu">☰</button>
    <div v-if="open" class="dropdown" v-click-outside="close">
      <div class="user-info">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</div>
      <hr />
      <div class="section-label">Mes Squads</div>
      <button v-for="squad in squads" :key="squad.id" class="menu-item squad-link"
              :class="{ active: currentSquad?.id === squad.id }"
              @click="switchSquad(squad.id)">
        {{ squad.name }}
      </button>
      <hr />
      <button class="menu-item" @click="emit('join-squad')">Rejoindre une Squad</button>
      <button class="menu-item" @click="emit('create-squad')">Créer une Squad</button>
      <hr />
      <button v-if="currentSquad" class="menu-item danger" @click="leaveCurrentSquad">Quitter la Squad</button>
      <button class="menu-item" @click="toggleThemeAndClose">
        {{ theme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre' }}
      </button>
      <hr />
      <button class="menu-item" @click="logoutAndClose">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Squad } from '@retro/models';
import { useAuthStore } from '../stores/auth';
import { useSquadStore } from '../stores/squad';
import { useTheme } from '../composables/useTheme';

const props = defineProps<{ squads: Squad[]; currentSquad: Squad | null }>();
const emit = defineEmits<{ 'join-squad': []; 'create-squad': [] }>();

const router = useRouter();
const auth = useAuthStore();
const squadStore = useSquadStore();
const { theme, toggleTheme } = useTheme();
const open = ref(false);

function close() { open.value = false; }

function switchSquad(id: string) {
  close();
  router.push(`/squads/${id}`);
}

async function leaveCurrentSquad() {
  if (!props.currentSquad) return;
  close();
  await squadStore.leaveSquad(props.currentSquad.id);
  router.push('/squads');
}

function toggleThemeAndClose() { toggleTheme(); close(); }

async function logoutAndClose() {
  close();
  await auth.logout();
}

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.__clickOutside = (e: MouseEvent) => { if (!el.contains(e.target as Node)) binding.value(); };
    document.addEventListener('click', el.__clickOutside);
  },
  unmounted(el: HTMLElement) { document.removeEventListener('click', el.__clickOutside); }
};
</script>

<style scoped>
.burger-wrapper { position: relative; }
.burger-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--text-color); padding: 4px 8px; }
.dropdown { position: absolute; top: 100%; left: 0; background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 6px; min-width: 200px; z-index: 1000; box-shadow: 0 4px 16px rgba(0,0,0,0.15); padding: 4px 0; }
.section-label { padding: 6px 14px; font-size: 0.75em; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
.menu-item { display: block; width: 100%; padding: 8px 14px; background: none; border: none; text-align: left; cursor: pointer; color: var(--text-color); font-size: 0.9em; }
.menu-item:hover { background: var(--bg-color); }
.menu-item.active { font-weight: bold; color: var(--primary-color); }
.menu-item.danger { color: #e74c3c; }
hr { border: none; border-top: 1px solid var(--border-color); margin: 4px 0; }
</style>

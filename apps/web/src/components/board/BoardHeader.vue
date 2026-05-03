<template>
  <header class="board-header">
    <div class="header-left">
      <div class="burger-wrapper">
        <button class="burger-btn menu-burger" @click="menuOpen = !menuOpen" title="Menu">☰</button>
        <div v-if="menuOpen" class="dropdown">
          <button class="menu-item" @click="emit('exit')">← Quitter le board</button>
          <button class="menu-item" @click="copyShareLink">🔗 Lien de partage</button>
          <button class="menu-item" @click="toggleThemeAndClose">
            {{ theme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre' }}
          </button>
          <button class="menu-item" @click="emit('open-timer'); menuOpen = false">⏱ Timer</button>
        </div>
      </div>
      <h2 class="board-title">{{ board?.title }}</h2>
    </div>

    <div v-if="isOwner" class="mode-switch">
      <button :class="['mode-btn', { active: mode === BoardMode.Creation }]"
              @click="emit('toggle-mode')">Création</button>
      <button :class="['mode-btn', { active: mode === BoardMode.Presentation }]"
              @click="emit('toggle-mode')">Présentation</button>
    </div>

    <div class="user-list">
      <div v-for="user in connectedUsers" :key="user.id" class="user-avatar"
           :title="`${user.firstName} ${user.lastName}`"
           :class="{ highlighted: highlightedUserId === user.id }"
           @click="emit('toggle-highlight', user.id)">
        <img v-if="user.picture" :src="user.picture" :alt="user.firstName" />
        <span v-else>{{ user.firstName[0] }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Board, User, BoardMode } from '@retro/models';
import { useTheme } from '../../composables/useTheme';

const props = defineProps<{
  board: Board | null;
  isOwner: boolean;
  mode: BoardMode;
  connectedUsers: User[];
  highlightedUserId: string | null;
}>();

const emit = defineEmits<{
  exit: [];
  'toggle-mode': [];
  'toggle-highlight': [userId: string];
  'open-timer': [];
}>();

const menuOpen = ref(false);
const { theme, toggleTheme } = useTheme();

function toggleThemeAndClose() { toggleTheme(); menuOpen.value = false; }

function copyShareLink() {
  navigator.clipboard.writeText(window.location.href);
  menuOpen.value = false;
}
</script>

<style scoped>
.board-header { position: absolute; top: 0; left: 0; right: 0; height: 50px; background: var(--header-bg); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; padding: 0 16px; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
.header-left { display: flex; align-items: center; gap: 10px; flex: 1; }
.burger-wrapper { position: relative; }
.burger-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-color); padding: 4px; }
.dropdown { position: absolute; top: 100%; left: 0; background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 6px; min-width: 200px; z-index: 200; box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.menu-item { display: block; width: 100%; padding: 9px 14px; background: none; border: none; text-align: left; cursor: pointer; color: var(--text-color); font-size: 0.9em; }
.menu-item:hover { background: var(--bg-color); }
.board-title { margin: 0; font-size: 1em; color: var(--text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.mode-switch { display: flex; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; }
.mode-btn { padding: 4px 14px; border: none; background: none; cursor: pointer; font-size: 0.85em; color: var(--text-color); transition: background 0.2s; }
.mode-btn.active { background: var(--primary-color); color: white; border-radius: 20px; }
.user-list { display: flex; gap: 6px; margin-left: auto; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.85em; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
.user-avatar:hover, .user-avatar.highlighted { border-color: var(--primary-color); }
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }
</style>

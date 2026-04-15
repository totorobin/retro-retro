<template>
  <div class="board-container">
    <div class="header">
      <div class="menu-burger">☰</div>
      <div class="title">{{ boardStore.currentBoard?.title }}</div>
      <div class="mode-switch" v-if="isOwner">
        <button @click="toggleMode" :class="{ active: boardStore.mode === BoardMode.Creation }">Création</button>
        <button @click="toggleMode" :class="{ active: boardStore.mode === BoardMode.Presentation }">Présentation</button>
      </div>
      <div class="participants">
        <div v-for="user in boardStore.connectedUsers" :key="user.id" class="user-avatar" :title="user.firstName + ' ' + user.lastName">
          <img :src="user.picture" v-if="user.picture" />
          <div v-else>{{ user.firstName[0] }}</div>
        </div>
      </div>
    </div>

    <div class="main-view">
      <v-stage ref="stage" :config="stageConfig">
        <v-layer>
          <!-- Éléments du board (Shapes, Post-its, etc.) -->
          <v-rect v-for="shape in shapes" :key="shape.id" :config="shape" />
          <v-group v-for="postit in postits" :key="postit.id" :config="postit.group">
             <v-rect :config="postit.rect" />
             <v-text :config="postit.text" />
          </v-group>
        </v-layer>
      </v-stage>
    </div>

    <div class="toolbar">
      <!-- Outils dynamiques selon le mode -->
    </div>

    <div class="mini-map">
       <!-- Vue réduite -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBoardStore } from '@/stores/board';
import { BoardMode } from '@retro/models';

const boardStore = useBoardStore();
const isOwner = computed(() => boardStore.currentUser?.id === boardStore.currentBoard?.ownerId);

const stageConfig = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
});

const shapes = computed(() => boardStore.elements.filter(e => e.type === 'SHAPE'));
const postits = computed(() => boardStore.elements.filter(e => e.type === 'POSTIT'));

function toggleMode() {
  const newMode = boardStore.mode === BoardMode.Creation ? BoardMode.Presentation : BoardMode.Creation;
  boardStore.setMode(newMode);
  // Emit via socket...
}
</script>

<style scoped>
.board-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  background: var(--header-bg);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 100;
}
.participants {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ccc;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

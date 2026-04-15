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
      <v-stage ref="stage" :config="stageConfig" @wheel="handleZoom">
        <v-layer>
          <!-- Éléments du board (Shapes, Post-its, etc.) -->
          <v-rect v-for="shape in shapes" :key="shape.id" :config="shape" @dragend="handleDragEnd($event, shape.id)" />
          <v-group v-for="postit in postits" :key="postit.id" :config="postit.group" @dragstart="handleLock(postit.id)" @dragend="handlePostitDragEnd($event, postit.id)">
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
import { ref, computed, onMounted } from 'vue';
import { useBoardStore } from '../stores/board';
import { useSocket } from '../composables/useSocket';
import { BoardMode } from '@retro/models';
// const BoardMode = {
//   Creation: 'CREATION',
//   Presentation: 'PRESENTATION'
// };

const boardStore = useBoardStore();
const { connect, joinBoard, changeMode, updateElement, lockElement, unlockElement } = useSocket();

const isOwner = computed(() => boardStore.currentUser?.id === boardStore.currentBoard?.ownerId);

const stageConfig = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true,
  scaleX: 1,
  scaleY: 1,
});

const shapes = computed(() => boardStore.elements.filter(e => e.type === 'SHAPE').map(e => ({
  id: e.id,
  x: e.x,
  y: e.y,
  width: e.width,
  height: e.height,
  fill: e.fill,
  stroke: e.stroke,
  opacity: e.opacity,
  draggable: boardStore.mode === BoardMode.Creation
})));

const postits = computed(() => boardStore.elements.filter(e => e.type === 'POSTIT').map(e => ({
  id: e.id,
  group: {
    x: e.x,
    y: e.y,
    draggable: true, // Simplified for now
  },
  rect: {
    width: e.width || 100,
    height: e.height || 100,
    fill: e.color || '#fff7d1',
    stroke: e.lockedBy ? '#3498db' : '#ccc',
    strokeWidth: e.lockedBy ? 2 : 1,
  },
  text: {
    text: e.isVisible || e.creatorId === boardStore.currentUser?.id ? e.content : '***',
    padding: 10,
    width: e.width || 100,
    align: 'center',
  }
})));

onMounted(() => {
  connect();
  if (boardStore.currentBoard) {
    joinBoard(boardStore.currentBoard.id, boardStore.currentUser);
  }
});

function toggleMode() {
  if (!isOwner.value) return;
  const newMode = boardStore.mode === BoardMode.Creation ? BoardMode.Presentation : BoardMode.Creation;
  changeMode(boardStore.currentBoard!.id, newMode);
}

function handleZoom(e: any) {
  e.evt.preventDefault();
  const stage = e.target.getStage();
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
}

function handleDragEnd(e: any, id: string) {
  const element = boardStore.elements.find(el => el.id === id);
  if (element) {
    const updated = { ...element, x: e.target.x(), y: e.target.y() };
    updateElement(updated, boardStore.currentBoard!.id);
  }
}

function handleLock(id: string) {
  if (boardStore.mode === BoardMode.Presentation) {
    lockElement(id, boardStore.currentBoard!.id, boardStore.currentUser!.id);
  }
}

function handlePostitDragEnd(e: any, id: string) {
  const element = boardStore.elements.find(el => el.id === id);
  if (element) {
    const updated = { ...element, x: e.target.x(), y: e.target.y() };
    updateElement(updated, boardStore.currentBoard!.id);
    if (boardStore.mode === BoardMode.Presentation) {
      unlockElement(id, boardStore.currentBoard!.id);
    }
  }
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

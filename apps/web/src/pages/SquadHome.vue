<template>
  <div class="squad-home">
    <header class="squad-header">
      <SquadBurgerMenu :squads="squadStore.squads" :current-squad="squadStore.currentSquad"
                       @join-squad="showJoin = true" @create-squad="showCreate = true" />
      <div class="logo-title">
        <span class="app-logo">🔄</span>
        <h1 class="squad-name">{{ squadStore.currentSquad?.name ?? 'Chargement...' }}</h1>
      </div>
    </header>

    <div class="squad-body">
      <MemberList :members="squadStore.members" :online-ids="squadStore.onlineUserIds" />

      <main class="boards-section">
        <div class="boards-header">
          <h2>Boards</h2>
          <button class="retro-button" @click="showNewBoard = true">+ Nouveau Board</button>
        </div>

        <div v-if="showNewBoard" class="create-board-form">
          <input v-model="newBoardTitle" placeholder="Titre du board" @keydown.enter="createBoard" autofocus />
          <button class="retro-button" @click="createBoard" :disabled="!newBoardTitle.trim()">Créer</button>
          <button class="btn-cancel" @click="showNewBoard = false">Annuler</button>
        </div>

        <div v-if="squadStore.boards.length === 0" class="empty-boards">
          <p>Aucun board pour l'instant. Créez votre premier board !</p>
        </div>
        <div v-else class="board-grid">
          <BoardCard v-for="board in squadStore.boards" :key="board.id"
                     :board="board" :active-users="[]"
                     @click="goToBoard(board.id)" />
        </div>
      </main>
    </div>

    <div v-if="showJoin || showCreate" class="modal-overlay" @click.self="closeModals">
      <div class="modal">
        <template v-if="showJoin">
          <h3>Rejoindre une Squad</h3>
          <input v-model="joinId" placeholder="ID de la squad" @keydown.enter="joinSquad" autofocus />
          <div class="modal-actions">
            <button class="retro-button" @click="joinSquad">Rejoindre</button>
            <button class="btn-cancel" @click="closeModals">Annuler</button>
          </div>
        </template>
        <template v-else>
          <h3>Créer une nouvelle Squad</h3>
          <input v-model="createName" placeholder="Nom de la squad" @keydown.enter="createSquad" autofocus />
          <div class="modal-actions">
            <button class="retro-button" @click="createSquad">Créer</button>
            <button class="btn-cancel" @click="closeModals">Annuler</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSquadStore } from '../stores/squad';
import SquadBurgerMenu from '../components/SquadBurgerMenu.vue';
import MemberList from '../components/MemberList.vue';
import BoardCard from '../components/BoardCard.vue';

const route = useRoute();
const router = useRouter();
const squadStore = useSquadStore();

const showNewBoard = ref(false);
const newBoardTitle = ref('');
const showJoin = ref(false);
const showCreate = ref(false);
const joinId = ref('');
const createName = ref('');

onMounted(async () => {
  await squadStore.fetchSquads();
  await squadStore.selectSquad(route.params.id as string);
});

async function createBoard() {
  if (!newBoardTitle.value.trim()) return;
  const board = await squadStore.createBoard(newBoardTitle.value.trim());
  newBoardTitle.value = '';
  showNewBoard.value = false;
  router.push(`/board/${board.id}`);
}

function goToBoard(id: string) { router.push(`/board/${id}`); }

async function joinSquad() {
  if (!joinId.value.trim()) return;
  await squadStore.joinSquad(joinId.value.trim());
  closeModals();
  router.push(`/squads/${joinId.value.trim()}`);
}

async function createSquad() {
  if (!createName.value.trim()) return;
  const api = (await import('axios')).default.create({ baseURL: 'http://localhost:4000', withCredentials: true });
  const res = await api.post('/api/squads', { name: createName.value.trim() });
  squadStore.squads.push(res.data);
  closeModals();
  router.push(`/squads/${res.data.id}`);
}

function closeModals() { showJoin.value = false; showCreate.value = false; joinId.value = ''; createName.value = ''; }
</script>

<style scoped>
.squad-home { display: flex; flex-direction: column; height: 100vh; background: var(--bg-color); }
.squad-header { display: flex; align-items: center; gap: 12px; padding: 0 16px; height: 56px; background: var(--header-bg); border-bottom: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.logo-title { display: flex; align-items: center; gap: 8px; }
.app-logo { font-size: 22px; }
.squad-name { margin: 0; font-size: 1.1em; color: var(--text-color); }
.squad-body { display: flex; flex: 1; overflow: hidden; }
.boards-section { flex: 1; padding: 24px; overflow-y: auto; }
.boards-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.boards-header h2 { margin: 0; color: var(--text-color); }
.create-board-form { display: flex; gap: 8px; margin-bottom: 16px; }
.create-board-form input { flex: 1; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.9em; background: var(--bg-color); color: var(--text-color); }
.board-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.empty-boards { text-align: center; padding: 40px; color: #aaa; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal { background: var(--header-bg); border-radius: 8px; padding: 24px; min-width: 320px; }
.modal h3 { margin: 0 0 16px; }
.modal input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.9em; box-sizing: border-box; }
.modal-actions { display: flex; gap: 8px; margin-top: 12px; }
.btn-cancel { padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 4px; background: none; cursor: pointer; color: var(--text-color); }
</style>

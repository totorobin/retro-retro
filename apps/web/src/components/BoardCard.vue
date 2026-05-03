<template>
  <div class="board-card" @click="$emit('click')">
    <div class="board-thumbnail">
      <img v-if="board.thumbnailUrl" :src="board.thumbnailUrl" alt="Aperçu du board" />
      <div v-else class="board-thumbnail-placeholder">
        <span>{{ board.title[0]?.toUpperCase() }}</span>
      </div>
    </div>
    <div class="board-info">
      <div class="board-title">{{ board.title }}</div>
      <div class="board-date">{{ formatDate(board.createdAt) }}</div>
    </div>
    <div v-if="activeUsers.length > 0" class="active-badge" :title="`${activeUsers.length} utilisateur(s) connecté(s)`">
      <span class="active-dot"></span>
      {{ activeUsers.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Board, User } from '@retro/models';

const props = defineProps<{
  board: Board & { thumbnailUrl?: string };
  activeUsers: User[];
}>();
defineEmits<{ click: [] }>();

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.board-card {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  background: var(--header-bg);
}
.board-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-2px); }
.board-thumbnail { height: 120px; overflow: hidden; background: #f0f4ff; display: flex; align-items: center; justify-content: center; }
.board-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.board-thumbnail-placeholder { font-size: 48px; color: var(--primary-color); font-weight: bold; }
.board-info { padding: 10px 12px; }
.board-title { font-weight: 600; color: var(--text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.board-date { font-size: 0.8em; color: #888; margin-top: 2px; }
.active-badge { position: absolute; top: 8px; right: 8px; background: var(--primary-color); color: white; border-radius: 12px; padding: 2px 8px; font-size: 0.75em; display: flex; align-items: center; gap: 4px; }
.active-dot { width: 6px; height: 6px; border-radius: 50%; background: #2ecc71; }
</style>

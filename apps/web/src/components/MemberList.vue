<template>
  <aside class="member-list">
    <h3>Membres</h3>
    <ul>
      <li v-for="member in members" :key="member.id" class="member-item">
        <div class="member-avatar" :class="{ online: onlineIds.includes(member.id) }">
          <img v-if="member.picture" :src="member.picture" :alt="member.firstName" />
          <span v-else>{{ member.firstName[0] }}</span>
        </div>
        <div class="member-info">
          <span class="member-name">{{ member.firstName }} {{ member.lastName }}</span>
          <span class="member-status" :class="{ online: onlineIds.includes(member.id) }">
            {{ onlineIds.includes(member.id) ? 'En ligne' : 'Hors ligne' }}
          </span>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { User } from '@retro/models';
defineProps<{ members: User[]; onlineIds: string[] }>();
</script>

<style scoped>
.member-list { width: 220px; flex-shrink: 0; padding: 16px; border-right: 1px solid var(--border-color); }
.member-list h3 { margin: 0 0 12px; color: var(--text-color); font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em; }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.member-item { display: flex; align-items: center; gap: 10px; }
.member-avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid transparent; flex-shrink: 0; }
.member-avatar.online { border-color: #2ecc71; }
.member-avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-info { display: flex; flex-direction: column; }
.member-name { font-size: 0.85em; color: var(--text-color); }
.member-status { font-size: 0.75em; color: #aaa; }
.member-status.online { color: #2ecc71; }
</style>

import { defineStore } from 'pinia';
import axios from 'axios';
import { Squad, Board, User } from '@retro/models';

const api = axios.create({ baseURL: 'http://localhost:4000', withCredentials: true });

export const useSquadStore = defineStore('squad', {
  state: () => ({
    currentSquad: null as Squad | null,
    squads: [] as Squad[],
    members: [] as User[],
    boards: [] as Board[],
    onlineUserIds: [] as string[],
  }),
  actions: {
    async fetchSquads() {
      const res = await api.get('/api/squads');
      this.squads = res.data;
      return res.data as Squad[];
    },
    async selectSquad(squadId: string) {
      const [squadRes, membersRes, boardsRes] = await Promise.all([
        api.get(`/api/squads/${squadId}`),
        api.get(`/api/squads/${squadId}/members`),
        api.get(`/api/squads/${squadId}/boards`)
      ]);
      this.currentSquad = squadRes.data;
      this.members = membersRes.data;
      this.boards = boardsRes.data;
    },
    async createBoard(title: string) {
      if (!this.currentSquad) throw new Error('No squad selected');
      const res = await api.post('/api/boards', { squadId: this.currentSquad.id, title });
      this.boards.unshift(res.data);
      return res.data as Board;
    },
    async joinSquad(squadId: string) {
      const res = await api.post(`/api/squads/${squadId}/join`);
      const squad = res.data as Squad;
      const existing = this.squads.find(s => s.id === squadId);
      if (!existing) this.squads.push(squad);
      return squad;
    },
    async leaveSquad(squadId: string) {
      await api.post(`/api/squads/${squadId}/leave`);
      this.squads = this.squads.filter(s => s.id !== squadId);
      if (this.currentSquad?.id === squadId) this.currentSquad = null;
    },
    setOnlineUsers(userIds: string[]) {
      this.onlineUserIds = userIds;
    },
    addOnlineUser(userId: string) {
      if (!this.onlineUserIds.includes(userId)) this.onlineUserIds.push(userId);
    },
    removeOnlineUser(userId: string) {
      this.onlineUserIds = this.onlineUserIds.filter(id => id !== userId);
    }
  }
});

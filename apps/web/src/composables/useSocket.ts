import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useBoardStore } from '../stores/board';
import { BoardMode, User, LaserTrailElement } from '@retro/models';

let socket: Socket | null = null;

export interface RemoteCursor {
  userId: string;
  user: User;
  x: number;
  y: number;
  color: string;
}

const CURSOR_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

const remoteCursors = ref<Map<string, RemoteCursor>>(new Map());
const laserTrails = ref<LaserTrailElement[]>([]);

function getUserColor(userId: string): string {
  let hash = 0;
  for (const c of userId) hash = (hash * 31 + c.charCodeAt(0)) % CURSOR_COLORS.length;
  return CURSOR_COLORS[hash];
}

export function useSocket() {
  const boardStore = useBoardStore();

  function connect() {
    if (socket) return;
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
      withCredentials: true
    });

    socket.on('element-updated', (element) => boardStore.upsertElement(element));
    socket.on('element-deleted', (elementId: string) => boardStore.removeElement(elementId));
    socket.on('element-locked', ({ elementId, userId }) => boardStore.setElementLock(elementId, userId));
    socket.on('element-unlocked', ({ elementId }) => boardStore.setElementLock(elementId, undefined));
    socket.on('mode-changed', (newMode: BoardMode) => boardStore.setMode(newMode));

    socket.on('connected-users', (users: User[]) => {
      boardStore.connectedUsers = users;
    });
    socket.on('user-joined', (user: User) => {
      if (!boardStore.connectedUsers.find(u => u.id === user.id)) {
        boardStore.connectedUsers.push(user);
      }
    });
    socket.on('user-left', (userId: string) => {
      boardStore.connectedUsers = boardStore.connectedUsers.filter(u => u.id !== userId);
      remoteCursors.value.delete(userId);
    });

    socket.on('cursor-moved', ({ userId, user, x, y }: { userId: string; user: User; x: number; y: number }) => {
      remoteCursors.value.set(userId, { userId, user, x, y, color: getUserColor(userId) });
    });

    socket.on('laser-trail', (trail: LaserTrailElement) => {
      laserTrails.value.push(trail);
      setTimeout(() => {
        laserTrails.value = laserTrails.value.filter(t => t.id !== trail.id);
      }, 10000);
    });
  }

  function disconnect() {
    socket?.disconnect();
    socket = null;
  }

  function joinBoard(boardId: string, user: User) {
    socket?.emit('join-board', { boardId, user });
  }

  function updateElement(element: any, boardId: string) {
    socket?.emit('update-element', { element, boardId });
  }

  function deleteElement(elementId: string, boardId: string) {
    socket?.emit('delete-element', { elementId, boardId });
  }

  function lockElement(elementId: string, boardId: string, userId: string) {
    socket?.emit('lock-element', { elementId, boardId, userId });
  }

  function unlockElement(elementId: string, boardId: string) {
    socket?.emit('unlock-element', { elementId, boardId });
  }

  function changeMode(boardId: string, mode: BoardMode) {
    socket?.emit('change-mode', { boardId, mode });
  }

  let lastCursorEmit = 0;
  function emitCursor(x: number, y: number) {
    const now = Date.now();
    if (now - lastCursorEmit < 40) return;
    lastCursorEmit = now;
    socket?.emit('cursor-move', { x, y });
  }

  function emitLaser(boardId: string, points: number[], color: string) {
    socket?.emit('laser-trail', { boardId, points, color });
  }

  return {
    connect, disconnect, joinBoard,
    updateElement, deleteElement, lockElement, unlockElement, changeMode,
    emitCursor, emitLaser,
    remoteCursors, laserTrails
  };
}

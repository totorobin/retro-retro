import { useBoardStore } from '../stores/board';
import { io, Socket } from 'socket.io-client';
import { BoardMode } from '@retro/models';
// const BoardMode = {
//   Creation: 'CREATION',
//   Presentation: 'PRESENTATION'
// };

let socket: Socket | null = null;

export function useSocket() {
  const boardStore = useBoardStore();

  function connect() {
    if (socket) return;
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

    socket.on('element-updated', (element) => {
      boardStore.upsertElement(element);
    });

    socket.on('element-locked', ({ elementId, userId }) => {
      boardStore.setElementLock(elementId, userId);
    });

    socket.on('element-unlocked', ({ elementId }) => {
      boardStore.setElementLock(elementId, undefined);
    });

    socket.on('mode-changed', (newMode: BoardMode) => {
      boardStore.setMode(newMode);
    });

    socket.on('user-joined', (user) => {
      if (!boardStore.connectedUsers.find(u => u.id === user.id)) {
        boardStore.connectedUsers.push(user);
      }
    });

    socket.on('user-left', (userId) => {
      boardStore.connectedUsers = boardStore.connectedUsers.filter(u => u.id !== userId);
    });
  }

  function joinBoard(boardId: string, user: any) {
    socket?.emit('join-board', { boardId, user });
  }

  function updateElement(element: any, boardId: string) {
    socket?.emit('update-element', { element, boardId });
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

  return { connect, joinBoard, updateElement, lockElement, unlockElement, changeMode };
}

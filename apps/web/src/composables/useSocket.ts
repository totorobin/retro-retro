import { useBoardStore } from '@/stores/board';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket() {
  const boardStore = useBoardStore();

  function connect() {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');

    socket.on('element-updated', (element) => {
      // Logic to update local element in store
    });

    socket.on('mode-changed', (newMode) => {
      boardStore.setMode(newMode);
    });

    socket.on('user-joined', (user) => {
      boardStore.connectedUsers.push(user);
    });
  }

  function joinBoard(boardId: string) {
    socket?.emit('join-board', boardId);
  }

  function updateElement(element: any) {
    socket?.emit('update-element', element);
  }

  return { connect, joinBoard, updateElement };
}

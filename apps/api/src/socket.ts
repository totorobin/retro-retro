import { Server, Socket } from 'socket.io';
import { ElementModel, BoardModel } from './models';
import { User } from '@retro/models';

// boardId -> Map<socketId, User>
const boardUsers = new Map<string, Map<string, User>>();

export function setupSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    let currentBoardId: string | null = null;
    let currentUser: User | null = null;
    let cursorThrottle: ReturnType<typeof setTimeout> | null = null;

    socket.on('join-board', ({ boardId, user }: { boardId: string; user: User }) => {
      currentBoardId = boardId;
      currentUser = user;
      socket.join(boardId);

      if (!boardUsers.has(boardId)) boardUsers.set(boardId, new Map());
      boardUsers.get(boardId)!.set(socket.id, user);

      socket.to(boardId).emit('user-joined', user);
      const users = Array.from(boardUsers.get(boardId)!.values());
      socket.emit('connected-users', users);
    });

    socket.on('disconnect', () => {
      if (currentBoardId && currentUser) {
        const room = boardUsers.get(currentBoardId);
        if (room) {
          room.delete(socket.id);
          if (room.size === 0) boardUsers.delete(currentBoardId);
        }
        socket.to(currentBoardId).emit('user-left', currentUser.id);
      }
      if (cursorThrottle) clearTimeout(cursorThrottle);
    });

    socket.on('cursor-move', ({ x, y }: { x: number; y: number }) => {
      if (!currentBoardId || !currentUser) return;
      socket.to(currentBoardId).emit('cursor-moved', {
        userId: currentUser.id,
        user: currentUser,
        x,
        y
      });
    });

    socket.on('update-element', async ({ element, boardId }: { element: any; boardId: string }) => {
      try {
        await ElementModel.findOneAndUpdate(
          { id: element.id },
          { ...element, boardId },
          { upsert: true, new: true }
        );
        socket.to(boardId).emit('element-updated', element);
      } catch (err) {
        console.error('Error updating element:', err);
      }
    });

    socket.on('delete-element', async ({ elementId, boardId }: { elementId: string; boardId: string }) => {
      try {
        await ElementModel.deleteOne({ id: elementId });
        io.to(boardId).emit('element-deleted', elementId);
      } catch (err) {
        console.error('Error deleting element:', err);
      }
    });

    socket.on('lock-element', ({ elementId, boardId, userId }: { elementId: string; boardId: string; userId: string }) => {
      socket.to(boardId).emit('element-locked', { elementId, userId });
    });

    socket.on('unlock-element', ({ elementId, boardId }: { elementId: string; boardId: string }) => {
      socket.to(boardId).emit('element-unlocked', { elementId });
    });

    socket.on('change-mode', async ({ boardId, mode }: { boardId: string; mode: string }) => {
      try {
        await BoardModel.findOneAndUpdate({ id: boardId }, { mode });
        io.to(boardId).emit('mode-changed', mode);
      } catch (err) {
        console.error('Error changing mode:', err);
      }
    });

    socket.on('laser-trail', ({ boardId, points, color }: { boardId: string; points: number[]; color: string }) => {
      socket.to(boardId).emit('laser-trail', {
        id: `laser-${socket.id}-${Date.now()}`,
        userId: currentUser?.id,
        points,
        color
      });
    });
  });
}

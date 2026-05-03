import { defineStore } from 'pinia';
import { Board, User, BoardMode, AnyElement } from '@retro/models';

export const useBoardStore = defineStore('board', {
  state: () => ({
    currentBoard: null as Board | null,
    elements: [] as AnyElement[],
    currentUser: null as User | null,
    connectedUsers: [] as User[],
    mode: BoardMode.Presentation as BoardMode,
    highlightedUserId: null as string | null,
  }),
  getters: {
    isOwner: (state) => state.currentUser?.id === state.currentBoard?.ownerId,
  },
  actions: {
    setBoard(board: Board, elements: AnyElement[]) {
      this.currentBoard = board;
      this.elements = elements;
      this.mode = board.mode;
    },
    upsertElement(element: AnyElement) {
      const index = this.elements.findIndex(e => e.id === element.id);
      if (index !== -1) {
        this.elements[index] = element;
      } else {
        this.elements.push(element);
      }
    },
    removeElement(elementId: string) {
      this.elements = this.elements.filter(e => e.id !== elementId);
    },
    setElementLock(elementId: string, lockedBy: string | undefined) {
      const element = this.elements.find(e => e.id === elementId) as any;
      if (element) element.lockedBy = lockedBy;
    },
    setMode(mode: BoardMode) {
      this.mode = mode;
      if (this.currentBoard) this.currentBoard.mode = mode;
    },
    setHighlightedUser(userId: string | null) {
      this.highlightedUserId = userId;
    }
  }
});

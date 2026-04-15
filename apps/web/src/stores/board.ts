import { defineStore } from 'pinia';
import { Board, BoardMode, User } from '@retro/models';

export const useBoardStore = defineStore('board', {
  state: () => ({
    currentBoard: null as Board | null,
    elements: [] as any[],
    currentUser: null as User | null,
    connectedUsers: [] as User[],
    mode: BoardMode.Presentation,
  }),
  actions: {
    setBoard(board: Board) {
      this.currentBoard = board;
      this.mode = board.mode;
    },
    updateElements(elements: any[]) {
      this.elements = elements;
    },
    setMode(mode: BoardMode) {
      this.mode = mode;
      if (this.currentBoard) {
        this.currentBoard.mode = mode;
      }
    }
  }
});

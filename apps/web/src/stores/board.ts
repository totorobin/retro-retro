import { defineStore } from 'pinia';
import { Board, User } from '@retro/models';
// Hack temporaire si l'import de l'enum échoue
const BoardMode = {
  Creation: 'CREATION',
  Presentation: 'PRESENTATION'
};

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
    upsertElement(element: any) {
      const index = this.elements.findIndex(e => e.id === element.id);
      if (index !== -1) {
        this.elements[index] = element;
      } else {
        this.elements.push(element);
      }
    },
    setElementLock(elementId: string, lockedBy?: string) {
      const element = this.elements.find(e => e.id === elementId);
      if (element) {
        element.lockedBy = lockedBy;
      }
    },
    setMode(mode: BoardMode) {
      this.mode = mode;
      if (this.currentBoard) {
        this.currentBoard.mode = mode;
      }
    }
  }
});

import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useBoardStore } from '../stores/board';
import { useSocket } from './useSocket';
import { BoardMode, AnyElement, PostItElement, ShapeElement, TextElement, ImageElement, StampElement } from '@retro/models';

export type ToolType = 'pointer' | 'rect' | 'circle' | 'line' | 'text' | 'image' | 'postit' | 'laser' | 'stamp-profile' | 'stamp-emoji';

const POSTIT_COLORS = ['#fff7d1', '#d1e8ff', '#d1ffd1', '#ffd1d1', '#f0d1ff', '#ffe8d1'];
const LASER_COLOR = '#e74c3c';

export function useBoard() {
  const boardStore = useBoardStore();
  const { updateElement, deleteElement, lockElement, unlockElement, emitLaser } = useSocket();

  const currentTool = ref<ToolType>('pointer');
  const isDrawing = ref(false);
  const drawStart = ref({ x: 0, y: 0 });
  const draftElement = ref<Partial<AnyElement> | null>(null);
  const laserPoints = ref<number[]>([]);
  const editingPostitId = ref<string | null>(null);
  const selectedEmojiStamp = ref<string>('⭐');

  const isCreationMode = computed(() => boardStore.mode === BoardMode.Creation);

  function getZoneColorAt(x: number, y: number): string | undefined {
    const shapes = boardStore.elements.filter(e => e.type === 'SHAPE') as ShapeElement[];
    for (const shape of shapes) {
      if (!shape.defaultPostitColor) continue;
      const w = shape.width ?? 0;
      const h = shape.height ?? 0;
      if (x >= shape.x && x <= shape.x + w && y >= shape.y && y <= shape.y + h) {
        return shape.defaultPostitColor;
      }
    }
    return undefined;
  }

  function createElement(type: string, x: number, y: number, extra: Record<string, any> = {}): AnyElement {
    const base = {
      id: uuidv4(),
      boardId: boardStore.currentBoard!.id,
      x, y,
      zindex: boardStore.elements.length,
      creatorId: boardStore.currentUser!.id,
      ...extra
    };
    return { type, ...base } as AnyElement;
  }

  function createPostIt(x: number, y: number): PostItElement {
    const color = getZoneColorAt(x, y) ?? POSTIT_COLORS[0];
    const el = createElement('POSTIT', x, y, {
      content: '',
      width: 150,
      height: 100,
      color,
      isVisible: false,
      reactions: []
    }) as PostItElement;
    boardStore.upsertElement(el);
    updateElement(el, boardStore.currentBoard!.id);
    editingPostitId.value = el.id;
    return el;
  }

  function createShape(shapeType: 'RECTANGLE' | 'CIRCLE', x: number, y: number, w: number, h: number): ShapeElement {
    const el = createElement('SHAPE', x, y, {
      shapeType,
      width: Math.abs(w),
      height: Math.abs(h),
      fill: 'rgba(65,105,225,0.1)',
      stroke: '#4169E1',
      opacity: 1
    }) as ShapeElement;
    boardStore.upsertElement(el);
    updateElement(el, boardStore.currentBoard!.id);
    return el;
  }

  function createText(x: number, y: number, content: string): TextElement {
    const el = createElement('TEXT', x, y, {
      content,
      fontSize: 16,
      color: '#333333',
      width: 200
    }) as TextElement;
    boardStore.upsertElement(el);
    updateElement(el, boardStore.currentBoard!.id);
    return el;
  }

  function createImage(x: number, y: number, url: string, w: number, h: number): ImageElement {
    const el = createElement('IMAGE', x, y, { url, width: w, height: h }) as ImageElement;
    boardStore.upsertElement(el);
    updateElement(el, boardStore.currentBoard!.id);
    return el;
  }

  function createStamp(x: number, y: number, stampType: 'profile' | 'emoji', extra: Record<string, any>): StampElement {
    const el = createElement('STAMP', x, y, { stampType, size: 40, ...extra }) as StampElement;
    boardStore.upsertElement(el);
    updateElement(el, boardStore.currentBoard!.id);
    return el;
  }

  function startElementDrag(elementId: string) {
    if (boardStore.mode !== BoardMode.Presentation) return;
    lockElement(elementId, boardStore.currentBoard!.id, boardStore.currentUser!.id);
  }

  function endElementDrag(element: AnyElement, newX: number, newY: number) {
    const updated = { ...element, x: newX, y: newY };
    boardStore.upsertElement(updated as AnyElement);
    updateElement(updated, boardStore.currentBoard!.id);
    if (boardStore.mode === BoardMode.Presentation) {
      unlockElement(element.id, boardStore.currentBoard!.id);
    }
  }

  function removeElement(elementId: string) {
    boardStore.removeElement(elementId);
    deleteElement(elementId, boardStore.currentBoard!.id);
  }

  function togglePostitVisibility(elementId: string) {
    const el = boardStore.elements.find(e => e.id === elementId) as PostItElement | undefined;
    if (!el || el.type !== 'POSTIT') return;
    const updated = { ...el, isVisible: !el.isVisible };
    boardStore.upsertElement(updated);
    updateElement(updated, boardStore.currentBoard!.id);
  }

  function updatePostitContent(elementId: string, content: string) {
    const el = boardStore.elements.find(e => e.id === elementId) as PostItElement | undefined;
    if (!el || el.type !== 'POSTIT') return;
    const updated = { ...el, content };
    boardStore.upsertElement(updated);
    updateElement(updated, boardStore.currentBoard!.id);
    editingPostitId.value = null;
  }

  function addReaction(elementId: string, emoji: string) {
    const el = boardStore.elements.find(e => e.id === elementId) as PostItElement | undefined;
    if (!el || el.type !== 'POSTIT') return;
    const userId = boardStore.currentUser!.id;
    const reactions = el.reactions.map(r => ({ ...r, userIds: [...r.userIds] }));
    const existing = reactions.find(r => r.emoji === emoji);
    if (existing) {
      if (existing.userIds.includes(userId)) {
        existing.userIds = existing.userIds.filter(id => id !== userId);
        existing.count = existing.userIds.length;
      } else {
        existing.userIds.push(userId);
        existing.count = existing.userIds.length;
      }
    } else {
      reactions.push({ emoji, count: 1, userIds: [userId] });
    }
    const updated = { ...el, reactions: reactions.filter(r => r.count > 0) };
    boardStore.upsertElement(updated);
    updateElement(updated, boardStore.currentBoard!.id);
  }

  function revealAllPostits(reveal: boolean) {
    const userId = boardStore.currentUser!.id;
    boardStore.elements
      .filter(e => e.type === 'POSTIT' && e.creatorId === userId)
      .forEach(e => {
        const updated = { ...e as PostItElement, isVisible: reveal };
        boardStore.upsertElement(updated);
        updateElement(updated, boardStore.currentBoard!.id);
      });
  }

  function finishLaser(boardId: string) {
    if (laserPoints.value.length >= 4) {
      emitLaser(boardId, [...laserPoints.value], LASER_COLOR);
    }
    laserPoints.value = [];
  }

  return {
    currentTool,
    isDrawing,
    drawStart,
    draftElement,
    laserPoints,
    editingPostitId,
    selectedEmojiStamp,
    isCreationMode,
    createPostIt,
    createShape,
    createText,
    createImage,
    createStamp,
    startElementDrag,
    endElementDrag,
    removeElement,
    togglePostitVisibility,
    updatePostitContent,
    addReaction,
    revealAllPostits,
    finishLaser,
    LASER_COLOR,
    POSTIT_COLORS
  };
}

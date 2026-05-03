<template>
  <div class="board-page">
    <BoardHeader :board="boardStore.currentBoard" :is-owner="boardStore.isOwner"
                 :mode="boardStore.mode" :connected-users="boardStore.connectedUsers"
                 :highlighted-user-id="boardStore.highlightedUserId"
                 @exit="exitBoard" @toggle-mode="toggleMode"
                 @toggle-highlight="id => boardStore.setHighlightedUser(boardStore.highlightedUserId === id ? null : id)" />

    <BoardToolbar :mode="boardStore.mode" :current-tool="currentTool"
                  :selected-emoji="selectedEmojiStamp"
                  @select-tool="currentTool = $event"
                  @upload-image="handleImageUpload"
                  @select-emoji="selectedEmojiStamp = $event" />

    <div class="canvas-area" ref="containerRef" @contextmenu.prevent>
      <v-stage ref="stageRef" :config="stageConfig"
               @wheel="handleWheel" @mousedown="handleMouseDown"
               @mousemove="handleMouseMove" @mouseup="handleMouseUp">
        <v-layer>
          <template v-for="el in boardStore.elements" :key="el.id">
            <v-rect v-if="el.type === 'SHAPE' && (el as any).shapeType === 'RECTANGLE'" :config="shapeConfig(el)"
                    @dragstart="handleDragStart(el)" @dragend="e => handleDragEnd(e, el)" />
            <v-ellipse v-else-if="el.type === 'SHAPE' && (el as any).shapeType === 'CIRCLE'" :config="ellipseConfig(el)"
                       @dragstart="handleDragStart(el)" @dragend="e => handleDragEnd(e, el)" />
            <v-image v-else-if="el.type === 'IMAGE'" :config="imageConfig(el)"
                     @dragstart="handleDragStart(el)" @dragend="e => handleDragEnd(e, el)" />
            <v-text v-else-if="el.type === 'TEXT'" :config="textConfig(el)"
                    @dragstart="handleDragStart(el)" @dragend="e => handleDragEnd(e, el)" />
            <template v-else-if="el.type === 'POSTIT'">
              <v-group :config="postitGroupConfig(el)" @dragstart="handleDragStart(el)"
                       @dragend="e => handleDragEnd(e, el)" @dblclick="openPostitEdit(el)">
                <v-rect :config="postitRectConfig(el)" />
                <v-text :config="postitTextConfig(el)" />
                <v-text :config="visibilityConfig(el)" @click.stop="togglePostitVisibility(el.id)" />
                <v-text v-if="canDeleteElement(el)" :config="deleteConfig(el)" @click.stop="removeElement(el.id)" />
              </v-group>
              <v-text v-for="(r, i) in (el as any).reactions" :key="r.emoji"
                      :config="reactionConfig(el, r, i)" @click.stop="addReaction(el.id, r.emoji)" />
              <v-text :config="addReactionConfig(el)" @click.stop="openReactionPicker(el)" />
            </template>
            <template v-else-if="el.type === 'STAMP'">
              <v-circle :config="stampCircleConfig(el)" />
              <v-text :config="stampTextConfig(el)" />
            </template>
          </template>
          <v-rect v-if="draftRect" :config="draftRect" />
          <v-ellipse v-if="draftEllipse" :config="draftEllipse" />
          <v-line v-if="draftLine" :config="draftLine" />
          <v-line v-if="laserPoints.length >= 4" :config="laserConfig" />
          <v-line v-for="trail in laserTrails" :key="trail.id"
                  :config="{ points: trail.points, stroke: trail.color, strokeWidth: 3, tension: 0.5, lineCap: 'round', listening: false }" />
          <template v-for="cursor in Array.from(remoteCursors.values())" :key="cursor.userId">
            <v-circle :config="{ x: cursor.x, y: cursor.y, radius: 5, fill: cursor.color, listening: false }" />
            <v-text :config="{ x: cursor.x + 8, y: cursor.y - 6, text: cursor.user.firstName, fontSize: 11, fill: cursor.color, listening: false }" />
          </template>
        </v-layer>
      </v-stage>

      <div v-if="editingPostitId" class="postit-editor" :style="editorStyle">
        <textarea v-model="editingText" @blur="finishEdit" @keydown.ctrl.enter="finishEdit" autofocus placeholder="Votre note..." />
      </div>
      <div v-if="reactionPickerEl" class="reaction-picker" :style="pickerStyle">
        <button v-for="e in EMOJIS" :key="e" @click="pickReaction(e)">{{ e }}</button>
        <button class="picker-close" @click="reactionPickerEl = null">✕</button>
      </div>
    </div>

    <BoardMinimap :stage-ref="stageRef" :elements="boardStore.elements" />

    <div v-if="boardStore.mode === BoardMode.Presentation" class="reveal-bar">
      <label class="reveal-toggle">
        <input type="checkbox" v-model="revealAll" @change="revealAllPostits(revealAll)" />
        Tout dévoiler
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { BoardMode, AnyElement, PostItElement } from '@retro/models';
import { useBoardStore } from '../stores/board';
import { useSocket } from '../composables/useSocket';
import { useBoard } from '../composables/useBoard';
import BoardHeader from '../components/board/BoardHeader.vue';
import BoardToolbar from '../components/board/BoardToolbar.vue';
import BoardMinimap from '../components/board/BoardMinimap.vue';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const auth = useAuthStore();
const api = axios.create({ baseURL: 'http://localhost:4000', withCredentials: true });

const socketComposable = useSocket();
const { connect, joinBoard, changeMode, emitCursor, remoteCursors, laserTrails } = socketComposable;

const boardComposable = useBoard();
const {
  currentTool, laserPoints, editingPostitId, selectedEmojiStamp,
  createPostIt, createShape, createText, createImage, createStamp,
  startElementDrag, endElementDrag, removeElement, togglePostitVisibility,
  updatePostitContent, addReaction, revealAllPostits, finishLaser, LASER_COLOR
} = boardComposable;

const stageRef = ref<any>(null);
const containerRef = ref<HTMLElement | null>(null);
const draftRect = ref<any>(null);
const draftEllipse = ref<any>(null);
const draftLine = ref<any>(null);
const drawOrigin = ref({ x: 0, y: 0 });
const editingText = ref('');
const revealAll = ref(false);
const reactionPickerEl = ref<AnyElement | null>(null);
const pickerStyle = ref<Record<string, string>>({});
const EMOJIS = ['👍', '👎', '❤️', '🔥', '⭐', '✅', '❌', '💡', '🎉', '🤔'];

const editorStyle = computed(() => {
  if (!editingPostitId.value || !stageRef.value) return {};
  const el = boardStore.elements.find(e => e.id === editingPostitId.value) as PostItElement | undefined;
  if (!el) return {};
  const stage = stageRef.value.getStage();
  const s = stage.scaleX(); const p = stage.position();
  return { left: `${el.x * s + p.x + 52}px`, top: `${el.y * s + p.y + 50}px`, width: `${el.width * s}px`, height: `${el.height * s}px` };
});

const stageConfig = computed(() => ({
  width: window.innerWidth - 52,
  height: window.innerHeight - 50,
  draggable: currentTool.value === 'pointer',
}));

const laserConfig = computed(() => ({
  points: laserPoints.value,
  stroke: LASER_COLOR,
  strokeWidth: 3,
  tension: 0.5,
  lineCap: 'round' as const,
  listening: false,
}));

onMounted(async () => {
  const res = await api.get(`/api/boards/${route.params.id}`);
  boardStore.setBoard(res.data.board, res.data.elements);
  boardStore.currentUser = auth.user;
  connect();
  if (boardStore.currentUser) joinBoard(boardStore.currentBoard!.id, boardStore.currentUser);
});

onUnmounted(() => socketComposable.disconnect());

function getPointer() {
  const stage = stageRef.value?.getStage();
  return stage?.getRelativePointerPosition() ?? { x: 0, y: 0 };
}

function handleMouseDown(e: any) {
  const tool = currentTool.value;
  const { x, y } = getPointer();
  if (tool === 'pointer') return;
  if (tool === 'postit') { createPostIt(x, y); editingText.value = ''; return; }
  if (tool === 'stamp-profile' && boardStore.currentUser) {
    createStamp(x, y, 'profile', { userId: boardStore.currentUser.id, userPicture: boardStore.currentUser.picture });
    return;
  }
  if (tool === 'stamp-emoji') { createStamp(x, y, 'emoji', { emoji: selectedEmojiStamp.value }); return; }
  if (tool === 'text') { const t = window.prompt('Texte :'); if (t) createText(x, y, t); return; }
  drawOrigin.value = { x, y };
  laserPoints.value = tool === 'laser' ? [x, y] : [];
  const base = { fill: 'rgba(65,105,225,0.1)', stroke: '#4169E1', strokeWidth: 2, listening: false, dash: [4, 4] };
  if (tool === 'rect') draftRect.value = { x, y, width: 0, height: 0, ...base };
  if (tool === 'circle') draftEllipse.value = { x, y, radiusX: 0, radiusY: 0, ...base };
  if (tool === 'line') draftLine.value = { points: [x, y, x, y], stroke: '#4169E1', strokeWidth: 2, listening: false };
}

function handleMouseMove(e: any) {
  const { x, y } = getPointer();
  emitCursor(x, y);
  const tool = currentTool.value;
  if (tool === 'laser' && laserPoints.value.length >= 2) { laserPoints.value = [...laserPoints.value, x, y]; return; }
  if (!drawOrigin.value || tool === 'pointer') return;
  const { x: sx, y: sy } = drawOrigin.value;
  if (tool === 'rect' && draftRect.value) draftRect.value = { ...draftRect.value, x: Math.min(sx, x), y: Math.min(sy, y), width: Math.abs(x - sx), height: Math.abs(y - sy) };
  if (tool === 'circle' && draftEllipse.value) draftEllipse.value = { ...draftEllipse.value, radiusX: Math.abs(x - sx) / 2, radiusY: Math.abs(y - sy) / 2, x: (sx + x) / 2, y: (sy + y) / 2 };
  if (tool === 'line' && draftLine.value) draftLine.value = { ...draftLine.value, points: [sx, sy, x, y] };
}

function handleMouseUp() {
  const tool = currentTool.value;
  const { x: ex, y: ey } = getPointer();
  const { x: sx, y: sy } = drawOrigin.value;
  const w = Math.abs(ex - sx); const h = Math.abs(ey - sy);
  if (tool === 'rect' && w > 5 && h > 5) createShape('RECTANGLE', Math.min(sx, ex), Math.min(sy, ey), w, h);
  if (tool === 'circle' && (w > 5 || h > 5)) createShape('CIRCLE', Math.min(sx, ex), Math.min(sy, ey), w, h);
  draftRect.value = null; draftEllipse.value = null; draftLine.value = null;
  if (tool === 'laser') finishLaser(boardStore.currentBoard!.id);
}

function handleWheel(e: any) {
  e.evt.preventDefault();
  const stage = stageRef.value.getStage();
  const old = stage.scaleX(); const ptr = stage.getPointerPosition();
  const newScale = Math.min(Math.max(old * (e.evt.deltaY < 0 ? 1.1 : 1 / 1.1), 0.1), 5);
  const mp = { x: (ptr.x - stage.x()) / old, y: (ptr.y - stage.y()) / old };
  stage.scale({ x: newScale, y: newScale });
  stage.position({ x: ptr.x - mp.x * newScale, y: ptr.y - mp.y * newScale });
}

function handleDragStart(el: AnyElement) { startElementDrag(el.id); }
function handleDragEnd(e: any, el: AnyElement) { endElementDrag(el, e.target.x(), e.target.y()); }
function handleImageUpload(dataUrl: string) { const { x, y } = getPointer(); createImage(x - 100, y - 75, dataUrl, 200, 150); }

function openPostitEdit(el: any) {
  if (el.creatorId !== boardStore.currentUser?.id) return;
  editingPostitId.value = el.id;
  editingText.value = (el as PostItElement).content;
}
function finishEdit() { if (editingPostitId.value) updatePostitContent(editingPostitId.value, editingText.value); }
function openReactionPicker(el: AnyElement) {
  reactionPickerEl.value = el;
  if (!stageRef.value) return;
  const stage = stageRef.value.getStage();
  const s = stage.scaleX(); const p = stage.position();
  pickerStyle.value = { left: `${el.x * s + p.x + 52}px`, top: `${(el.y + ((el as any).height ?? 100)) * s + p.y + 50 + 28}px` };
}
function pickReaction(emoji: string) { if (reactionPickerEl.value) addReaction(reactionPickerEl.value.id, emoji); reactionPickerEl.value = null; }
function toggleMode() {
  if (!boardStore.isOwner) return;
  changeMode(boardStore.currentBoard!.id, boardStore.mode === BoardMode.Creation ? BoardMode.Presentation : BoardMode.Creation);
}
function exitBoard() { router.push(`/squads/${boardStore.currentBoard?.squadId}`); }
function canDeleteElement(el: AnyElement) { return el.creatorId === boardStore.currentUser?.id || boardStore.isOwner; }

// Konva config builders
function shapeConfig(el: any) { return { x: el.x, y: el.y, width: el.width ?? 100, height: el.height ?? 80, fill: el.fill ?? 'rgba(65,105,225,0.1)', stroke: el.stroke ?? '#4169E1', opacity: el.opacity ?? 1, draggable: boardStore.mode === BoardMode.Creation }; }
function ellipseConfig(el: any) { const rx = (el.width ?? 100) / 2; const ry = (el.height ?? 80) / 2; return { x: el.x + rx, y: el.y + ry, radiusX: rx, radiusY: ry, fill: el.fill ?? 'rgba(65,105,225,0.1)', stroke: el.stroke ?? '#4169E1', opacity: el.opacity ?? 1, draggable: boardStore.mode === BoardMode.Creation }; }
function textConfig(el: any) { return { x: el.x, y: el.y, text: el.content, fontSize: el.fontSize ?? 16, fill: el.color ?? 'var(--text-color)', width: el.width ?? 200, draggable: boardStore.mode === BoardMode.Creation, listening: boardStore.mode === BoardMode.Creation }; }
function imageConfig(el: any) { const img = new window.Image(); img.src = el.url; return { x: el.x, y: el.y, image: img, width: el.width ?? 200, height: el.height ?? 150, draggable: boardStore.mode === BoardMode.Creation }; }
function postitGroupConfig(el: any) { const locked = (el as any).lockedBy && (el as any).lockedBy !== boardStore.currentUser?.id; const hl = boardStore.highlightedUserId && boardStore.highlightedUserId !== el.creatorId; return { x: el.x, y: el.y, draggable: !locked, opacity: hl ? 0.3 : 1 }; }
function postitRectConfig(el: any) { const locked = (el as any).lockedBy && (el as any).lockedBy !== boardStore.currentUser?.id; return { width: (el as any).width ?? 150, height: (el as any).height ?? 100, fill: (el as any).color ?? '#fff7d1', stroke: locked ? '#3498db' : '#ddd', strokeWidth: locked ? 2 : 1, cornerRadius: 4, shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.12)' }; }
function postitTextConfig(el: any) { const pi = el as PostItElement; const canSee = pi.isVisible || pi.creatorId === boardStore.currentUser?.id; return { text: canSee ? pi.content || '(vide)' : '• • •', x: 8, y: 8, width: pi.width - 16, fontSize: 13, fill: canSee ? '#333' : '#bbb', listening: false }; }
function visibilityConfig(el: any) { const pi = el as PostItElement; return { text: pi.isVisible ? '👁' : '🙈', x: 6, y: pi.height - 22, fontSize: 14, cursor: 'pointer' }; }
function deleteConfig(el: any) { return { text: '✕', x: (el as any).width - 18, y: 4, fontSize: 12, fill: '#e74c3c', cursor: 'pointer' }; }
function reactionConfig(el: any, r: any, i: number) { return { x: el.x + i * 34, y: el.y + (el as any).height + 4, text: `${r.emoji}${r.count > 1 ? r.count : ''}`, fontSize: 16, cursor: 'pointer' }; }
function addReactionConfig(el: any) { const c = (el as PostItElement).reactions?.length ?? 0; return { x: el.x + c * 34, y: el.y + (el as any).height + 4, text: '+', fontSize: 16, fill: '#aaa', cursor: 'pointer' }; }
function stampCircleConfig(el: any) { return { x: el.x, y: el.y, radius: el.size / 2, fill: '#eef', stroke: '#4169E1', strokeWidth: 1 }; }
function stampTextConfig(el: any) { return { x: el.x - (el.size / 2) * 0.6, y: el.y - (el.size / 2) * 0.6, text: el.emoji ?? '⭐', fontSize: el.size * 0.6, listening: false }; }
</script>

<style scoped>
.board-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: var(--bg-color); }
.canvas-area { position: absolute; top: 50px; left: 52px; right: 0; bottom: 0; overflow: hidden; }
.postit-editor { position: absolute; z-index: 200; }
.postit-editor textarea { width: 100%; height: 100%; box-sizing: border-box; border: 2px solid var(--primary-color); border-radius: 4px; padding: 8px; font-size: 13px; resize: none; background: #fff7d1; font-family: inherit; }
.reaction-picker { position: absolute; z-index: 300; background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; display: flex; flex-wrap: wrap; gap: 4px; max-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.reaction-picker button { border: none; background: none; font-size: 20px; cursor: pointer; padding: 4px; border-radius: 4px; }
.reaction-picker button:hover { background: var(--bg-color); }
.picker-close { font-size: 12px !important; color: #888; }
.reveal-bar { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: var(--header-bg); border: 1px solid var(--border-color); border-radius: 20px; padding: 6px 16px; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.reveal-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9em; color: var(--text-color); }
</style>

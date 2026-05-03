<template>
  <div class="minimap" @click="handleClick" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <canvas ref="canvas" :width="WIDTH" :height="HEIGHT" />
    <div class="viewport-indicator" :style="viewportStyle" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type Konva from 'konva';

const props = defineProps<{
  stageRef: any;
  elements: any[];
}>();

const WIDTH = 180;
const HEIGHT = 120;
const CANVAS_SIZE = 4000;
const SCALE_X = WIDTH / CANVAS_SIZE;
const SCALE_Y = HEIGHT / CANVAS_SIZE;

const canvas = ref<HTMLCanvasElement | null>(null);
const dragging = ref(false);

const viewportStyle = computed(() => {
  const stage = props.stageRef?.getStage?.() as Konva.Stage | undefined;
  if (!stage) return {};
  const scale = stage.scaleX();
  const pos = stage.position();
  const vw = (window.innerWidth / scale) * SCALE_X;
  const vh = (window.innerHeight / scale) * SCALE_Y;
  const vx = (-pos.x / scale) * SCALE_X;
  const vy = (-pos.y / scale) * SCALE_Y;
  return { left: `${vx}px`, top: `${vy}px`, width: `${vw}px`, height: `${vh}px` };
});

function draw() {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const el of props.elements) {
    const mx = (el.x ?? 0) * SCALE_X;
    const my = (el.y ?? 0) * SCALE_Y;
    const mw = Math.max(2, (el.width ?? 60) * SCALE_X);
    const mh = Math.max(2, (el.height ?? 40) * SCALE_Y);
    ctx.fillStyle = el.fill ?? el.color ?? '#4169E1';
    ctx.globalAlpha = 0.7;
    if (el.type === 'SHAPE' && el.shapeType === 'CIRCLE') {
      ctx.beginPath();
      ctx.ellipse(mx + mw / 2, my + mh / 2, mw / 2, mh / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(mx, my, mw, mh);
    }
    ctx.globalAlpha = 1;
  }
}

function navigateTo(ex: number, ey: number) {
  const stage = props.stageRef?.getStage?.() as Konva.Stage | undefined;
  if (!stage) return;
  const scale = stage.scaleX();
  const boardX = (ex / SCALE_X) * scale;
  const boardY = (ey / SCALE_Y) * scale;
  stage.position({
    x: window.innerWidth / 2 - boardX,
    y: window.innerHeight / 2 - boardY
  });
  stage.batchDraw();
}

function getLocalCoords(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function handleClick(e: MouseEvent) {
  const { x, y } = getLocalCoords(e);
  navigateTo(x, y);
}
function handleMouseDown() { dragging.value = true; }
function handleMouseMove(e: MouseEvent) {
  if (!dragging.value) return;
  const { x, y } = getLocalCoords(e);
  navigateTo(x, y);
}
function handleMouseUp() { dragging.value = false; }

watch(() => props.elements, draw, { deep: true });
onMounted(draw);
</script>

<style scoped>
.minimap { position: absolute; bottom: 16px; right: 16px; width: 180px; height: 120px; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden; cursor: crosshair; background: var(--header-bg); z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.minimap canvas { display: block; }
.viewport-indicator { position: absolute; border: 2px solid var(--primary-color); border-radius: 2px; pointer-events: none; min-width: 10px; min-height: 8px; }
</style>

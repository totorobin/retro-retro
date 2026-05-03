<template>
  <div class="board-toolbar">
    <template v-if="mode === BoardMode.Creation">
      <button v-for="tool in creationTools" :key="tool.id"
              :class="['tool-btn', { active: currentTool === tool.id }]"
              :title="tool.label" @click="emit('select-tool', tool.id)">
        {{ tool.icon }}
      </button>
      <hr class="toolbar-divider" />
      <button class="tool-btn" title="Importer une image" @click="triggerImageUpload">🖼</button>
      <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileSelected" />
    </template>
    <template v-else>
      <button v-for="tool in presentationTools" :key="tool.id"
              :class="['tool-btn', { active: currentTool === tool.id }]"
              :title="tool.label" @click="emit('select-tool', tool.id)">
        {{ tool.icon }}
      </button>
      <hr class="toolbar-divider" />
      <div class="emoji-stamps">
        <button v-for="emoji in stampEmojis" :key="emoji"
                :class="['tool-btn', 'emoji-btn', { active: currentTool === 'stamp-emoji' && selectedEmoji === emoji }]"
                @click="selectEmojiStamp(emoji)" :title="`Tampon ${emoji}`">
          {{ emoji }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BoardMode } from '@retro/models';
import type { ToolType } from '../../composables/useBoard';

const props = defineProps<{
  mode: BoardMode;
  currentTool: ToolType;
  selectedEmoji: string;
}>();

const emit = defineEmits<{
  'select-tool': [tool: ToolType];
  'upload-image': [dataUrl: string];
  'select-emoji': [emoji: string];
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const creationTools: { id: ToolType; icon: string; label: string }[] = [
  { id: 'pointer', icon: '↖', label: 'Sélection / Déplacement' },
  { id: 'rect', icon: '⬜', label: 'Rectangle' },
  { id: 'circle', icon: '⭕', label: 'Cercle / Ovale' },
  { id: 'line', icon: '╱', label: 'Trait' },
  { id: 'text', icon: 'T', label: 'Texte' },
];

const presentationTools: { id: ToolType; icon: string; label: string }[] = [
  { id: 'pointer', icon: '↖', label: 'Sélection / Déplacement' },
  { id: 'postit', icon: '📌', label: 'Post-it' },
  { id: 'laser', icon: '✨', label: 'Trait Laser' },
  { id: 'stamp-profile', icon: '👤', label: 'Tampon Photo' },
];

const stampEmojis = ['👍', '👎', '❤️', '🔥', '⭐', '✅', '❌', '💡', '🎉', '🤔'];

function triggerImageUpload() { fileInput.value?.click(); }

function handleFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => emit('upload-image', reader.result as string);
  reader.readAsDataURL(file);
  (e.target as HTMLInputElement).value = '';
}

function selectEmojiStamp(emoji: string) {
  emit('select-emoji', emoji);
  emit('select-tool', 'stamp-emoji');
}
</script>

<style scoped>
.board-toolbar { position: absolute; top: 50px; left: 0; bottom: 0; width: 52px; background: var(--header-bg); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 4px; z-index: 100; overflow-y: auto; }
.tool-btn { width: 36px; height: 36px; border: 1px solid transparent; border-radius: 6px; background: none; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; color: var(--text-color); transition: background 0.15s, border-color 0.15s; }
.tool-btn:hover { background: var(--bg-color); border-color: var(--border-color); }
.tool-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.emoji-btn { font-size: 18px; }
.toolbar-divider { width: 28px; border: none; border-top: 1px solid var(--border-color); margin: 4px 0; }
.emoji-stamps { display: flex; flex-direction: column; gap: 4px; }
</style>

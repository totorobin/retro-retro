import { ref, watch, onMounted } from 'vue';

const theme = ref<'light' | 'dark'>('light');

export function useTheme() {
  onMounted(() => {
    const stored = localStorage.getItem('retro-theme');
    if (stored === 'dark' || stored === 'light') {
      theme.value = stored;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark';
    }
    applyTheme(theme.value);
  });

  function applyTheme(value: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', value);
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('retro-theme', theme.value);
    applyTheme(theme.value);
  }

  watch(theme, applyTheme);

  return { theme, toggleTheme };
}

import { create } from 'zustand';

type Theme = 'light' | 'dark';
type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('ct_theme');
  if (saved === 'light' || saved === 'dark') return saved as Theme;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (t) => {
    set({ theme: t });
    localStorage.setItem('ct_theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    localStorage.setItem('ct_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  },
}));

document.documentElement.classList.toggle(
  'dark',
  (localStorage.getItem('ct_theme') ??
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark'
);

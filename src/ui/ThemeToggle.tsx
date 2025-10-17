import { useThemeStore } from '../store/theme';
import { Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ThemeToggle() {
  const theme = useThemeStore((t) => t.theme);
  const toggleTheme = useThemeStore((t) => t.toggleTheme);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </Button>
  );
}

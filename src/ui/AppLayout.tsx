import { NavLink, Outlet } from 'react-router';
import { LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import ThemeToggle from './ThemeToggle';

const linkBase =
  'text-zinc-600 dark:text-zinc-300 hover:text-blue-600 hover:underline underline-offset-4 decoration-2 transition-colors';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex w-full items-center justify-between max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="font-semibold text-xl">
              CourseTrack
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) => (isActive ? `${linkBase} text-blue-600 underline` : linkBase)}
            >
              Courses
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn size={16} />
                Login
              </Button>
            </NavLink>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

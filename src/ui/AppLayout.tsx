import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { useAuth } from '../store/auth';
import { toast } from 'sonner';

export default function AppLayout() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    toast.info('Logged out');
    // if they were on a protected route, send to home
    if (location.pathname.startsWith('/courses/')) {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex w-full items-center justify-between max-w-5xl mx-auto p-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-lg">
              CourseTrack
            </Link>
            <Link
              to="/courses"
              className="text-zinc-600 hover:text-blue-600 hover:underline underline-offset-4 decoration-2 transition-colors"
            >
              Courses
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">{user.email}</span>
              <button onClick={handleLogout} className="rounded-md border px-3 py-1.5">
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-zinc-600 hover:text-blue-600 hover:underline underline-offset-4 decoration-2 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}

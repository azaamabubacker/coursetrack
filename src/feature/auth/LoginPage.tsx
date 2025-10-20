import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../store/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    // "authenticate"
    login(email);
    toast.success('Logged in successfully!');

    // go back to where they tried to go, else /courses
    const next = location.state?.from ?? '/courses';
    navigate(next, { replace: true });
  }

  return (
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600"
        />

        <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2">
          Login
        </button>
      </form>
    </section>
  );
}

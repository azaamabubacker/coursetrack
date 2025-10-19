import { toast } from 'sonner';

export default function LoginPage() {
  function handleLogin() {
    console.log('clicked login button');
    toast.success('logged in successsfully');
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rouded-md border border-zinc-300 p-2 focus:border-blue-300 focus:ring-1 focus:ring-blue-600 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rouded-md border border-zinc-300 p-2 focus:border-blue-300 focus:ring-1 focus:ring-blue-600 outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 p-2 text-white font-semibold py-2 rounder-md hover:bg-blue-700 "
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

import { create } from 'zustand';
import { getSession, setSession, clearSession, type SessionData } from '../lib/auth/cookies';

type AuthState = {
  user: { email: string } | null;
  token: string | null;

  isAuthed: boolean;
  login: (email: string) => void; // password ignored in mock
  logout: () => void;
};

// initialize from cookie once
const initial = getSession();

export const useAuth = create<AuthState>((set) => ({
  user: initial ? { email: initial.email } : null,
  token: initial?.token ?? null,

  get isAuthed() {
    return Boolean(this.token);
  },

  login: (email) => {
    // create a fake token
    const payload: SessionData = { email, token: crypto.randomUUID() };
    setSession(payload);
    set({ user: { email }, token: payload.token });
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null });
  },
}));

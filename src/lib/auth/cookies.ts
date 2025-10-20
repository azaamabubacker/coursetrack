import Cookies from 'js-cookie';

const SESSION_KEY = 'ct_session';

export type SessionData = {
  token: string;
  email: string;
};

export function getSession(): SessionData | null {
  const raw = Cookies.get(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(data: SessionData) {
  Cookies.set(SESSION_KEY, JSON.stringify(data), { expires: 7 });
}

export function clearSession() {
  Cookies.remove(SESSION_KEY);
}

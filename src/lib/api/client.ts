import axios from 'axios';
import { buildMemoryStorage, setupCache } from 'axios-cache-interceptor';
import { getSession, clearSession } from '../auth/cookies';

const baseURL = 'http://localhost:5174';

// Create normal axios instance first
const raw = axios.create({ baseURL });

// Wrap with caching (optional)
export const api = setupCache(raw, {
  storage: buildMemoryStorage(),
  interpretHeader: false,
  ttl: 60_000,
});

// ✅ Add request interceptor
api.interceptors.request.use((config) => {
  const sess = getSession();
  if (sess?.token) {
    // Safely set header value (no spreading)
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${sess.token}`;
  }
  return config;
});

// ✅ Add response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearSession();
    }
    return Promise.reject(err);
  }
);

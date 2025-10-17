import axios from 'axios';
import { buildMemoryStorage, setupCache } from 'axios-cache-interceptor';

const baseURL = 'http://localhost:5174'; // mock api

export const api = setupCache(axios.create({ baseURL }), {
  storage: buildMemoryStorage(),
  interpretHeader: false,
  ttl: 60_000,
});

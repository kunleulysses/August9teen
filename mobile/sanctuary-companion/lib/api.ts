import axios from 'axios';
import { getSettings } from './settings';

export function api(jwt: string) {
  const baseURL = getSettings().apiUrl;
  const instance = axios.create({ baseURL, timeout: 12000 });
  instance.interceptors.request.use((cfg) => {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = `Bearer ${jwt}`;
    return cfg;
  });
  return instance;
}

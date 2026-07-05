import axios from 'axios';

/**
 * Central Axios instance — all API calls go through services using this instance.
 * JWT is stored in HTTP-only cookies by the backend; withCredentials sends cookies.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

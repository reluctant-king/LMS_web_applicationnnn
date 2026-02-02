import axios from 'axios';

// Use VITE_API_URL when available, otherwise fall back to current origin or localhost
const API_BASE = import.meta.env.VITE_API_URL || window?.location?.origin || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

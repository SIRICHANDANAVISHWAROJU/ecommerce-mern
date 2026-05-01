import axios from 'axios';

// Vite dev proxy forwards /api/* to http://localhost:5000
const api = axios.create({
  baseURL: '/api',
});

// Attach the JWT to every request if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

import axios from "axios";

const api = axios.create({
  // لازم تكون الدومين بس في Vercel env (بدون /health)
  // مثال: https://xxxxx.up.railway.app
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

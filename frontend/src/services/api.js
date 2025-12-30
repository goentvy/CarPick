// src/service/api.js (또는 src/services/api.js)
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const url = config.url || "";

  // ✅ 차량 조회(GET /cars, GET /cars/{id})는 토큰 안 붙임
  if (method === "get" && url.startsWith("/cars")) {
    return config;
  }

  const raw = localStorage.getItem("user-storage");
  if (raw) {
    const accessToken = JSON.parse(raw)?.state?.accessToken;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;

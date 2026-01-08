// src/service/api.js (또는 src/services/api.js)
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const url = config.url || "";

  // ✅ 공개 GET API들: 토큰 안 붙임
  const publicGetPrefixes = [
    "/cars",
    "/branches",
    "/dropzones",
    "/zone/map",
    "/notice"
  ];

  const isPublicGet =
    method === "get" && publicGetPrefixes.some((p) => url.startsWith(p));

  if (isPublicGet) return config;

  // ✅ 나머지는 토큰 붙이기
  const raw = localStorage.getItem("user-storage");
  if (raw) {
    try {
      const accessToken = JSON.parse(raw)?.state?.accessToken;
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    } catch {
      // JSON 깨져있으면 무시
    }
  }

  return config;
});

export default api;

// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// ✅ [추가] 백엔드 규격 yyyy-MM-dd HH:mm:ss 로 통일
const toBackendDateTime = (value) => {
  if (!value) return value;

  // Date 객체
  if (value instanceof Date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} `
      + `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }

  const s = String(value);

  // ISO: 2026-01-11T10:00:00 -> 2026-01-11 10:00:00
  if (s.includes("T")) return s.replace("T", " ").slice(0, 19);

  // 이미 공백 포맷이면 초 단위까지만
  return s.slice(0, 19);
};

// ✅ [추가] config.data / config.params 안에서 start/end 키만 정리 (과변환 방지)
const normalizeDateFields = (obj) => {
  if (!obj || typeof obj !== "object") return;

  const keys = ["startDateTime", "endDateTime", "startDatetime", "endDatetime"];
  keys.forEach((k) => {
    if (obj[k]) obj[k] = toBackendDateTime(obj[k]);
  });
};
//==============================
api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const url = config.url || "";

  // ✅ 공개 GET API들: 토큰 안 붙임
  const publicGetPrefixes = [
    "/cars",
    "/branches",
    "/dropzones",
    "/zone/map",
    "/notice",
  ];

  const isPublicGet =
    method === "get" && publicGetPrefixes.some((p) => url.startsWith(p));

  // ✅ [추가] 공개 GET 이든 아니든, 날짜 파라미터는 통일해도 무방 (쿼리만 정리)
  // - /cars?startDateTime=... 같은 케이스 방어
  normalizeDateFields(config.params);

  if (isPublicGet) return config;

  // ✅ [추가] 비공개 API는 body 날짜도 통일
  normalizeDateFields(config.data);

  // ✅ 나머지는 토큰 붙이기
  const raw = localStorage.getItem("user-storage");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      // ❌ 기존 (서로 다른 키라서 항상 undefined)
      // const accessToken = parsed?.state?.accessToken;

      // ✅ 수정: Header.jsx와 동일한 키로 통일
      const token =
        parsed?.state?.accessToken ||   // zustand persist 구조
        parsed?.accessToken ||
        parsed?.state?.token ||
        parsed?.token;
      // 혹시 단순 저장된 경우 대비

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (e) {
      console.error("토큰 파싱 실패", e);
    }
  }

  return config;
});

export default api;

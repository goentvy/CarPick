// api.js
import axios from "axios"; // 기본 Axios 인스턴스 생성
const api = axios.create({ 
  baseURL: "http://localhost:8080/api", // 백엔드 API 주소
}); 

// 요청 인터셉터 추가 → 매번 accessToken 자동으로 붙임 
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user-storage");
  if (raw) {
    const accessToken = JSON.parse(raw).state.accessToken;
    console.log(accessToken);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

export default api;
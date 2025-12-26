// src/service/carApi.js
import api from "./api";

/** 차량 상세 조회 */
export const getCarDetail = (carId) => api.get(`/cars/${carId}`);

/** (예시) 차량 목록 조회 - 너 백엔드에 있으면 */
export const getCarList = (params) => api.get("/cars", { params });

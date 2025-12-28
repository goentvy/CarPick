// src/services/carApi.js
import api from "./api";

/* 차량 목록 조회 */
export const getCarList = (params) => api.get("/cars", { params });

/* 차량 상세 조회 */
export const getCarDetail = (id) => {
  console.log("REQUEST:", `/api/cars/${id}`);
  return api.get(`/cars/${id}`);
};




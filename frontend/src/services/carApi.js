// src/service/carApi.js
import api from "./api";

/** 차량 상세 조회 */
export const getCarDetail = (carId) => api.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars/${carId}`);

/** 차량 목록 조회 **/
export const getCarList = (params) => api.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`, { params });

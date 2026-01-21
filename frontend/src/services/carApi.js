import api from "./api";

/** 차량 상세 조회 (V2 백엔드: @ModelAttribute specId+pickupBranchId 필수) */
export const getCarDetail = (specId, pickupBranchId, config) =>
  api.get(`/cars/${specId}`, {
    params: { specId, pickupBranchId },
    ...(config ?? {}),
  });

/** 차량 목록 조회 */
export const getCarList = (params) => api.get("/cars", { params });

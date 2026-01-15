import api from "./api.js";

/** 지점 목록 (홈/지도) */
export const getBranches = (config) => api.get("/branches", config);

/** 지점 상세 (카픽존 시트) */
export const getBranchDetail = (branchId, config) =>
  api.get(`/branches/${branchId}`, config);

/** 지점 기준 드롭존 목록 */
export const getDropzones = (branchId, config) =>
  api.get("/dropzones", { params: { branchId }, ...(config ?? {}) });

/** 드롭존 혼잡도 상태 */
export const getDropzoneStatus = (dropzoneId, config) =>
  api.get(`/dropzones/${dropzoneId}/status`, config);

/** 지도 집합 */
export const getZoneMap = (config) => api.get("/zone/map", config);

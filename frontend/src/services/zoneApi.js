import api from "./api.js";

/* -------------------------------
 * Branch
 * ----------------------------- */

/** 지점 목록 (홈/지도) */
export const getBranches = () => api.get("/branches");

/** 지점 상세 (카픽존 시트) */
export const getBranchDetail = (branchId) =>
  api.get(`/branches/${branchId}`);

/* -------------------------------
 * Dropzone
 * ----------------------------- */

/** 지점 기준 드롭존 목록 */
export const getDropzones = (branchId) =>
  api.get("/dropzones", { params: { branchId } });

/** 드롭존 혼잡도 상태 */
export const getDropzoneStatus = (dropzoneId) =>
  api.get(`/dropzones/${dropzoneId}/status`);

/**
 * 지도 집합: Branch + Dropzone 한 번에
 * GET /api/zone/map
 */
export const getZoneMap = () => api.get("/zone/map");
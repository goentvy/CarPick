import { useEffect, useState } from "react";
import { getBranchDetail } from "@/services/zoneApi.js";

/**
 * ✅ 선택된 BRANCH의 상세만 로드하는 훅
 * - branchId 바뀔 때마다 호출
 * - BRANCH 아닌 경우 자동 초기화
 */
export function useBranchDetail(selected) {
  const [branchDetail, setBranchDetail] = useState(null);
  const [branchDetailLoading, setBranchDetailLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!selected || selected.kind !== "BRANCH") {
        setBranchDetail(null);
        setBranchDetailLoading(false);
        return;
      }

      const branchId = selected.branchId;
      if (!branchId) {
        setBranchDetail(null);
        setBranchDetailLoading(false);
        return;
      }

      try {
        setBranchDetailLoading(true);
        const res = await getBranchDetail(branchId);
        if (!alive) return;
        setBranchDetail(res.data);
      } catch (e) {
        if (!alive) return;
        console.error("getBranchDetail fail", e);
        setBranchDetail(null);
      } finally {
        if (alive) setBranchDetailLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selected?.kind, selected?.branchId]);

  return { branchDetail, branchDetailLoading };
}

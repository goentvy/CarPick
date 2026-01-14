import { useEffect, useMemo, useState } from "react";

/**
 * ✅ Zone 선택/검색/파생데이터 훅
 * - viewMode에 따른 visibleItems
 * - selectedId 보정 + selected 계산
 * - DROP 선택 시 parentZone 찾기
 * - 검색 결과(results): BRANCH만
 * - 첫 지점 자동 선택(옵션)
 */
export function useZoneSelection({
  zones,
  branchItems,
  viewMode,
  q,
  firstBranch,
  onFirstPick, // (firstBranch) => void
}) {
  const [selectedId, setSelectedId] = useState(null);

  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zones;
    return zones.filter((it) => it.kind === viewMode);
  }, [viewMode, zones]);

  // selectedId 보정
  useEffect(() => {
    if (!visibleItems.length) return;

    const exists =
      selectedId != null && visibleItems.some((it) => it.id === selectedId);

    if (!exists) setSelectedId(visibleItems[0].id);
  }, [visibleItems, selectedId]);

  const selected = useMemo(() => {
    if (!visibleItems.length) return null;
    return visibleItems.find((it) => it.id === selectedId) ?? visibleItems[0];
  }, [visibleItems, selectedId]);

  // DROP이면 연결된 BRANCH 찾기
  const parentZone = useMemo(() => {
    if (!selected || selected.kind !== "DROP") return null;
    return branchItems.find((b) => b.id === selected.parentZoneId) ?? null;
  }, [selected, branchItems]);

  // 검색 결과는 BRANCH만
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return branchItems
      .filter((z) => (z.name + " " + z.address).toLowerCase().includes(kw))
      .slice(0, 8);
  }, [q, branchItems]);

  // 첫 지점 자동 선택 (부모에서 카메라 이동 등 부수효과 처리하도록 콜백)
  useEffect(() => {
    if (!firstBranch) return;
    setSelectedId((prev) => prev ?? firstBranch.id);
    onFirstPick?.(firstBranch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstBranch]);

  return {
    selectedId,
    setSelectedId,
    visibleItems,
    selected,
    parentZone,
    results,
  };
}

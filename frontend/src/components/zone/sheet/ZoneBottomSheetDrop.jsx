import { useEffect, useMemo, useRef, useState } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import { getCrowdBadge } from "../utils/zoneFormat.js";
import { getDropzoneStatus } from "@/services/zoneApi.js"; // ✅ 이미 만들어둔 API

export default function ZoneBottomSheetDrop({ open, onClose, dropZone, onHeightChange }) {
  const show = Boolean(open && dropZone);
  const sheetRef = useRef(null);

  // ✅ 혼잡도 상태(별도 API)
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusDto, setStatusDto] = useState(null);

  useEffect(() => {
    if (!show) {
      setStatusDto(null);
      setStatusLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setStatusLoading(true);

        // ✅ dropZone은 /zone/map에서 온 데이터 → dropzoneId가 필요
        // 지금 useZoneMap에서 id를 "D-1"로 만들었으니 파싱해주자.
        const rawId = String(dropZone.id || "");
        const dropzoneId = rawId.startsWith("D-") ? Number(rawId.slice(2)) : Number(dropZone.dropzoneId);

        const res = await getDropzoneStatus(dropzoneId);
        if (!alive) return;

        setStatusDto(res.data); // {status,label,measuredAt,...}
      } catch (e) {
        if (alive) setStatusDto(null);
      } finally {
        if (alive) setStatusLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [show, dropZone?.id]);

  // ✅ 헤더에 넘길 crowdBadge 만들기
  const crowdBadge = useMemo(() => {
    // statusDto.status: "FREE" | "NORMAL" | "CROWDED" | "FULL" | "INACTIVE"
    const base = getCrowdBadge(statusDto?.status);
    if (!base) return null;

    // label을 백엔드에서 이미 주니까 있으면 그걸 우선 사용
    return { ...base, label: statusDto?.label ?? base.label };
  }, [statusDto]);

  // ✅ 높이 측정(기존 유지)
  useEffect(() => {
    if (!onHeightChange) return;
    if (!show) return void onHeightChange("0px");

    const el = sheetRef.current;
    if (!el) return;

    const pushHeight = () => onHeightChange(`${Math.round(el.getBoundingClientRect().height)}px`);
    pushHeight();

    const ro = new ResizeObserver(pushHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [show, onHeightChange, dropZone?.id]);

  return (
    <div className={[
      "fixed left-1/2 -translate-x-1/2 bottom-0 z-90 w-full max-w-[640px]",
      show ? "pointer-events-auto" : "pointer-events-none",
    ].join(" ")}>
      {show && (
        <button type="button" aria-label="닫기" className="fixed inset-0 z-80 bg-black/0" onClick={onClose} />
      )}

      <div
        ref={sheetRef}
        className={[
          "relative z-90 rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-[height,transform] duration-300 ease-out",
          "h-[30dvh]",
          show ? "translate-y-0" : "translate-y-[105%]",
        ].join(" ")}
      >
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </div>

        <div className="h-[calc(100%-20px)] overflow-hidden pb-3">
          <ZoneSheetHeader
            kind="DROP"
            name={dropZone?.name}
            address={dropZone?.address}
            images={dropZone?.images}
            crowdBadge={crowdBadge}
          // ✅ (선택) 혼잡도 로딩 중 표시를 하고 싶으면 header에 prop 하나 더
          // crowdLoading={statusLoading}
          />

          {/* (선택) 로딩 텍스트를 시트 안에 간단히 추가 */}
          {statusLoading && (
            <div className="px-4 mt-2 text-xs text-black/40">혼잡도 불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState, useCallback } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import { copyToClipboard } from "../utils/clipboard.js";
import { getDropzoneStatus } from "@/services/zoneApi.js"; // ✅ /api/dropzones/{id}/status

/**
 * ✅ ZoneBottomSheetDrop (MVP / 기본 완성 버전)
 * - 목표: "기본 정보"를 정확히 보여주기
 * - 30% / 70% 높이 토글
 * - 드롭존 status는 백엔드에서 lazy-load (1회) + 캐시
 */
export default function ZoneBottomSheetDrop({
  open,
  onClose,
  dropZone,   // CarPickZonePage에서 만든 DROP 객체 (id: "D-123", name, address, walkingTimeMin, locationDesc, isActive, ...)
  parentZone, // 연결된 BRANCH 객체 (name, address)
}) {
  const show = Boolean(open && dropZone);

  // ✅ 30%/70% 토글
  const [expanded, setExpanded] = useState(false);

  // ✅ status state
  const [statusLoading, setStatusLoading] = useState(false);
  const [status, setStatus] = useState(null); // { status, label, measuredAt, occupancyRate... } 형태

  // ✅ 드롭존 ID 파싱 ("D-123" -> 123)
  const dropzoneId = useMemo(() => {
    const raw = dropZone?.id;
    if (!raw) return null;
    // "D-123" 또는 "123" 모두 대응
    if (typeof raw === "string" && raw.startsWith("D-")) return Number(raw.slice(2));
    return Number(raw);
  }, [dropZone?.id]);

  // ✅ dropZone 바뀌면 UI 초기화
  useEffect(() => {
    setExpanded(false);
    setStatus(null);
    setStatusLoading(false);
  }, [dropZone?.id]);

  // ✅ 드롭존 status 로딩 (열렸을 때 1회)
  useEffect(() => {
    if (!show) return;
    if (!dropzoneId || Number.isNaN(dropzoneId)) return;

    let alive = true;

    (async () => {
      try {
        setStatusLoading(true);

        // ✅ isActive=false면 굳이 호출 안 해도 되지만,
        // 서버에서 INACTIVE 내려주도록 했으면 호출해도 됨.
        // 여기서는 "비활성"이면 로컬에서 고정 처리.
        if (dropZone?.isActive === false) {
          if (!alive) return;
          setStatus({
            status: "INACTIVE",
            label: "운영중지",
            measuredAt: null,
          });
          return;
        }

        const res = await getDropzoneStatus(dropzoneId);
        if (!alive) return;

        setStatus(res.data ?? null);
      } catch (e) {
        console.error("dropzone status load fail", e);
        if (!alive) return;
        setStatus(null);
      } finally {
        if (alive) setStatusLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [show, dropzoneId, dropZone?.isActive]);

  // ✅ 표시용 statusLabel
  const statusLabel = useMemo(() => {
    if (statusLoading) return "상태 확인 중…";
    if (status?.label) return status.label;
    // fallback: isActive 기반 최소 처리
    if (dropZone?.isActive === false) return "운영중지";
    return "상태 정보 없음";
  }, [statusLoading, status?.label, dropZone?.isActive]);

  // ✅ header에 넘길 crowdLevel 매핑 (ZoneSheetHeader가 crowdLevel로 배지 생성하는 구조라서)
  // - 네 getCrowdBadge 구현에 맞춰서 문자열/코드로 맞추면 됨.
  const crowdLevel = useMemo(() => {
    // INACTIVE는 헤더에서 따로 처리하기 애매하면 "INACTIVE"로 보내고
    // getCrowdBadge에서 케이스 추가하는 게 깔끔함.
    return status?.status ?? null; // 예: FREE/NORMAL/CROWDED/FULL/INACTIVE
  }, [status?.status]);

  // ✅ 시트 높이: 30% / 70%
  const sheetHeightClass = expanded ? "h-[70dvh]" : "h-[30dvh]";

  const onCopyAddress = useCallback(async () => {
    await copyToClipboard(dropZone?.address ?? "");
    // TODO: toast("주소가 복사됐어요")
  }, [dropZone?.address]);

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-0 z-[90] w-full max-w-[640px]",
        show ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* backdrop */}
      {show && (
        <button
          type="button"
          aria-label="닫기"
          className="fixed inset-0 z-[80] bg-black/20"
          onClick={onClose}
        />
      )}

      {/* sheet */}
      <div
        className={[
          "relative z-[90] rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-[height,transform] duration-300 ease-out",
          sheetHeightClass,
          show ? "translate-y-0" : "translate-y-[105%]",
        ].join(" ")}
      >
        {/* grabber */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full pt-2 pb-2 flex justify-center"
          aria-label={expanded ? "접기" : "펼치기"}
        >
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </button>

        {/* content */}
        <div className="h-[calc(100%-20px)] overflow-auto pb-8">
          <ZoneSheetHeader
            kind="DROP"
            name={dropZone?.name}
            address={dropZone?.address}
            // ✅ 드롭존은 보통 연중무휴/24h 느낌이라 open/close가 없을 수 있음
            // 헤더에서 openLabel이 애매하면 getOpenLabel이 null 처리하도록 하거나,
            // 아예 serviceHours 같은 텍스트를 별도로 보여주는 방식도 가능.
            open={null}
            close={null}
            phone={null}
            images={dropZone?.images}
            crowdLevel={crowdLevel} // ✅ 서버 status 기반
            onCopyAddress={onCopyAddress}
            onCall={null}
          />

          {/* ✅ 핵심 요약(30%에서도 보여야 함) */}
          <div className="px-4 mt-3">
            <div className="rounded-2xl border border-black/5 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-[#111]">현재 상태</div>
                <div className="text-xs font-semibold text-black/70">
                  {statusLabel}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {typeof dropZone?.walkingTimeMin === "number" ? (
                  <span className="rounded-full bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/60">
                    도보 {dropZone.walkingTimeMin}분
                  </span>
                ) : null}

                {parentZone?.name ? (
                  <span className="rounded-full bg-[#EEF3FF] px-2 py-1 text-[11px] font-semibold text-[#0A56FF]">
                    연결: {parentZone.name}
                  </span>
                ) : null}

                {status?.measuredAt ? (
                  <span className="rounded-full bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/50">
                    업데이트: {String(status.measuredAt).replace("T", " ").slice(0, 16)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* ✅ 연결된 카픽존 카드 */}
          {parentZone ? (
            <div className="px-4 mt-3">
              <div className="rounded-2xl bg-[#EEF3FF] p-3">
                <div className="text-xs font-semibold text-[#2B56FF]">연결된 카픽존</div>
                <div className="mt-1 text-sm font-semibold text-[#111] truncate">
                  {parentZone.name}
                </div>
                <div className="mt-1 text-xs text-black/60 truncate">
                  {parentZone.address}
                </div>
              </div>
            </div>
          ) : null}

          {/* ✅ 70%에서만: 위치 설명 */}
          {expanded ? (
            <div className="px-4 mt-3">
              <div className="rounded-2xl bg-[#F7F7F7] p-3">
                <div className="text-xs font-semibold text-[#111]">위치 설명</div>
                <div className="mt-1 text-sm text-[#111] leading-relaxed">
                  {dropZone?.locationDesc ?? "상세 위치 설명이 아직 없어요."}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

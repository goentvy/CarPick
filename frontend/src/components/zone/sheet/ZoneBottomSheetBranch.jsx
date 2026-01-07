import { useEffect, useMemo, useRef, useState } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import { copyToClipboard } from "../utils/clipboard.js";
import { formatNowKR, formatMoneyKRW, getAvailabilityBadge } from "../utils/zoneFormat.js";

/**
 * ✅ 카픽존(Branch) BottomSheet
 * - expanded 토글(52dvh/88dvh)
 * - ✅ 실제 렌더된 시트 높이(px)를 onHeightChange로 부모에게 전달
 */
export default function ZoneBottomSheetBranch({
  open,
  onClose,
  zone,
  onPickup,
  onCarClick,
  onHeightChange,
}) {
  const show = Boolean(open && zone);
  const [expanded, setExpanded] = useState(false);

  // ✅ 시트 DOM 참조
  const sheetRef = useRef(null);

  // ✅ zone 바뀌면 확장 접기
  useEffect(() => setExpanded(false), [zone?.id]);

  // ✅ 높이 클래스(디자인용)
  const sheetHeightClass = expanded ? "h-[88dvh]" : "h-[52dvh]";

  /**
   * ✅ 실제 시트 높이를 px로 측정해서 부모에 전달
   * - ResizeObserver: 높이가 바뀌는 순간(토글/콘텐츠 변화/주소창 변화) 자동 반영
   */
  useEffect(() => {
    if (!onHeightChange) return;

    // 닫히면 0
    if (!show) {
      onHeightChange("0px");
      return;
    }

    const el = sheetRef.current;
    if (!el) return;

    const pushHeight = () => {
      const h = el.getBoundingClientRect().height;
      onHeightChange(`${Math.round(h)}px`);
    };

    // 최초 1회
    pushHeight();

    // 높이 변화 감지
    const ro = new ResizeObserver(() => pushHeight());
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [show, expanded, zone?.id, onHeightChange]);

  const nowText = useMemo(() => (show ? formatNowKR() : ""), [show]);

  const fastPickTop3 = useMemo(() => {
    const cars = zone?.cars ?? [];
    return cars
      .slice()
      .sort((a, b) => {
        const aReady = a.availabilityStatus === "READY" ? 0 : 1;
        const bReady = b.availabilityStatus === "READY" ? 0 : 1;
        if (aReady !== bReady) return aReady - bReady;

        const aEta = a.etaDepartureMin ?? 9999;
        const bEta = b.etaDepartureMin ?? 9999;
        if (aEta !== bEta) return aEta - bEta;

        const aPrice = a.priceDay ?? 999999999;
        const bPrice = b.priceDay ?? 999999999;
        return aPrice - bPrice;
      })
      .slice(0, 3);
  }, [zone]);

  const onCopyAddress = async () => {
    await copyToClipboard(zone?.address ?? "");
  };

  const onCall = () => {
    if (!zone?.phone) return;
    window.location.href = `tel:${zone.phone}`;
  };

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-0 z-[90] w-full max-w-[640px]",
        show ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {show && (
        <button
          type="button"
          aria-label="닫기"
          className="fixed inset-0 z-[80] bg-black/0"
          onClick={onClose}
        />
      )}

      {/* ✅ 여기 ref가 핵심 */}
      <div
        ref={sheetRef}
        className={[
          "relative z-[90] rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-[height,transform] duration-300 ease-out",
          sheetHeightClass,
          show ? "translate-y-0" : "translate-y-[105%]",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full pt-2 pb-2 flex justify-center"
          aria-label={expanded ? "접기" : "펼치기"}
        >
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </button>

        <div className="h-[calc(100%-20px)] overflow-auto pb-24">
          <ZoneSheetHeader
            kind="BRANCH"
            name={zone?.name}
            address={zone?.address}
            open={zone?.open}
            close={zone?.close}
            phone={zone?.phone}
            images={zone?.images}
            onCopyAddress={onCopyAddress}
            onCall={onCall}
          />

          <div className="px-4 mt-4">
            <div className="rounded-2xl bg-[#F3F7FF] p-3">
              <div className="text-xs font-semibold text-[#2B56FF]">카픽존 안내</div>
              <div className="mt-1 text-sm text-[#111] leading-relaxed">
                {!expanded
                  ? zone?.summary ??
                  "도착하면 바로 출발할 수 있도록 픽업 과정을 단순화한 카픽의 표준 거점이에요."
                  : zone?.description ??
                  "이 카픽존은 빠른 출차를 위해 대기/서류 과정을 최소화한 거점이에요."}
              </div>
            </div>
          </div>

          <div className="px-4 mt-4">
            <div className="flex items-end justify-between">
              <div className="text-sm font-semibold text-[#111]">바로 출발 추천 3대</div>
              <div className="text-[11px] text-black/45">기준: {nowText} 출발</div>
            </div>

            <div className="mt-2 space-y-2">
              {fastPickTop3.map((c) => {
                const b = getAvailabilityBadge(c.availabilityStatus);
                return (
                  <button
                    key={c.carId}
                    type="button"
                    onClick={() => onCarClick?.(c)}
                    className="w-full rounded-2xl border border-black/5 bg-white p-3 flex items-center justify-between gap-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#111] truncate">{c.name}</div>
                      <div className="mt-1 text-xs text-black/55">
                        {c.fuel} · {c.people}인
                        {typeof c.priceDay === "number" ? (
                          <> · 1일 {formatMoneyKRW(c.priceDay)}원~</>
                        ) : null}
                      </div>
                    </div>
                    <div className={["shrink-0 rounded-xl px-2 py-1 text-[11px] font-semibold", b.cls].join(" ")}>
                      {b.label}
                    </div>
                  </button>
                );
              })}

              {(zone?.cars ?? []).length === 0 && (
                <div className="rounded-2xl border border-black/5 bg-white p-3 text-sm text-black/60">
                  현재 표시할 차량이 없어요.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

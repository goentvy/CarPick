import { useEffect, useRef } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";

/**
 * ✅ Branch BottomSheet (30% 기준)
 * - 스샷 레이아웃: Header(정보+배지+이미지)까지만
 * - 스크롤 없음
 * - onHeightChange는 지도 보정 때문에 유지
 */
export default function ZoneBottomSheetBranch({
  open,
  onClose,
  zone,
  onHeightChange,
}) {
  const show = Boolean(open && zone);
  const sheetRef = useRef(null);

  // ✅ 실제 높이(px) 측정 → 부모 전달(지도 y보정용)
  useEffect(() => {
    if (!onHeightChange) return;

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

    pushHeight();
    const ro = new ResizeObserver(pushHeight);
    ro.observe(el);

    return () => ro.disconnect();
  }, [show, onHeightChange, zone?.id]);

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-0 z-90 w-full max-w-[640px]",
        show ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* ✅ backdrop(투명 클릭 영역) */}
      {show && (
        <button
          type="button"
          aria-label="닫기"
          className="fixed inset-0 z-80 bg-black/0"
          onClick={onClose}
        />
      )}

      <div
        ref={sheetRef}
        className={[
          "relative z-90 rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-[height,transform] duration-300 ease-out",
          "h-[clamp(320px,37dvh,420px)]",
          show ? "translate-y-0" : "translate-y-[105%]",
        ].join(" ")}
      >
        {/* ✅ grabber(스샷에 있는 회색 바) */}
        <div className="w-full pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </div>

        {/* ✅ 30%는 스크롤 없음 */}
        <div className="h-[calc(100%-20px)] overflow-hidden pb-3">
          <ZoneSheetHeader
            kind="BRANCH"
            name={zone?.name}
            subLabel={zone?.subLabel ?? "카픽 센터"}
            address={zone?.address}

            openTime={zone?.openTime}
            closeTime={zone?.closeTime}

            openStatus={zone?.openStatus}
            openLabel={zone?.openLabel}

            imageUrl={zone?.imageUrl}
            availabilityBadge={zone?.availabilityBadge}
          />
        </div>
      </div>
    </div>
  );
}

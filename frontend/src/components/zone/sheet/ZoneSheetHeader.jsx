import { getOpenLabel, getCrowdBadge } from "../utils/zoneFormat.js";

// ✅ 공통 헤더: 이름/배지/영업중/주소/복사/전화/이미지 (+ 드롭존 혼잡도)
export default function ZoneSheetHeader({
  kind, // "BRANCH" | "DROP"
  name,
  address,
  open,
  close,
  phone,
  images = [],
  crowdLevel, // 드롭존용
  onCopyAddress,
  onCall,
}) {
  const openLabel = getOpenLabel(open, close);
  const crowd = kind === "DROP" ? getCrowdBadge(crowdLevel) : null;

  return (
    <div className="px-4 pt-1">
      {/* 상단 라인 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={[
              "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold",
              kind === "BRANCH" ? "bg-[#0A56FF] text-white" : "bg-black/5 text-black/60",
            ].join(" ")}
          >
            {kind === "BRANCH" ? "카픽존" : "드롭존"}
          </span>

          <div className="text-[11px] text-black/55 truncate">{openLabel}</div>
        </div>

        {crowd && (
          <span className={["shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold", crowd.cls].join(" ")}>
            {crowd.label}
          </span>
        )}
      </div>

      {/* 타이틀/주소 */}
      <div className="mt-2">
        <div className="text-[16px] font-semibold text-[#111] truncate">{name}</div>
        <div className="mt-1 text-xs text-black/60 truncate">{address}</div>

        {/* 액션: 주소 복사 / 전화 */}
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onCopyAddress}
            className="h-8 px-3 rounded-full text-xs font-semibold bg-black/5 text-black/70 active:scale-[0.99] transition"
          >
            주소 복사
          </button>

          {phone ? (
            <button
              type="button"
              onClick={onCall}
              className="h-8 px-3 rounded-full text-xs font-semibold bg-black/5 text-black/70 active:scale-[0.99] transition"
            >
              전화
            </button>
          ) : null}
        </div>
      </div>

      {/* 이미지(썸네일 1장) */}
      {images?.length > 0 ? (
        <div className="mt-3">
          <div className="rounded-2xl overflow-hidden border border-black/5 bg-black/[0.02]">
            <img src={images[0]} alt="" className="w-full h-[140px] object-cover" loading="lazy" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

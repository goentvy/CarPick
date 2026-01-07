import { getOpenLabel, getCrowdBadge } from "../utils/zoneFormat.js";

/**
 * ✅ ZoneSheetHeader (통일 헤더라인 버전)
 * - 상단 라인 레이아웃은 BRANCH/DROP 공통
 *   왼쪽: 종류 배지
 *   오른쪽: 상태 배지들(영업, 혼잡 등)
 */
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
  // ✅ 영업라벨 (open/close 없으면 "정보없음" 같은 값이 반환되게 utils에서 처리 권장)
  const openLabel = getOpenLabel(open, close);

  // ✅ 드롭존 혼잡 배지
  const crowd = kind === "DROP" ? getCrowdBadge(crowdLevel) : null;

  // ✅ 배지 공통 클래스
  const pillBase = "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold";

  // ✅ 종류 배지 스타일
  const kindPill =
    kind === "BRANCH"
      ? "bg-[#0A56FF] text-white"
      : "bg-black/5 text-black/60";

  // ✅ 상태 배지 스타일(영업/기본)
  const openPillCls = "bg-black/5 text-black/70";

  return (
    <div className="px-4 pt-1">
      {/* ✅ 상단 라인: BRANCH/DROP 동일 레이아웃 */}
      <div className="flex items-start justify-between gap-2">
        {/* 왼쪽: 종류 */}
        <div className="flex items-center gap-2 min-w-0">
          <span className={[pillBase, kindPill].join(" ")}>
            {kind === "BRANCH" ? "카픽존" : "드롭존"}
          </span>
        </div>

        {/* 오른쪽: 상태 배지들 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* ✅ BRANCH도 배지로 통일 (원하면 BRANCH는 숨길 수도 있음) */}
          {openLabel ? (
            <span className={[pillBase, openPillCls].join(" ")}>
              {openLabel}
            </span>
          ) : null}

          {/* ✅ DROP만 혼잡 배지 추가 */}
          {crowd ? (
            <span className={[pillBase, crowd.cls].join(" ")}>
              {crowd.label}
            </span>
          ) : null}
        </div>
      </div>

      {/* ✅ 타이틀/주소 */}
      <div className="mt-2">
        <div className="text-[16px] font-semibold text-[#111] truncate">
          {name}
        </div>
        <div className="mt-1 text-xs text-black/60 truncate">{address}</div>

        {/* ✅ 액션 */}
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

      {/* ✅ 이미지 */}
      {images?.length > 0 ? (
        <div className="mt-3">
          <div className="rounded-2xl overflow-hidden border border-black/5 bg-black/[0.02]">
            <img
              src={images[0]}
              alt=""
              className="w-full h-[140px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

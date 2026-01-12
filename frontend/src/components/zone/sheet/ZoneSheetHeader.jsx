import { getOpenLabel } from "../utils/zoneFormat.js";
/*
 * ZoneSheetHeader (30% 기준: 스샷 레이아웃)
 * - 좌: 이름 / 서브 / 영업라벨 / 주소
 * - 우: 종류 배지(카픽존=파랑, 드롭존=검정)
 * - 아래: 대표 이미지 1장
 */
export default function ZoneSheetHeader({
  kind = "BRANCH", // "BRANCH" | "DROP"
  name = "",
  subLabel = "", // 예: "카픽 센터" (없으면 빈값)
  address = "",
  openTime,
  closeTime,
  openStatus,
  openLabel, // "영업중" | "영업종료"
  images = [],

  crowdBadge = null, // 드롭존 혼잡도 배지
  metaLabel = "", // ✅ DROP용: "24시간 반납 가능"
}) {

  // 영업 라벨(예: "영업중", "영업종료", "정보없음" 등)
  const label = getOpenLabel({ openTime, closeTime, openStatus, openLabel });

  // DROP이면 metaLabel 우선, 아니면 기존 영업 라벨
  const displayLabel = kind === "DROP" ? metaLabel : label;

  // 배지 공통 스타일
  const pillBase = "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold";

  // 종류 배지 컬러 규칙
  // - 카픽존: 파랑
  // - 드롭존: 검정
  const kindPillCls =
    kind === "BRANCH" ? "bg-[#0A56FF] text-white" : "bg-[#111] text-white";

  // 이미지 1장만(30% 기준)
  const coverImg = Array.isArray(images) ? images[0] : null;

  return (
    <div className="px-5 pt-2 ">
      {/* 상단: 좌(정보) / 우(배지) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">

          {/* 이름 + 서브라벨(작게) */}
          <div className="flex items-end gap-2 min-w-0">
            <div className="text-[16px] font-semibold text-[#111] truncate">
              {name || "-"}
            </div>

            {subLabel ? (
              <div className="text-[11px] text-black/45 truncate">
                {subLabel}
              </div>
            ) : null}
          </div>

          {/*영업정보 자리(여기에 DROP: 24시간 반납 가능)*/}
          {displayLabel ? (
            <div className="mt-1 text-xs font-semibold text-[#0A56FF]">
              {displayLabel}
            </div>
          ) : null}


          {/* 주소(한 줄) */}
          {address ? (
            <div className="mt-1 text-xs text-black/45 truncate">
              {address}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1 shrink-0">

          {/* (1) 상태 배지 — 드롭존일 때만 */}
          {kind === "DROP" && crowdBadge && (
            <span className={`${pillBase} ${crowdBadge.cls}`}>
              {crowdBadge.label}
            </span>
          )}

          {/* 종류 배지 */}
          <span className={[pillBase, kindPillCls].join(" ")}>
            {kind === "BRANCH" ? "카픽존" : "드롭존"}
          </span>
        </div>
      </div>

      {/* 대표 이미지 */}

      <div className="mt-3">
        <div className="rounded-2xl overflow-hidden border border-black/5 bg-black/10">
          {coverImg ? (
            <img
              src={coverImg}
              alt=""
              className="w-full h-[180px] object-cover"
            />
          ) : (
            // 이미지 없을 때도 영역 유지
            <div className="w-full h-[180px]" />
          )}
        </div>
      </div>

    </div>
  );
}

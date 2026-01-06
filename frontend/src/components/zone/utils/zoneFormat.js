// ✅ zoneFormat.js
// 공통 포맷 함수 모음 (주석 포함)

export function formatMoneyKRW(n) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("ko-KR");
}

export function formatNowKR() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi}`;
}

/** ✅ 영업중 표기(간단 MVP)
 *  - open/close가 있으면 "영업중 · ~close" 형태
 *  - 없으면 "영업 정보" */
export function getOpenLabel(open, close) {
  if (close) return `영업중 · ~${close}`;
  if (open) return `영업중 · ${open}`;
  return "영업 정보";
}

/** ✅ 혼잡도 라벨(드롭존)
 *  - FREE / NORMAL / CROWDED */
export function getCrowdBadge(crowdLevel) {
  if (crowdLevel === "CROWDED") return { label: "혼잡", cls: "bg-[#FFE9A8] text-black/80" };
  if (crowdLevel === "NORMAL") return { label: "보통", cls: "bg-black/5 text-black/60" };
  if (crowdLevel === "FREE") return { label: "여유", cls: "bg-[#E7EEFF] text-[#0A56FF]" };
  return null;
}

/** ✅ 출차 상태 뱃지(카픽존)
 *  - READY/CLEANING/CHECKING 등 */
export function getAvailabilityBadge(status) {
  switch (status) {
    case "READY":
      return { label: "지금 출발", cls: "bg-[#0A56FF] text-white" };
    case "CLEANING":
      return { label: "정리 중", cls: "bg-black/5 text-black/60" };
    case "CHECKING":
      return { label: "점검 중", cls: "bg-black/5 text-black/60" };
    default:
      return { label: "예약 가능", cls: "bg-black/5 text-black/60" };
  }
}

/** ✅ 드롭존 방문자 데이터 요약
 *  visitorsByHour: [{hour: 9, count: 12}, ...]
 */
export function summarizeVisitorsByHour(visitorsByHour = []) {
  if (!Array.isArray(visitorsByHour) || visitorsByHour.length === 0) return null;

  const sorted = visitorsByHour.slice().sort((a, b) => (a.count ?? 0) - (b.count ?? 0));
  const least = sorted[0];
  const most = sorted[sorted.length - 1];

  return {
    leastHour: least?.hour,
    leastCount: least?.count,
    mostHour: most?.hour,
    mostCount: most?.count,
  };
}

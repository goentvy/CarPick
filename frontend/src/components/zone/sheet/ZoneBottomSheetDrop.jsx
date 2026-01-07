import { useEffect, useMemo, useState } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import { copyToClipboard } from "../utils/clipboard.js";
import { summarizeVisitorsByHour } from "../utils/zoneFormat.js";

/**
 * ✅ 조회 중심 DropZone BottomSheet (개선판)
 * - "조회"가 강점이므로: 방문자 데이터(혼잡/여유)를 접힘 상태에서도 바로 노출
 * - expanded는: 동선/설명/전체 상세(24시간) 같은 부가정보로
 */
export default function ZoneBottomSheetDrop({
  open,
  onClose,
  dropZone, // DROP 객체
  parentZone, // 연결된 BRANCH
  onReturnDrop, // (선택) 반납 액션 연결 가능
}) {
  const show = !!open && !!dropZone;

  // ✅ 접힘/펼침 (펼침은 상세 설명 + 전체 데이터)
  const [expanded, setExpanded] = useState(false);

  // ✅ 조회 방식 토글: "BAR"(미니 그래프) | "LIST"(리스트)
  const [viewMode, setViewMode] = useState("BAR");

  // ✅ dropZone이 바뀌면 초기화
  useEffect(() => {
    setExpanded(false);
    setViewMode("BAR");
  }, [dropZone?.id]);

  const sheetHeightClass = expanded ? "h-[88dvh]" : "h-[62dvh]"; // 조회 강화: 기본 높이 약간 ↑

  // ✅ visitorsByHour 정규화(조회 안정성)
  const visitors = useMemo(() => {
    const raw = dropZone?.visitorsByHour;
    if (!Array.isArray(raw)) return [];
    // hour 정렬 + count 기본값 보정
    return raw
      .map((v) => ({
        hour: Number(v.hour),
        count: Number(v.count ?? 0),
      }))
      .filter((v) => Number.isFinite(v.hour))
      .sort((a, b) => a.hour - b.hour);
  }, [dropZone?.visitorsByHour]);

  // ✅ 요약(가장 여유/혼잡)
  const visitorsSummary = useMemo(() => {
    return summarizeVisitorsByHour(visitors);
  }, [visitors]);

  // ✅ 그래프용 maxCount
  const maxCount = useMemo(() => {
    if (!visitors.length) return 0;
    return Math.max(...visitors.map((v) => v.count));
  }, [visitors]);

  // ✅ "추천 시간대" (여유 시간대 근처로 단순 추천)
  const recommendedHour = useMemo(() => {
    if (!visitorsSummary) return null;
    // 가장 여유 시간대를 추천으로 사용 (추가 로직 원하면 여기 확장)
    return visitorsSummary.leastHour;
  }, [visitorsSummary]);

  const onCopyAddress = async () => {
    await copyToClipboard(dropZone?.address);
    // TODO: toast("주소가 복사됐어요")
  };

  const onCall = () => {
    if (!dropZone?.phone) return;
    window.location.href = `tel:${dropZone.phone}`;
  };

  // ✅ 시간 포맷 유틸
  const hh = (h) => String(Number(h)).padStart(2, "0");

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-0 z-[90] w-full max-w-[640px]",
        show ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* ✅ backdrop: 조회 집중을 위해 약한 딤 추천 */}
      {show && (
        <button
          type="button"
          aria-label="닫기"
          className="fixed inset-0 z-[80] bg-black/20"
          onClick={onClose}
        />
      )}

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

        {/* ✅ 스크롤 컨텐츠 */}
        <div className="h-[calc(100%-20px)] overflow-auto pb-24">
          <ZoneSheetHeader
            kind="DROP"
            name={dropZone?.name}
            address={dropZone?.address}
            open={dropZone?.open}
            close={dropZone?.close}
            phone={dropZone?.phone}
            images={dropZone?.images}
            crowdLevel={dropZone?.crowdLevel}
            onCopyAddress={onCopyAddress}
            onCall={onCall}
          />

          {/* ✅ 조회 최우선: "요약 카드"를 상단에 크게 + 스티키(스크롤 중에도 판단 유지) */}
          <div className="px-4 mt-3 sticky top-0 z-10 bg-white/95 backdrop-blur">
            <div className="rounded-2xl border border-black/5 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-[#111]">혼잡 조회</div>

                {/* 조회 모드 토글 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("BAR")}
                    className={[
                      "px-3 py-1 rounded-full text-[11px] font-semibold border",
                      viewMode === "BAR"
                        ? "bg-[#0A56FF] text-white border-[#0A56FF]"
                        : "bg-white text-black/60 border-black/10",
                    ].join(" ")}
                    aria-pressed={viewMode === "BAR"}
                  >
                    그래프
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("LIST")}
                    className={[
                      "px-3 py-1 rounded-full text-[11px] font-semibold border",
                      viewMode === "LIST"
                        ? "bg-[#0A56FF] text-white border-[#0A56FF]"
                        : "bg-white text-black/60 border-black/10",
                    ].join(" ")}
                    aria-pressed={viewMode === "LIST"}
                  >
                    리스트
                  </button>
                </div>
              </div>

              {/* ✅ 요약 텍스트 (조회 핵심) */}
              {visitorsSummary ? (
                <div className="mt-2 text-xs text-black/70 leading-relaxed">
                  가장 여유:{" "}
                  <b className="text-black">{hh(visitorsSummary.leastHour)}:00</b>{" "}
                  ({visitorsSummary.leastCount ?? 0}명) · 가장 혼잡:{" "}
                  <b className="text-black">{hh(visitorsSummary.mostHour)}:00</b>{" "}
                  ({visitorsSummary.mostCount ?? 0}명)
                  {recommendedHour != null ? (
                    <>
                      {" "}
                      · 추천:{" "}
                      <b className="text-black">{hh(recommendedHour)}:00</b>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="mt-2 text-xs text-black/50">
                  방문자 데이터가 아직 없어요.
                </div>
              )}
            </div>
          </div>

          {/* ✅ 연결된 카픽존 */}
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

          {/* ✅ 조회 본체: 접힘 상태에서도 "시간대 방문자"가 메인 */}
          <div className="px-4 mt-3">
            <div className="rounded-2xl border border-black/5 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-[#111]">시간대 방문자</div>
                <div className="text-[11px] text-black/45">
                  {expanded ? "전체" : "핵심만"} 보기
                </div>
              </div>

              {!visitors.length ? (
                <div className="mt-2 text-xs text-black/50">
                  표시할 데이터가 없어요.
                </div>
              ) : viewMode === "BAR" ? (
                // ✅ 그래프(미니 바 차트): 조회에 최적
                <div className="mt-3">
                  <div className="flex items-end gap-1 h-16">
                    {(expanded ? visitors : visitors.slice(0, 12)).map((v) => {
                      const ratio = maxCount > 0 ? v.count / maxCount : 0;
                      const hPx = Math.max(6, Math.round(ratio * 64)); // 최소 높이 보장
                      const isLeast = visitorsSummary?.leastHour === v.hour;
                      const isMost = visitorsSummary?.mostHour === v.hour;

                      return (
                        <div key={v.hour} className="flex-1 min-w-0">
                          <div
                            className={[
                              "w-full rounded-md",
                              isMost
                                ? "bg-black/25"
                                : isLeast
                                  ? "bg-[#0A56FF]/25"
                                  : "bg-black/10",
                            ].join(" ")}
                            style={{ height: `${hPx}px` }}
                            title={`${hh(v.hour)}:00 · ${v.count}명`}
                          />
                          <div className="mt-1 text-[10px] text-black/45 text-center">
                            {hh(v.hour)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ✅ 인사이트 칩: 스캔 속도↑ */}
                  {visitorsSummary ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#0A56FF]/10 px-2 py-1 text-[11px] font-semibold text-[#0A56FF]">
                        여유 {hh(visitorsSummary.leastHour)}시
                      </span>
                      <span className="rounded-full bg-black/10 px-2 py-1 text-[11px] font-semibold text-black/60">
                        혼잡 {hh(visitorsSummary.mostHour)}시
                      </span>
                      {recommendedHour != null ? (
                        <span className="rounded-full bg-[#C8FF48]/40 px-2 py-1 text-[11px] font-semibold text-black/70">
                          추천 {hh(recommendedHour)}시
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                // ✅ 리스트 모드: 데이터가 명확하게 읽힘
                <div className="mt-3 flex flex-wrap gap-2">
                  {(expanded ? visitors : visitors.slice(0, 12)).map((v) => {
                    const isLeast = visitorsSummary?.leastHour === v.hour;
                    const isMost = visitorsSummary?.mostHour === v.hour;

                    return (
                      <span
                        key={v.hour}
                        className={[
                          "rounded-full px-2 py-1 text-[11px] font-semibold",
                          isMost
                            ? "bg-black/15 text-black/70"
                            : isLeast
                              ? "bg-[#0A56FF]/15 text-[#0A56FF]"
                              : "bg-black/5 text-black/60",
                        ].join(" ")}
                      >
                        {hh(v.hour)}:00 · {v.count}명
                      </span>
                    );
                  })}
                </div>
              )}

              {/* 접힘 상태에서 “더 보기” 유도 (조회 흐름 유지) */}
              {!expanded && visitors.length > 12 ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="mt-3 w-full rounded-xl border border-black/10 py-2 text-xs font-semibold text-black/60"
                >
                  시간대 전체 보기
                </button>
              ) : null}
            </div>
          </div>

          {/* ✅ expanded에서만: 안내/동선/설명(부가정보) */}
          <div className="px-4 mt-3">
            <div className="rounded-2xl bg-[#F7F7F7] p-3">
              <div className="text-xs font-semibold text-[#111]">드롭존 안내</div>

              <div className="mt-1 text-sm text-[#111] leading-relaxed">
                {expanded
                  ? dropZone?.description ??
                  "드롭존은 반납 동선을 단순화한 전용 거점이에요. 시간대별 방문자 정보를 참고하면 대기 시간을 줄일 수 있어요."
                  : dropZone?.summary ??
                  "반납 전용 거점이에요. 혼잡한 시간대를 피해 오면 더 빠르게 반납할 수 있어요."}
              </div>

              {expanded ? (
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl bg-white border border-black/5 p-3">
                    <div className="text-xs font-semibold text-[#111]">반납 동선</div>
                    <div className="mt-1 text-xs text-black/60 leading-relaxed">
                      {dropZone?.returnGuide ?? "지정 구역 주차 → 확인 → 반납 완료"}
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

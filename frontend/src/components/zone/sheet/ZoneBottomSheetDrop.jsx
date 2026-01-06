import { useEffect, useMemo, useState } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import ZoneSheetCTA from "./ZoneSheetCTA.jsx";
import { copyToClipboard } from "../utils/clipboard.js";
import { summarizeVisitorsByHour } from "../utils/zoneFormat.js";

// ✅ 드롭존 시트: 혼잡도/시간대 방문자 + 연결된 카픽존 안내
export default function ZoneBottomSheetDrop({
  open,
  onClose,
  dropZone,   // DROP 객체
  parentZone, // 연결된 BRANCH
  onReturnDrop,
}) {
  const show = !!open && !!dropZone;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setExpanded(false), [dropZone?.id]);

  const sheetHeightClass = expanded ? "h-[88dvh]" : "h-[52dvh]";

  const visitorsSummary = useMemo(
    () => summarizeVisitorsByHour(dropZone?.visitorsByHour),
    [dropZone]
  );

  const onCopyAddress = async () => {
    await copyToClipboard(dropZone?.address);
    // TODO: toast("주소가 복사됐어요")
  };

  const onCall = () => {
    if (!dropZone?.phone) return;
    window.location.href = `tel:${dropZone.phone}`;
  };

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 bottom-0 z-[90] w-full max-w-[640px]",
        show ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {show && (
        <button type="button" aria-label="닫기" className="fixed inset-0 z-[80] bg-black/0" onClick={onClose} />
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

          {/* 연결된 카픽존 */}
          {parentZone ? (
            <div className="px-4 mt-4">
              <div className="rounded-2xl bg-[#EEF3FF] p-3">
                <div className="text-xs font-semibold text-[#2B56FF]">연결된 카픽존</div>
                <div className="mt-1 text-sm font-semibold text-[#111] truncate">{parentZone.name}</div>
                <div className="mt-1 text-xs text-black/60 truncate">{parentZone.address}</div>
              </div>
            </div>
          ) : null}

          {/* 드롭존 안내 + 방문자 데이터 */}
          <div className="px-4 mt-4">
            <div className="rounded-2xl bg-[#F7F7F7] p-3">
              <div className="text-xs font-semibold text-[#111]">드롭존 안내</div>

              {!expanded ? (
                <div className="mt-1 text-sm text-[#111] leading-relaxed">
                  {dropZone?.summary ?? "반납 전용 거점이에요. 혼잡한 시간대를 피해 오면 더 빠르게 반납할 수 있어요."}
                </div>
              ) : (
                <>
                  <div className="mt-1 text-sm text-[#111] leading-relaxed">
                    {dropZone?.description ??
                      "드롭존은 반납 동선을 단순화한 전용 거점이에요. 시간대별 방문자 정보를 참고하면 대기 시간을 줄일 수 있어요."}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">반납 동선</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {dropZone?.returnGuide ?? "지정 구역 주차 → 확인 → 반납 완료"}
                      </div>
                    </div>

                    {/* 시간대 방문자(상세) */}
                    {Array.isArray(dropZone?.visitorsByHour) && dropZone.visitorsByHour.length > 0 ? (
                      <div className="rounded-2xl bg-white border border-black/5 p-3">
                        <div className="text-xs font-semibold text-[#111]">시간대 방문자</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dropZone.visitorsByHour.slice(0, 12).map((v) => (
                            <span
                              key={v.hour}
                              className="rounded-full bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/60"
                            >
                              {String(v.hour).padStart(2, "0")}:00 · {v.count ?? 0}명
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 요약(기본에서도 유용) */}
          {visitorsSummary ? (
            <div className="px-4 mt-3">
              <div className="rounded-2xl border border-black/5 bg-white p-3">
                <div className="text-xs font-semibold text-[#111]">오늘의 혼잡 요약</div>
                <div className="mt-1 text-xs text-black/60 leading-relaxed">
                  가장 여유: <b>{String(visitorsSummary.leastHour).padStart(2, "0")}:00</b> (
                  {visitorsSummary.leastCount ?? 0}명) · 가장 혼잡:{" "}
                  <b>{String(visitorsSummary.mostHour).padStart(2, "0")}:00</b> (
                  {visitorsSummary.mostCount ?? 0}명)
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

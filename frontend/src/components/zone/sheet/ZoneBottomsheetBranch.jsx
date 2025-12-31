import { useEffect, useMemo, useState } from "react";
import ZoneSheetHeader from "./ZoneSheetHeader.jsx";
import ZoneSheetCTA from "./ZoneSheetCTA.jsx";
import { copyToClipboard } from "../utils/clipboard.js";
import { formatNowKR, formatMoneyKRW, getAvailabilityBadge } from "../utils/zoneFormat.js";

// ✅ 카픽존 시트: Fast Pick Top3 + 지점 설명(확장)
export default function ZoneBottomSheetBranch({
  open,
  onClose,
  zone, // BRANCH 객체
  onPickup,
  onCarClick, // 차량 상세 이동(선택)
}) {
  const show = !!open && !!zone;
  const [expanded, setExpanded] = useState(false);

  // 존 바뀌면 확장 접기
  useEffect(() => setExpanded(false), [zone?.id]);

  // 높이: 2단
  const sheetHeightClass = expanded ? "h-[88dvh]" : "h-[52dvh]";

  // "지금 기준" 텍스트 (시트 열릴 때 기준)
  const nowText = useMemo(() => (show ? formatNowKR() : ""), [show]);

  // ✅ Fast Pick Top3: READY 우선 + ETA(있으면) 오름차순
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

  // ✅ 주소 복사 핸들러(토스트는 프로젝트에 있는 방식으로 연결하면 됨)
  const onCopyAddress = async () => {
    await copyToClipboard(zone?.address);
    // TODO: toast("주소가 복사됐어요")
  };

  // ✅ 전화 연결
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
      {/* backdrop */}
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
        {/* grabber (클릭으로 확장/축소) */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full pt-2 pb-2 flex justify-center"
          aria-label={expanded ? "접기" : "펼치기"}
        >
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </button>

        {/* 스크롤 영역 (CTA 가림 방지 pb-24) */}
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

          {/* 지점 안내 */}
          <div className="px-4 mt-4">
            <div className="rounded-2xl bg-[#F3F7FF] p-3">
              <div className="text-xs font-semibold text-[#2B56FF]">카픽존 안내</div>

              {!expanded ? (
                <div className="mt-1 text-sm text-[#111] leading-relaxed">
                  {zone?.summary ?? "도착하면 바로 출발할 수 있도록 픽업 과정을 단순화한 카픽의 표준 거점이에요."}
                </div>
              ) : (
                <>
                  <div className="mt-1 text-sm text-[#111] leading-relaxed">
                    {zone?.description ??
                      "이 카픽존은 빠른 출차를 위해 대기/서류 과정을 최소화한 거점이에요. 안내 동선을 따라 이동하면 바로 출차할 수 있어요."}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">픽업 동선</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {zone?.pickupGuide ?? "도착 → 안내 표지 → 지정 구역 → 차량 확인 → 출차"}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">주의사항</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {zone?.notice ?? "지정 구역 외 주차는 피해주세요. 야간에는 조명이 어두울 수 있어요."}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Fast Pick Top3 */}
          <div className="px-4 mt-4">
            <div className="flex items-end justify-between">
              <div className="text-sm font-semibold text-[#111]">바로 출발 추천 3대</div>
              <div className="text-[11px] text-black/45">기준: {nowText} 출발</div>
            </div>
            <div className="mt-1 text-xs text-black/55">현재 시각 기준으로 가장 빨리 출차 가능한 차량이에요.</div>

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
                        {typeof c.priceDay === "number" ? <> · 1일 {formatMoneyKRW(c.priceDay)}원~</> : null}
                      </div>

                      <div className="mt-1 text-xs text-black/55">
                        {typeof c.etaDepartureMin === "number" ? `예상 출차 ${c.etaDepartureMin}분` : null}
                        {c.isAiPick ? (
                          <>
                            <span className="mx-2 text-black/20">|</span>
                            <span className="font-semibold text-[#0A56FF]">AI Pick</span>
                          </>
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

        {/* CTA 고정 */}
        <ZoneSheetCTA kind="BRANCH" onPickup={onPickup} />
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";

export default function ZoneBottomSheet({
  open,
  onClose,
  selected,
  parentZone,
  onPickup,
  onReturnDrop,
}) {
  const show = !!open && !!selected;

  // ✅ 확장 상태 (기본: 닫힘/기본 높이)
  const [expanded, setExpanded] = useState(false);

  // ✅ 다른 지점 선택하면 확장은 자동으로 접어주는 게 UX 안정적
  useEffect(() => {
    setExpanded(false);
  }, [selected?.id]);

  // ✅ 높이 프리셋: 기본/확장 (카카오맵 느낌)
  const sheetHeightClass = expanded ? "h-[88dvh]" : "h-[46dvh]";

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
          className="fixed inset-0 z-[80] bg-black/0"
          onClick={onClose}
        />
      )}

      <div
        className={[
          "relative z-[90] rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-transform duration-300 ease-out",
          show ? "translate-y-0" : "translate-y-[105%]",
          // ✅ 높이도 같이 바뀌게
          "transition-[height] duration-300 ease-out",
          sheetHeightClass,
        ].join(" ")}
      >
        {/* ✅ grabber (클릭하면 확장/축소) */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full pt-2 pb-2 flex justify-center"
          aria-label={expanded ? "접기" : "펼치기"}
        >
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </button>

        {/* ✅ 스크롤 영역: 확장되면 내용 많아지니까 overflow-auto */}
        <div className="px-4 pb-4 h-[calc(100%-20px)] overflow-auto">
          {/* header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold text-[#111] truncate">
                {selected?.name}
              </div>
              <div className="mt-1 text-xs text-black/60 truncate">
                {selected?.address}
              </div>

              <div className="mt-2 text-xs text-black/60">
                {selected?.kind === "BRANCH" ? (
                  <>
                    도보 {selected?.walkingTimeMin ?? "-"}분 · {selected?.open}
                    {selected?.close ? `–${selected?.close}` : ""}
                    {selected?.tags?.length ? (
                      <>
                        <span className="mx-2 text-black/20">|</span>
                        {selected.tags.join(" · ")}
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-black/70">반납 전용</span>
                    <span className="mx-2 text-black/20">|</span>
                    픽업은 <b>카픽존</b>에서만 가능해요.
                  </>
                )}
              </div>
            </div>

            <span
              className={[
                "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold",
                selected?.kind === "BRANCH"
                  ? "bg-[#0A56FF] text-white"
                  : "bg-black/5 text-black/60",
              ].join(" ")}
            >
              {selected?.kind === "BRANCH" ? "카픽존" : "드롭존"}
            </span>
          </div>

          {/* ✅ (추가) 지점 소개: 기본에도 한 줄, 확장에선 풀버전 */}
          {selected?.kind === "BRANCH" && (
            <div className="mt-3 rounded-2xl bg-[#F3F7FF] p-3">
              <div className="text-xs font-semibold text-[#2B56FF]">
                카픽존 안내
              </div>

              {/* 기본: 1~2줄 요약 */}
              {!expanded ? (
                <div className="mt-1 text-sm text-[#111] leading-relaxed">
                  {selected?.summary ?? "도착하면 바로 출발할 수 있도록 픽업·반납 동선을 간단하게 만든 거점이에요."}
                </div>
              ) : (
                <>
                  {/* 확장: 상세 설명 */}
                  <div className="mt-1 text-sm text-[#111] leading-relaxed">
                    {selected?.description ??
                      "이 카픽존은 빠른 픽업을 위해 대기/서류 과정을 최소화한 거점이에요. 도착 후 안내 동선대로 이동하면 바로 출차가 가능해요."}
                  </div>

                  {/* 확장: 이용 방법/포인트 */}
                  <div className="mt-3 space-y-2">
                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">픽업 동선</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {selected?.pickupGuide ?? "도착 → 안내 표지판 → 지정 구역 → 차량 확인 → 출차"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">반납 동선</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {selected?.returnGuide ?? "지정 구역 주차 → 사진/확인 → 반납 완료"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-black/5 p-3">
                      <div className="text-xs font-semibold text-[#111]">주의사항</div>
                      <div className="mt-1 text-xs text-black/60 leading-relaxed">
                        {selected?.notice ?? "야간에는 조명이 어두울 수 있어요. 지정 구역 외 주차는 피해주세요."}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* drop zone additional */}
          {selected?.kind === "DROP" && parentZone && (
            <div className="mt-3 rounded-2xl bg-[#EEF3FF] p-3">
              <div className="text-xs font-semibold text-[#2B56FF]">
                연결된 카픽존
              </div>
              <div className="mt-1 text-sm font-semibold text-[#111] truncate">
                {parentZone.name}
              </div>
              <div className="mt-1 text-xs text-black/60 truncate">
                {parentZone.address}
              </div>
            </div>
          )}

          {/* ✅ 여기 아래에 "바로 출발 추천 3대" 섹션 넣으면 됨 (너 기존 코드 그대로) */}
          {/* ... */}

          {/* CTA */}
          <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-black/5 px-4 py-3">
            {selected.kind === "BRANCH" ? (
              <button
                type="button"
                onClick={onPickup}
                className="w-full h-12 rounded-2xl bg-[#0A56FF] text-white font-semibold active:scale-[0.99] transition"
              >
                이 카픽존으로 픽업
              </button>
            ) : (
              <button
                type="button"
                onClick={onReturnDrop}
                className="w-full h-12 rounded-2xl bg-[#111] text-white font-semibold active:scale-[0.99] transition"
              >
                이 드롭존으로 반납
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMoneyKRW(n) {
  if (typeof n !== "number") return "-";
  return n.toLocaleString("ko-KR");
}

export default function ZoneBottomSheet({
  open,
  onClose,
  selected,
  parentZone, // 드롭존일 때 연결된 카픽존 (선택)
  onPickup,
  onReturnDrop,
}) {
  const show = !!open && !!selected;

  return (
    <div
      className={[
        "fixed left-1/2 -translate-x-1/2 z-[90] w-full max-w-[640px]",
        "bottom-0",
      ].join(" ")}
    >
      {/* backdrop */}
      {show && (
        <div
          className="fixed inset-0 bg-black/25 z-[80]"
          onClick={onClose}
        />
      )}

      {/* sheet */}
      <div
        className={[
          "relative z-[90] rounded-t-3xl bg-white border border-black/5",
          "shadow-[0_-10px_40px_rgba(0,0,0,0.18)]",
          "transition-transform duration-300 ease-out",
          show ? "translate-y-0" : "translate-y-[105%]",
        ].join(" ")}
      >
        {/* grabber */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-black/10" />
        </div>

        <div className="px-4 pb-4">
          {/* header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[16px] font-semibold text-[#111] truncate">
                {selected.name}
              </div>
              <div className="mt-1 text-xs text-black/60 truncate">
                {selected.address}
              </div>

              <div className="mt-2 text-xs text-black/60">
                {selected.kind === "BRANCH" ? (
                  <>
                    도보 {selected.walkingTimeMin ?? "-"}분 · {selected.open}
                    {selected.close ? `–${selected.close}` : ""}
                    {selected.tags?.length ? (
                      <>
                        <span className="mx-2 text-black/20">|</span>
                        {selected.tags.join(" · ")}
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-black/70">
                      반납 전용
                    </span>
                    <span className="mx-2 text-black/20">|</span>
                    픽업은 <b>카픽존</b>에서만 가능해요.
                  </>
                )}
              </div>
            </div>

            <span
              className={[
                "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold",
                selected.kind === "BRANCH"
                  ? "bg-[#0A56FF] text-white"
                  : "bg-black/5 text-black/60",
              ].join(" ")}
            >
              {selected.kind === "BRANCH" ? "카픽존" : "드롭존"}
            </span>
          </div>

          {/* drop zone additional */}
          {selected.kind === "DROP" && parentZone && (
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

          {/* cars list for branch */}
          {selected.kind === "BRANCH" && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-[#111]">
                이 카픽존의 차량
              </div>

              <div className="mt-2 space-y-2">
                {(selected.cars ?? []).slice(0, 6).map((c) => (
                  <div
                    key={c.carId}
                    className="rounded-2xl border border-black/5 bg-white p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#111] truncate">
                        {c.name}
                      </div>
                      <div className="mt-1 text-xs text-black/55">
                        {c.fuel} · {c.people}인 · 1일 {formatMoneyKRW(c.priceDay)}원~
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/60">
                      예약 가능
                    </div>
                  </div>
                ))}

                {(selected.cars ?? []).length === 0 && (
                  <div className="rounded-2xl border border-black/5 bg-white p-3 text-sm text-black/60">
                    현재 표시할 차량이 없어요.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-4">
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

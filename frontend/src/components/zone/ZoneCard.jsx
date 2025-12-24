// src/components/zone/ZoneCard.jsx
export default function ZoneCard({ item, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-4 transition",
        selected ? "border-[#0A56FF] bg-[#EEF3FF]" : "border-black/5 bg-white hover:bg-black/[0.02]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[#111] truncate">{item.name}</div>
          <div className="mt-1 text-xs text-black/60 truncate">{item.address}</div>

          <div className="mt-2 text-xs text-black/60">
            도보 {item.walkingTimeMin ?? "-"}분 · {item.open}
            {item.close ? `–${item.close}` : ""}
            <span className="mx-2 text-black/20">|</span>
            {item.kind === "BRANCH" ? "픽업·반납" : "반납 전용"}
          </div>
        </div>

        <span
          className={[
            "shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold",
            item.kind === "BRANCH" ? "bg-[#0A56FF] text-white" : "bg-black/5 text-black/60",
          ].join(" ")}
        >
          {item.kind === "BRANCH" ? "카픽존" : "드롭존"}
        </span>
      </div>
    </button>
  );
}

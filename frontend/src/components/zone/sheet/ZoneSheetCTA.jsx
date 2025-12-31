// ✅ CTA 고정 영역 (스크롤 영역 밖에 있어야 함)
export default function ZoneSheetCTA({ kind, onPickup, onReturnDrop }) {
  return (
    <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-black/5 px-4 py-3">
      {kind === "BRANCH" ? (
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
  );
}

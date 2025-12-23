import { useMemo } from "react";

export default function ZoneSearchBar({
  value,
  onChange,
  results,
  onPick,
  onClear,
}) {
  const has = useMemo(() => (value?.trim()?.length ?? 0) > 0, [value]);

  return (
    <div className="pt-15 pointer-events-auto">
      <div className="rounded-2xl bg-white/95 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur">
        <div className="flex items-center gap-2 px-3 h-12">
          <span className="text-black/60 text-sm">🔎</span>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="카픽존 검색 (공항/역/도심)"
            className="flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-black/40"
          />
          {has && (
            <button
              type="button"
              onClick={onClear}
              className="h-8 px-2 rounded-xl bg-black/5 text-xs font-semibold text-black/60"
            >
              지우기
            </button>
          )}
        </div>
      </div>

      {has && results?.length > 0 && (
        <div className="mt-2 rounded-2xl bg-white/95 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur overflow-hidden">
          {results.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => onPick(z.id)}
              className="w-full text-left px-3 py-3 hover:bg-black/5 active:bg-black/5"
            >
              <div className="text-sm font-semibold text-[#111] truncate">
                {z.name}
              </div>
              <div className="mt-1 text-xs text-black/55 truncate">
                {z.address}
              </div>
            </button>
          ))}
        </div>
      )}

      {has && results?.length === 0 && (
        <div className="mt-2 rounded-2xl bg-white/95 border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur px-3 py-3">
          <div className="text-sm text-black/60">검색 결과가 없어요.</div>
        </div>
      )}
    </div>
  );
}

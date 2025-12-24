export default function LocationPermissionModal({
  open,
  onAllow,
  onSkip,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/35" onClick={onSkip} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[420px] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-black/5 p-5">
          <div className="text-lg font-semibold text-[#111]">
            내 위치를 확인할까요?
          </div>
          <p className="mt-2 text-sm text-black/60 leading-relaxed">
            가까운 <b>카픽존</b>을 빠르게 추천해드릴게요.
            <br />
            위치 정보는 지도 추천에만 사용돼요.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="h-11 rounded-2xl bg-black/5 text-[#111] text-sm font-semibold active:scale-[0.99]"
            >
              나중에
            </button>
            <button
              type="button"
              onClick={onAllow}
              className="h-11 rounded-2xl bg-[#0A56FF] text-white text-sm font-semibold active:scale-[0.99]"
            >
              위치 허용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

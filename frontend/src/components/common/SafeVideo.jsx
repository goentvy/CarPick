import { useEffect, useMemo, useState } from "react";

export default function SafeVideo({
  src,
  className = "",
  videoClassName = "",
  preload = "metadata",
  muted = true,
  playsInline = true,
  fallback,
  loader,
  children, // (videoProps) => JSX
}) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState("");
  const [ratio, setRatio] = useState(16 / 9); // ✅ 기본값(메타 오기 전)

  useEffect(() => {
    setLoaded(false);
    setErr("");
    setRatio(16 / 9);
  }, [src]);

  const videoProps = useMemo(
    () => ({
      src,
      muted,
      playsInline,
      preload,
      className: videoClassName,
      onLoadedMetadata: (e) => {
        const v = e?.currentTarget;
        // ✅ 메타데이터로 영상 고유 비율 계산
        if (v?.videoWidth && v?.videoHeight) {
          setRatio(v.videoWidth / v.videoHeight);
        }
        setLoaded(true);
      },
      onLoadedData: () => setLoaded(true),
      onCanPlay: () => setLoaded(true),
      onError: (e) => {
        const v = e?.currentTarget;
        const mediaErr = v?.error;
        setErr(mediaErr ? `video error code: ${mediaErr.code}` : "video load error");
      },
    }),
    [src, muted, playsInline, preload, videoClassName]
  );

  if (!src || err) {
    return (
      <div className={["relative w-full", className].join(" ")}>
        {fallback ?? (
          <div className="w-full aspect-video grid place-items-center bg-[#E9EAEE]">
            <div className="text-xs text-black/45">영상을 불러올 수 없어요</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={["relative w-full max-w-[640px] mx-auto", className].join(" ")}>
      {/* ✅ 영상 비율에 맞춰 컨테이너 높이 자동 계산 */}
      <div
        className="relative w-full overflow-hidden bg-[#E9EAEE]"
        style={{ aspectRatio: String(ratio) }}
      >
        {/* 로딩 오버레이 */}
        {!loaded && (
          <div className="absolute inset-0 z-10 grid place-items-center">
            {loader ?? (
              <div className="w-10 h-10 rounded-full border-2 border-black/15 border-t-black/40 animate-spin" />
            )}
          </div>
        )}

        {/* 실제 렌더 */}
        <div
          className={[
            "absolute inset-0 transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {typeof children === "function" ? children(videoProps) : null}
        </div>
      </div>
    </div>
  );
}
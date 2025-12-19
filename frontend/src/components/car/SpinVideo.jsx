import { useEffect, useRef, useState } from "react";

export default function SpinVideo({ src, className = "", dragWidth = 640 }) {
  const videoRef = useRef(null);
  const st = useRef({ dragging: false, startX: 0, startP: 0 });
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [p, setP] = useState(0);
  const [err, setErr] = useState("");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration || 0);
      setReady(true);
      setErr("");
      try { v.currentTime = 0.001; } catch {}
    };

    const onError = () => {
      const mediaErr = v.error;
      setErr(
        mediaErr
          ? `video error code: ${mediaErr.code} (코덱/경로/CORS 가능성)`
          : "video load error"
      );
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("error", onError);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, []);

  const applyProgress = (nextP) => {
    const v = videoRef.current;
    if (!v || !ready || !duration) return;
    const clamped = Math.min(Math.max(nextP, 0), 1);
    setP(clamped);
    v.currentTime = clamped * duration;
  };

  const onPointerDown = (e) => {
    st.current.dragging = true;
    st.current.startX = e.clientX;
    st.current.startP = p;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!st.current.dragging) return;
    const dx = e.clientX - st.current.startX;
    applyProgress(st.current.startP + dx / dragWidth);
  };
  const onPointerUp = () => (st.current.dragging = false);

  return (
    <div
      className={`relative select-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"  // ⭐ 전체 다운로드 말고 메타데이터만 먼저(더 가벼움)
        className="w-full h-auto bg-black/5"
      />

      {!ready && !err && (
        <div className="absolute inset-0 grid place-items-center text-sm text-neutral-500">
          로딩 중…
        </div>
      )}

      {!!err && (
        <div className="absolute inset-0 grid place-items-center text-sm text-red-600 bg-white/70">
          {err}
        </div>
      )}

      {ready && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 text-white text-xs">
          드래그해서 회전 보기
        </div>
      )}
    </div>
  );
}

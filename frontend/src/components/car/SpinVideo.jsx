import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const wrap01 = (x) => {
  const r = x % 1;
  return r < 0 ? r + 1 : r;
};

const SpinVideo = forwardRef(function SpinVideo(
  {
    src,
    className = "",
    dragWidth = 640,
    dragHeight = 360,
    pitchCount = 5,
    pitchSensitivity = 4,

    // ✅ 화살표/버튼 한 번 클릭 시 회전량(0~1 progress 기준)
    step = 0.06,
    // ✅ 위/아래 버튼도 만들고 싶으면 pitchStep
    pitchStep = 1,
  },
  ref
) {
  const videoRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [draggingUI, setDraggingUI] = useState(false);

  const st = useRef({
    dragging: false,
    pointerId: null,

    startX: 0,
    startY: 0,

    duration: 0,
    progress: 0,
    pitch: 0,

    startProgress: 0,
    startPitch: 0,

    rafId: 0,
    nextProgress: 0,
    nextPitch: 0,
    lastTime: -1,
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      st.current.duration = v.duration || 0;
      setReady(true);
      setErr("");
      try {
        v.currentTime = 0.001;
      } catch { }
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
  }, [src]);

  const applyTime = (progress, pitch) => {
    const v = videoRef.current;
    if (!v || !ready || !st.current.duration || pitchCount <= 0) return;

    const p = wrap01(progress);

    const maxPitch = Math.max(pitchCount - 1, 0);
    const pi = clamp(pitch, 0, maxPitch);

    st.current.progress = p;
    st.current.pitch = pi;

    const seg = st.current.duration / pitchCount;
    const t = (pi + p) * seg;

    if (Math.abs(t - st.current.lastTime) < 0.003) return;
    st.current.lastTime = t;

    try {
      v.currentTime = t;
    } catch { }
  };

  const scheduleApply = (progress, pitch) => {
    st.current.nextProgress = progress;
    st.current.nextPitch = pitch;

    if (st.current.rafId) return;
    st.current.rafId = requestAnimationFrame(() => {
      st.current.rafId = 0;
      applyTime(st.current.nextProgress, st.current.nextPitch);
    });
  };

  // ✅ 외부(부모)에서 화살표로 호출할 API
  useImperativeHandle(
    ref,
    () => ({
      next() {
        if (!ready || err) return;
        scheduleApply(st.current.progress + step, st.current.pitch);
      },
      prev() {
        if (!ready || err) return;
        scheduleApply(st.current.progress - step, st.current.pitch);
      },
      pitchUp() {
        if (!ready || err) return;
        scheduleApply(st.current.progress, st.current.pitch - pitchStep);
      },
      pitchDown() {
        if (!ready || err) return;
        scheduleApply(st.current.progress, st.current.pitch + pitchStep);
      },
      // 필요하면 현재 상태 조회도 가능
      getState() {
        return {
          progress: st.current.progress,
          pitch: st.current.pitch,
          ready,
          err,
        };
      },
    }),
    [ready, err, step, pitchStep]
  );

  const onPointerDown = (e) => {
    if (!ready || err) return;

    st.current.dragging = true;
    st.current.pointerId = e.pointerId;

    st.current.startX = e.clientX;
    st.current.startY = e.clientY;

    st.current.startProgress = st.current.progress;
    st.current.startPitch = st.current.pitch;

    setDraggingUI(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!st.current.dragging) return;

    const dx = e.clientX - st.current.startX;
    const dy = e.clientY - st.current.startY;

    const nextProgress = st.current.startProgress + dx / dragWidth;
    const nextPitch =
      st.current.startPitch + (dy / dragHeight) * pitchSensitivity;

    scheduleApply(nextProgress, nextPitch);
  };

  const endDrag = (e) => {
    st.current.dragging = false;
    setDraggingUI(false);

    if (st.current.pointerId != null) {
      try {
        e.currentTarget.releasePointerCapture?.(st.current.pointerId);
      } catch { }
    }
    st.current.pointerId = null;
  };

  return (
    <div
      className={[
        "relative select-none touch-none",
        draggingUI ? "cursor-grabbing" : "cursor-grab",
        className,
      ].join(" ")}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        draggable={false}
        className="w-full h-auto bg-black/5 pointer-events-none"
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

      {ready && !err && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/55 text-white text-xs">
          잡고 돌려보세요
        </div>
      )}
    </div>
  );
});

export default SpinVideo;

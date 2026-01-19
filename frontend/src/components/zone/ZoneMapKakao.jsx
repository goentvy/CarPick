import { useEffect, useMemo, useRef, useState } from "react";

function ensureBounceCss() {
  const id = "cp-bounce-css";
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    @keyframes cpBounce {
      0%   { transform: translateY(0) scale(1.06); }
      30%  { transform: translateY(-10px) scale(1.06); }
      60%  { transform: translateY(2px) scale(1.06); }
      100% { transform: translateY(0) scale(1.06); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cp-bounce { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

function loadKakaoSdk(appKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window unavailable"));
    if (window.kakao?.maps) return resolve(window.kakao);

    const SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    const SCRIPT_ID = "kakao-maps-sdk";

    const prev = document.getElementById(SCRIPT_ID);
    if (prev && !window.kakao?.maps) prev.remove();

    let script = document.getElementById(SCRIPT_ID);
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = SDK_URL;

      script.onload = () => {
        if (window.kakao?.maps) resolve(window.kakao);
        else reject(new Error("SDK loaded but window.kakao.maps is missing"));
      };

      script.onerror = () => reject(new Error(`SDK network load failed: ${SDK_URL}`));
      document.head.appendChild(script);
    }

    setTimeout(() => {
      if (!window.kakao?.maps) {
        reject(
          new Error("SDK load timeout (Network 탭: sdk.js status / blocked-by-client / 403 확인)")
        );
      }
    }, 8000);
  });
}

/** Branch / Drop 마커 */
const TYPE_MARKER_SRC = {
  BRANCH: "/markers/branch.svg",
  DROP: "/markers/dropzone.svg",
};

const CROWD_BADGE_SRC = {
  FREE: "/badges/crowd_free.svg",
  NORMAL: "/badges/crowd_normal.svg",
  CROWDED: "/badges/crowd_crowded.svg",
  FULL: "/badges/crowd_full.svg",
};

/** Branch / Drop 마커 HTML (SVG 타입 + 혼잡도 배지) */
function buildHtmlMarker({ kind, selected, crowdStatus, crowdLabel, showCrowd }) {
  const isDrop = kind === "DROP";

  // ✅ 핵심: 드롭존은 혼잡도 ON이면 상태별 svg로 마커가 바뀜
  const markerSrc = isDrop
    ? (showCrowd ? (CROWD_BADGE_SRC[crowdStatus] ?? TYPE_MARKER_SRC.DROP) : TYPE_MARKER_SRC.DROP)
    : TYPE_MARKER_SRC.BRANCH;

  const isBranch = kind === "BRANCH";
  const badgeHtml = "";


  return `
    <button type="button"
      style="
        position:relative;
        width:${selected ? 46 : 40}px;
        height:${selected ? 46 : 40}px;
        border:none;
        background:transparent;
        cursor:pointer;
        transform-origin:50% 100%;
        ${selected ? "animation:cpBounce 520ms ease-out;" : ""}
      "
      aria-label="${isBranch ? "카픽존" : (crowdLabel ?? "드롭존")}"
    >
      ${badgeHtml}
      <img
        src="${markerSrc}"
        alt=""
        draggable="false"
        style="width:100%;height:100%;display:block;"
      />
    </button>
  `;
}


export default function ZoneMapKakao({
  items = [],
  selectedId,
  onSelect,
  onMapClick,
  center, // {lat,lng}
  myPos, // {lat,lng}
  showCrowd,
}) {
  const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  useEffect(() => {
    if (typeof document === "undefined") return;
    ensureBounceCss();
  }, []);

  const mapElRef = useRef(null);
  const mapRef = useRef(null);

  const overlaysRef = useRef(new Map()); // id -> CustomOverlay
  const myOverlayRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  // center 안전값
  const safeCenter = useMemo(
    () => ({
      lat: Number(center?.lat ?? 37.5665),
      lng: Number(center?.lng ?? 126.978),
      nonce: center?.nonce ?? 0,
    }),
    [center?.lat, center?.lng, center?.nonce]
  );

  // 1) 지도 생성 1회
  useEffect(() => {
    let canceled = false;

    if (!APP_KEY) {
      setStatus("error");
      setErrorMsg("VITE_KAKAO_MAP_KEY가 없습니다 (.env 확인)");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    loadKakaoSdk(APP_KEY)
      .then((kakao) => {
        if (canceled) return;

        kakao.maps.load(() => {
          if (canceled) return;
          if (!mapElRef.current) return;

          const map = new kakao.maps.Map(mapElRef.current, {
            center: new kakao.maps.LatLng(safeCenter.lat, safeCenter.lng),
            level: 5,
          });

          mapRef.current = map;
          setStatus("ready");
        });
      })
      .catch((err) => {
        console.error("[KAKAO SDK LOAD ERROR]", err);
        setStatus("error");
        setErrorMsg(String(err?.message ?? err));
      });

    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [APP_KEY]);

  // 2) 지도 클릭 이벤트
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    const handler = () => onMapClick?.();

    kakao.maps.event.addListener(map, "click", handler);
    return () => kakao.maps.event.removeListener(map, "click", handler);
  }, [status, onMapClick]);

  /**
   * ✅ 3) center 이동 
   */
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    map.setCenter(new kakao.maps.LatLng(safeCenter.lat, safeCenter.lng));
  }, [status, safeCenter.lat, safeCenter.lng, safeCenter.nonce]);

  // 4) 내 위치 점 표시
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    if (!myPos?.lat || !myPos?.lng) {
      if (myOverlayRef.current) {
        myOverlayRef.current.setMap(null);
        myOverlayRef.current = null;
      }
      return;
    }

    const pos = new kakao.maps.LatLng(Number(myPos.lat), Number(myPos.lng));

    if (!myOverlayRef.current) {
      const dot = document.createElement("div");
      dot.style.width = "14px";
      dot.style.height = "14px";
      dot.style.borderRadius = "999px";
      dot.style.background = "#0A56FF";
      dot.style.boxShadow = "0 8px 20px rgba(10,86,255,0.35)";
      dot.style.border = "3px solid white";
      dot.style.pointerEvents = "none";

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: dot,
        yAnchor: 0.5,
        zIndex: 9999,
      });

      overlay.setMap(map);
      myOverlayRef.current = overlay;
    } else {
      myOverlayRef.current.setPosition(pos);
      myOverlayRef.current.setMap(map);
    }
  }, [status, myPos?.lat, myPos?.lng]);

  // 5) 마커 생성/갱신
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    const store = overlaysRef.current;
    const nextIds = new Set(items.map((it) => it.id));

    // 제거
    for (const [id, overlay] of store.entries()) {
      if (!nextIds.has(id)) {
        overlay.setMap(null);
        store.delete(id);
      }
    }

    // 생성/갱신(선택 스타일 반영 위해 재생성)
    items.forEach((it) => {
      const pos = new kakao.maps.LatLng(Number(it.lat), Number(it.lng));
      const selected = it.id === selectedId;

      if (store.has(it.id)) {
        store.get(it.id).setMap(null);
        store.delete(it.id);
      }

      const wrapper = document.createElement("div");
      const rawStatus = it.crowdStatus ?? it.status;
      const crowdStatus = String(rawStatus ?? "").toUpperCase().trim(); // ✅ 핵심
      const crowdLabel = it.crowdLabel ?? it.label;

      // ✅ 드롭존만 확인 로그 (2~3개만 찍혀도 원인 바로 나옴)
      if (it.kind === "DROP") {
        console.log("[DROP]", it.id, "raw=", rawStatus, "norm=", crowdStatus, "label=", crowdLabel);
      }
      wrapper.innerHTML = buildHtmlMarker({
        kind: it.kind,
        selected,
        crowdStatus,
        crowdLabel,
        showCrowd,
      });
      const btn = wrapper.firstElementChild;

      const handle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(it.id);
      };
      btn.addEventListener("click", handle);

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: btn,
        yAnchor: 1,
        zIndex: selected ? 1000 : 1,
      });

      overlay.setMap(map);
      store.set(it.id, overlay);
    });
  }, [status, items, selectedId, onSelect, showCrowd]);

  // UI
  if (!APP_KEY) {
    return (
      <div className="h-full w-full bg-[#F4F6FA] grid place-items-center text-sm text-black/60">
        카카오맵 키 설정 전 (.env의 VITE_KAKAO_MAP_KEY)
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-full w-full bg-[#F4F6FA] p-4 flex flex-col justify-center">
        <div className="text-sm font-semibold text-[#111]">카카오맵 로드 실패</div>
        <div className="mt-2 text-xs text-black/60 whitespace-pre-wrap">
          {errorMsg || "Network 탭에서 sdk.js(카카오 SDK) 요청이 200인지 확인하세요."}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div ref={mapElRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 bg-white/60 grid place-items-center pointer-events-none">
          <div className="text-sm text-black/60">지도 불러오는 중…</div>
        </div>
      )}
    </div>
  );
}


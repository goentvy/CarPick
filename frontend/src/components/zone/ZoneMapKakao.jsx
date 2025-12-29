import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Kakao Maps SDK loader
 * - 이미 로드되어 있으면 재사용
 * - 실패/차단 상황에서 timeout 에러 제공
 */
function loadKakaoSdk(appKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window unavailable"));
    if (window.kakao?.maps) return resolve(window.kakao);

    const SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    const SCRIPT_ID = "kakao-maps-sdk";

    // 이전 스크립트가 있는데 kakao가 없는 경우(실패/차단) → 제거 후 재시도
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

    // 타임아웃(광고차단/네트워크/403 등)
    setTimeout(() => {
      if (!window.kakao?.maps) {
        reject(
          new Error("SDK load timeout (Network 탭: sdk.js status / blocked-by-client / 403 확인)")
        );
      }
    }, 8000);
  });
}

/**
 * Branch / Drop 마커 HTML 생성
 * - selected 상태에 따라 스타일 변경
 */
function buildHtmlMarker({ kind, selected }) {
  const isBranch = kind === "BRANCH";

  const bg = selected ? (isBranch ? "#0A56FF" : "#111") : "rgba(255,255,255,0.96)";
  const color = selected ? "#fff" : "rgba(17,17,17,0.92)";
  const dot = selected ? "#fff" : isBranch ? "#0A56FF" : "#111";
  const label = isBranch ? "카픽존" : "반납";

  return `
    <button type="button"
      style="
        display:inline-flex;align-items:center;justify-content:center;
        height:34px;padding:0 10px;border-radius:999px;
        background:${bg};color:${color};
        border:1px solid rgba(0,0,0,0.12);
        box-shadow:0 10px 30px rgba(0,0,0,0.18);
        backdrop-filter:blur(8px);
        cursor:pointer;
        transform:${selected ? "scale(1.06)" : "scale(1)"};
        transition:transform 150ms ease, background 150ms ease, color 150ms ease;
        font-size:12px;font-weight:800;
      ">
      <span style="width:8px;height:8px;border-radius:999px;background:${dot};margin-right:6px;"></span>
      ${label}
    </button>
  `;
}

export default function ZoneMapKakao({
  items = [],
  selectedId,
  onSelect,
  onMapClick,
  center, // {lat,lng}
  myPos, // {lat,lng} optional
}) {
  const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  // ✅ 디버그가 필요하면 true로 바꿔서 myPos 들어오는지 바로 확인
  const DEBUG = false;

  const mapElRef = useRef(null); // 실제 DOM
  const mapRef = useRef(null); // kakao.maps.Map 인스턴스

  // 마커 오버레이 저장(스타일 반영 위해 재생성)
  const overlaysRef = useRef(new Map()); // id -> CustomOverlay
  // 내 위치 오버레이
  const myOverlayRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  // center가 없을 때 대비한 안전 좌표
  const safeCenter = useMemo(
    () => ({
      lat: Number(center?.lat ?? 37.5665),
      lng: Number(center?.lng ?? 126.978),
    }),
    [center?.lat, center?.lng]
  );

  // ✅ 디버그: status / myPos / center 확인
  useEffect(() => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.log("[ZoneMapKakao] status:", status, "myPos:", myPos, "center:", center);
  }, [DEBUG, status, myPos, center]);

  // 1) 지도 생성 (1회)
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

  // 2) 지도 클릭 이벤트 (바텀시트 닫기 등)
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    // ✅ ready 전에는 이벤트 달지 않음(안정)
    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    const handler = () => onMapClick?.();

    kakao.maps.event.addListener(map, "click", handler);

    return () => {
      kakao.maps.event.removeListener(map, "click", handler);
    };
  }, [status, onMapClick]);

  // 3) center 이동(부드럽게) - ✅ 이동 로직은 이 effect 하나로 통일
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    map.panTo(new kakao.maps.LatLng(safeCenter.lat, safeCenter.lng));
  }, [status, safeCenter.lat, safeCenter.lng]);

  // 4) 내 위치 표시(점) - 생성/갱신/삭제
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    // myPos 없으면 제거
    if (!myPos?.lat || !myPos?.lng) {
      if (myOverlayRef.current) {
        myOverlayRef.current.setMap(null);
        myOverlayRef.current = null;
      }
      return;
    }

    const pos = new kakao.maps.LatLng(Number(myPos.lat), Number(myPos.lng));

    if (!myOverlayRef.current) {
      // ✅ 내 위치 점 DOM
      const dot = document.createElement("div");
      dot.style.width = "14px";
      dot.style.height = "14px";
      dot.style.borderRadius = "999px";
      dot.style.background = "#0A56FF";
      dot.style.boxShadow = "0 8px 20px rgba(10,86,255,0.35)";
      dot.style.border = "3px solid white";
      dot.style.pointerEvents = "none"; // 지도 클릭 방해 X

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: dot,
        yAnchor: 0.5, // 점 중심
        zIndex: 9999,
      });

      overlay.setMap(map);
      myOverlayRef.current = overlay;
    } else {
      myOverlayRef.current.setPosition(pos);
      myOverlayRef.current.setMap(map);
    }
  }, [status, myPos?.lat, myPos?.lng]);

  // 5) 마커(오버레이) 생성/갱신
  useEffect(() => {
    const map = mapRef.current;
    const kakao = window.kakao;

    if (status !== "ready") return;
    if (!map || !kakao?.maps) return;

    const store = overlaysRef.current;
    const nextIds = new Set(items.map((it) => it.id));

    // (A) 제거: items에서 사라진 것들
    for (const [id, overlay] of store.entries()) {
      if (!nextIds.has(id)) {
        overlay.setMap(null);
        store.delete(id);
      }
    }

    // (B) 생성/갱신: selected 스타일 반영을 위해 항상 재생성
    items.forEach((it) => {
      const pos = new kakao.maps.LatLng(Number(it.lat), Number(it.lng));
      const selected = it.id === selectedId;

      // 기존 제거 후 재생성(스타일 업데이트)
      if (store.has(it.id)) {
        store.get(it.id).setMap(null);
        store.delete(it.id);
      }

      // HTML 버튼 생성
      const wrapper = document.createElement("div");
      wrapper.innerHTML = buildHtmlMarker({ kind: it.kind, selected });
      const btn = wrapper.firstElementChild;

      // ✅ 클릭 시 선택
      const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(it.id);
      };
      btn.addEventListener("click", onClick);

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content: btn,
        yAnchor: 1,
        zIndex: selected ? 1000 : 1,
      });

      overlay.setMap(map);
      store.set(it.id, overlay);

      // ✅ 이 overlay가 교체/제거될 때 이벤트 제거되긴 하지만,
      // 안전하게 wrapper/btn이 GC될 수 있게 참조를 끊어줌(옵션 성격)
      // (별도 cleanup은 재생성 로직에서 이미 overlay.setMap(null)로 충분)
    });

    // items/selectedId 바뀔 때마다 재생성하는 구조라 별도 cleanup 불필요
  }, [status, items, selectedId, onSelect]);

  // ---- UI ----
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
        <div className="absolute inset-0 bg-white/60 grid place-items-center">
          <div className="text-sm text-black/60">지도 불러오는 중…</div>
        </div>
      )}
    </div>
  );
}

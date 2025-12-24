import { useEffect, useMemo, useRef, useState } from "react";

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
                if (window.kakao?.maps) {
                    resolve(window.kakao);
                } else {
                    reject(new Error("SDK loaded but window.kakao.maps is missing"));
                }
            };

            script.onerror = () => reject(new Error(`SDK network load failed: ${SDK_URL}`));

            document.head.appendChild(script);
        }

        setTimeout(() => {
            if (!window.kakao?.maps) {
                reject(new Error("SDK load timeout (Network 탭: sdk.js status / blocked-by-client / 403 확인)"));
            }
        }, 8000);
    });
}

function buildHtmlMarker({ kind, selected }) {
    const isBranch = kind === "BRANCH";

    const bg = selected ? (isBranch ? "#0A56FF" : "#111") : "rgba(255,255,255,0.96)";
    const color = selected ? "#fff" : "rgba(17,17,17,0.92)";
    const dot = selected ? "#fff" : (isBranch ? "#0A56FF" : "#111");
    const label = isBranch ? "카픽존" : "반납";

    // 드롭존은 “픽업” 느낌 절대 안나게: label을 반납으로 고정
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
    center,     // {lat,lng}
    myPos,      // {lat,lng} optional
}) {
    const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

    const mapElRef = useRef(null);
    const mapRef = useRef(null);

    // CustomOverlay들 저장(마커 스타일용)
    const overlaysRef = useRef(new Map()); // id -> CustomOverlay
    const myOverlayRef = useRef(null);

    const [status, setStatus] = useState("idle"); // idle | loading | ready | error
    const [errorMsg, setErrorMsg] = useState("");

    const safeCenter = useMemo(
        () => ({ lat: center?.lat ?? 37.5665, lng: center?.lng ?? 126.978 }),
        [center?.lat, center?.lng]
    );

    useEffect(() => {
        const map = mapRef.current;
        const kakao = window.kakao;
        if (!map || !kakao?.maps) return;

        const handler = () => {
            onMapClick?.();
        };

        kakao.maps.event.addListener(map, "click", handler);

        return () => {
            kakao.maps.event.removeListener(map, "click", handler);
        };
    }, [onMapClick]);


    useEffect(() => {
        const map = mapRef.current;
        const kakao = window.kakao;
        if (!map || !kakao?.maps) return;
        if (!myPos) return;

        map.panTo(new kakao.maps.LatLng(myPos.lat, myPos.lng));
    }, [myPos]);


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

    // 2) center 이동
    useEffect(() => {
        const map = mapRef.current;
        const kakao = window.kakao;
        if (!map || !kakao?.maps) return;

        map.panTo(new kakao.maps.LatLng(safeCenter.lat, safeCenter.lng));
    }, [safeCenter.lat, safeCenter.lng]);

    // 3) 내 위치 표시 (CustomOverlay)
    useEffect(() => {
        const map = mapRef.current;
        const kakao = window.kakao;
        if (!map || !kakao?.maps) return;

        // 제거
        if (!myPos) {
            if (myOverlayRef.current) {
                myOverlayRef.current.setMap(null);
                myOverlayRef.current = null;
            }
            return;
        }

        const pos = new kakao.maps.LatLng(myPos.lat, myPos.lng);

        if (!myOverlayRef.current) {
            const dot = document.createElement("div");
            dot.style.width = "14px";
            dot.style.height = "14px";
            dot.style.borderRadius = "999px";
            dot.style.background = "#0A56FF";
            dot.style.boxShadow = "0 8px 20px rgba(10,86,255,0.35)";
            dot.style.border = "3px solid white";

            const overlay = new kakao.maps.CustomOverlay({
                position: pos,
                content: dot,
                yAnchor: 0.5,
                xAnchor: 0.5,
            });

            overlay.setMap(map);
            myOverlayRef.current = overlay;
        } else {
            myOverlayRef.current.setPosition(pos);
            myOverlayRef.current.setMap(map);
        }
    }, [myPos?.lat, myPos?.lng]);

    // 4) 마커(오버레이) 생성/갱신
    useEffect(() => {
        const map = mapRef.current;
        const kakao = window.kakao;
        if (!map || !kakao?.maps) return;

        const store = overlaysRef.current;

        const nextIds = new Set(items.map((it) => it.id));

        // (A) 제거
        for (const [id, overlay] of store.entries()) {
            if (!nextIds.has(id)) {
                overlay.setMap(null);
                store.delete(id);
            }
        }

        // (B) 생성/갱신 (스타일 반영 위해 재생성)
        items.forEach((it) => {
            const pos = new kakao.maps.LatLng(it.lat, it.lng);
            const selected = it.id === selectedId;

            if (store.has(it.id)) {
                store.get(it.id).setMap(null);
                store.delete(it.id);
            }

            const wrapper = document.createElement("div");
            wrapper.innerHTML = buildHtmlMarker({ kind: it.kind, selected });
            const btn = wrapper.firstElementChild;

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect?.(it.id);
            });

            const overlay = new kakao.maps.CustomOverlay({
                position: pos,
                content: btn,
                yAnchor: 1,
            });

            overlay.setMap(map);
            store.set(it.id, overlay);
        });
    }, [items, selectedId, onSelect]);

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

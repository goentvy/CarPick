import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import ZoneBottomSheet from "../../components/zone/ZoneBottomSheet.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import zonesMock from "../../mocks/zones.json";
import myLocationIcon from "@/assets/icons/icon_myLocation.png";

/**
 * ✅ useMyLocation
 * - "모달 뜨기 전"에는 절대 위치 요청/추적을 시작하지 않음
 * - 이미 권한이 granted면 모달 없이 자동 추적 시작
 * - 사용자가 "허용" 눌렀을 때만 getCurrentPosition으로 권한 팝업 유도
 */
function useMyLocation() {
  const [myPos, setMyPos] = useState(null);

  // 모달 열림 여부
  const [locModalOpen, setLocModalOpen] = useState(false);

  // watchPosition 시작 게이트 (허용된 뒤에만 true)
  const [trackingOn, setTrackingOn] = useState(false);

  // 1) 진입 시 권한 상태 확인(가능하면)
  useEffect(() => {
    let mounted = true;

    async function checkPermission() {
      try {
        // Permissions API가 없으면: 사용자에게 먼저 묻는 UX로
        if (!navigator.permissions) {
          if (mounted) setLocModalOpen(true);
          return;
        }

        const res = await navigator.permissions.query({ name: "geolocation" });

        if (!mounted) return;

        if (res.state === "granted") {
          // ✅ 이미 허용: 모달 X, 추적 ON
          setLocModalOpen(false);
          setTrackingOn(true);
        } else if (res.state === "prompt") {
          // ✅ 아직 물어봐야 함: 모달 O
          setLocModalOpen(true);
          setTrackingOn(false);
        } else {
          // denied
          setLocModalOpen(true);
          setTrackingOn(false);
        }
      } catch {
        // 예외면 안전하게 모달부터
        if (mounted) setLocModalOpen(true);
      }
    }

    checkPermission();

    return () => {
      mounted = false;
    };
  }, []);

  // 2) 사용자가 "허용" 눌렀을 때 호출 (여기서 브라우저 팝업 뜸)
  const requestMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocModalOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocModalOpen(false);
        setTrackingOn(true); // ✅ 허용 이후부터 watch 시작
      },
      () => {
        // 거절/실패
        setLocModalOpen(false);
        setTrackingOn(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // 3) trackingOn일 때만 watchPosition으로 myPos 갱신
  useEffect(() => {
    if (!trackingOn) return;
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.log("위치 오류:", err),
      {
        enableHighAccuracy: false,
        maximumAge: 10000,
        timeout: 8000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingOn]);

  return { myPos, locModalOpen, setLocModalOpen, requestMyLocation };
}

export default function CarPickZonePage() {
  /** -----------------------
   *  1) 원본 데이터/뷰 상태
   * ---------------------- */
  const [zones] = useState(zonesMock);
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);

  /** -----------------------
   *  2) 검색 상태
   * ---------------------- */
  const [q, setQ] = useState("");

  /** -----------------------
   *  3) 내 위치
   * ---------------------- */
  const { myPos, locModalOpen, setLocModalOpen, requestMyLocation } = useMyLocation();

  /** -----------------------
   *  4) 지도 카메라 (center)
   * ---------------------- */
  const [camera, setCamera] = useState({
    lat: 37.5665,
    lng: 126.978,
    nonce: 0,
  });

  const moveCamera = useCallback((next) => {
    if (!next?.lat || !next?.lng) return;

    setCamera((prev) => ({
      lat: Number(next.lat),
      lng: Number(next.lng),
      nonce: Date.now(),
    }));
  }, []);

  /** -----------------------
   *  5) 바텀시트/선택 상태
   * ---------------------- */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(zones[0]?.id ?? null);

  /** -----------------------
   *  6) 파생 데이터
   * ---------------------- */
  const branchItems = useMemo(() => zones.filter((it) => it.kind === "BRANCH"), [zones]);

  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zones;
    return zones.filter((it) => it.kind === viewMode);
  }, [viewMode, zones]);

  // visibleItems 바뀌면 선택 보정
  useEffect(() => {
    if (!visibleItems.length) return;
    const exists = visibleItems.some((it) => it.id === selectedId);
    if (!exists) setSelectedId(visibleItems[0].id);
  }, [visibleItems, selectedId]);

  const selected = useMemo(() => {
    if (!visibleItems.length) return null;
    return visibleItems.find((it) => it.id === selectedId) ?? visibleItems[0];
  }, [visibleItems, selectedId]);

  const parentZone = useMemo(() => {
    if (!selected || selected.kind !== "DROP") return null;
    return branchItems.find((b) => b.id === selected.parentZoneId) ?? null;
  }, [selected, branchItems]);

  // 검색 결과는 BRANCH만
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return branchItems
      .filter((z) => (z.name + " " + z.address).toLowerCase().includes(kw))
      .slice(0, 8);
  }, [q, branchItems]);

  /** -----------------------
   *  7) 핸들러들
   * ---------------------- */
  const closeOverlays = useCallback(() => setFilterOpen(false), []);

  const openSheetFor = useCallback((id) => {
    setSelectedId(id);
    setSheetOpen(true);
  }, []);

  const selectZone = useCallback(
    (id, source = "UNKNOWN") => {
      openSheetFor(id);
      setFilterOpen(false);

      const target = zones.find((z) => z.id === id);
      if (target) moveCamera({ lat: target.lat, lng: target.lng });
    },
    [zones, moveCamera, openSheetFor]
  );

  const onPickZone = useCallback(
    (zoneId) => {
      if (viewMode === "DROP") setViewMode("BRANCH");
      selectZone(zoneId, "SEARCH");
      setQ("");
      setFilterOpen(false);
    },
    [selectZone, viewMode]
  );

  const onAllowLocation = useCallback(() => {
    requestMyLocation();
  }, [requestMyLocation]);

  /**
   * ✅ 핵심: "내 위치" 버튼 누를 때마다
   * - myPos(점이 찍힌 좌표)가 있으면 즉시 그 좌표로 이동
   * - myPos가 아직 없으면: 권한 요청/초기 위치 획득 먼저
   *
   * ※ GPS를 매번 getCurrentPosition으로 다시 부르지 않아도 됨
   *   (watchPosition이 이미 최신 myPos로 갱신 중)
   */
  const onGoMyLocation = useCallback(() => {
    if (!myPos) {
      requestMyLocation(); // 최초 권한 요청
      return;
    }

    moveCamera(myPos);
  }, [myPos, moveCamera, requestMyLocation]);

  /** -----------------------
   *  8) CTA
   * ---------------------- */
  const handlePickup = useCallback(() => {
    if (!selected || selected.kind !== "BRANCH") return;
    alert(`픽업 선택: ${selected.name}`);
  }, [selected]);

  const handleReturnDrop = useCallback(() => {
    if (!selected || selected.kind !== "DROP") return;
    alert(`반납 선택: ${selected.name}`);
  }, [selected]);

  /** -----------------------
   *  9) 렌더
   * ---------------------- */
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[640px]">
        <section className="relative h-screen md:h-[100dvh] w-full overflow-hidden">
          {/* 지도 */}
          <div className="absolute inset-0">
            <ZoneMapKakao
              items={visibleItems}
              selectedId={selected?.id}
              onSelect={(id) => selectZone(id, "MARKER")}
              onMapClick={() => {
                setSheetOpen(false);
                setFilterOpen(false);
              }}
              center={camera}
              myPos={myPos}
            />
          </div>

          {/* 상단 오버레이 */}
          <div className="absolute top-3 left-4 right-4 z-30 space-y-2 pointer-events-none">
            <div className="pointer-events-auto">
              <ZoneSearchBar
                value={q}
                onChange={setQ}
                results={results}
                onPick={onPickZone}
                onClear={() => setQ("")}
              />
            </div>

            {/* 필터 */}
            <div className="flex items-center justify-between gap-2 pointer-events-auto">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  className="h-8 px-3 rounded-full text-xs font-semibold border bg-[#C8FF48] text-[#111] border-black/10 shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur"
                >
                  {viewMode === "ALL" ? "모두보기" : viewMode === "BRANCH" ? "카픽존" : "드롭존"}
                  <span className="ml-1 text-black/40">▾</span>
                </button>

                {filterOpen && (
                  <div className="absolute mt-2 w-36 rounded-2xl bg-white border border-black/10 shadow-[0_16px_50px_rgba(0,0,0,0.16)] overflow-hidden">
                    {[
                      { key: "ALL", label: "모두보기" },
                      { key: "BRANCH", label: "카픽존" },
                      { key: "DROP", label: "드롭존" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setViewMode(opt.key);
                          setFilterOpen(false);
                        }}
                        className={[
                          "w-full text-left px-4 py-3 text-sm",
                          viewMode === opt.key ? "bg-[#EEF3FF] font-semibold" : "hover:bg-black/5",
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 아래 배너(예시) */}
          {!sheetOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[80] w-full max-w-[640px] px-4 pointer-events-none">
              <div className="h-20 rounded-2xl bg-[#E6F2F0] px-4 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="text-xs text-black/60">도착하자마자 바로 픽업</div>
                <div className="mt-0.5 text-sm font-semibold text-[#111]">
                  센터 픽업은 딜리버리보다 최대 OO% 저렴해요
                </div>
              </div>
            </div>
          )}

          {/* ✅ 내 위치 버튼 */}
          <div className="fixed left-1/2 -translate-x-1/2 bottom-36 z-[999] w-full max-w-[640px] px-4 pointer-events-none">
            <div className="flex justify-end pointer-events-auto">
              <button
                type="button"
                aria-label="내 위치로 이동"
                onClick={() => {
                  onGoMyLocation();
                  closeOverlays();
                }}
                className="w-10 h-10 rounded-full bg-white/95 border border-black/10 shadow flex items-center justify-center active:scale-[0.96] transition"
              >
                <img src={myLocationIcon} alt="내 위치" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 바텀시트 */}
          <ZoneBottomSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            selected={selected}
            parentZone={parentZone}
            onPickup={handlePickup}
            onReturnDrop={handleReturnDrop}
          />

          {/* ✅ 첫 진입 위치 모달 */}
          <LocationPermissionModal
            open={locModalOpen}
            onAllow={onAllowLocation}
            onSkip={() => setLocModalOpen(false)}
          />
        </section>
      </div>
    </div>
  );
}

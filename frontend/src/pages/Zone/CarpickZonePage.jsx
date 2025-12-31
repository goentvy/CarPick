// ✅ CarPickZonePage.jsx (최소 수정 버전)
// - return 1개만 남김
// - selected/parentZone 중복 선언 제거
// - 기존 ZoneBottomSheet → Branch/Drop 2시트로 교체
// - 나머지 로직(지도/검색/필터/내위치/모달) 유지

import { useCallback, useEffect, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
// import ZoneBottomSheet from "../../components/zone/ZoneBottomSheet.jsx"; // ❌ 구버전 제거
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import zonesMock from "../../mocks/zones.json";
import myLocationIcon from "@/assets/icons/icon_myLocation.png";

// ✅ 신규: 분리된 2시트 import (경로는 네가 만든 위치에 맞춰)
// - 내가 이전에 제안한 트리: src/components/zone/sheet/*
import ZoneBottomSheetBranch from "../../components/zone/sheet/ZoneBottomSheetBranch.jsx";
import ZoneBottomSheetDrop from "../../components/zone/sheet/ZoneBottomSheetDrop.jsx";

/**
 * ✅ useMyLocation
 * - "모달 뜨기 전"에는 절대 위치 요청/추적을 시작하지 않음
 * - 이미 권한이 granted면 모달 없이 자동 추적 시작
 * - 사용자가 "허용" 눌렀을 때만 getCurrentPosition으로 권한 팝업 유도
 */
function useMyLocation() {
  const [myPos, setMyPos] = useState(null);
  const [locModalOpen, setLocModalOpen] = useState(false);
  const [trackingOn, setTrackingOn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkPermission() {
      try {
        if (!navigator.permissions) {
          if (mounted) setLocModalOpen(true);
          return;
        }

        const res = await navigator.permissions.query({ name: "geolocation" });

        if (!mounted) return;

        if (res.state === "granted") {
          setLocModalOpen(false);
          setTrackingOn(true);
        } else if (res.state === "prompt") {
          setLocModalOpen(true);
          setTrackingOn(false);
        } else {
          setLocModalOpen(true);
          setTrackingOn(false);
        }
      } catch {
        if (mounted) setLocModalOpen(true);
      }
    }

    checkPermission();

    return () => {
      mounted = false;
    };
  }, []);

  const requestMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocModalOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocModalOpen(false);
        setTrackingOn(true);
      },
      () => {
        setLocModalOpen(false);
        setTrackingOn(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

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

    setCamera(() => ({
      lat: Number(next.lat),
      lng: Number(next.lng),
      nonce: Date.now(),
    }));
  }, []);

  /** -----------------------
   *  5) 바텀시트/선택 상태
   * ---------------------- */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /** -----------------------
   *  6) 파생 데이터
   * ---------------------- */
  const branchItems = useMemo(() => zones.filter((it) => it.kind === "BRANCH"), [zones]);

  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zones;
    return zones.filter((it) => it.kind === viewMode);
  }, [viewMode, zones]);

  // ✅ 최초 진입/필터 변경 시 selectedId 보정
  useEffect(() => {
    if (!visibleItems.length) return;

    const exists = selectedId != null && visibleItems.some((it) => it.id === selectedId);
    if (!exists) setSelectedId(visibleItems[0].id);
  }, [visibleItems, selectedId]);

  // ✅ 선택된 아이템
  const selected = useMemo(() => {
    if (!visibleItems.length) return null;
    return visibleItems.find((it) => it.id === selectedId) ?? visibleItems[0];
  }, [visibleItems, selectedId]);

  // ✅ DROP이면 연결된 BRANCH 찾기
  const parentZone = useMemo(() => {
    if (!selected || selected.kind !== "DROP") return null;
    return branchItems.find((b) => b.id === selected.parentZoneId) ?? null;
  }, [selected, branchItems]);

  // ✅ 검색 결과는 BRANCH만
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

  // ✅ 내 위치 버튼
  const onGoMyLocation = useCallback(() => {
    if (!myPos) {
      requestMyLocation();
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
   *  9) 렌더 (return 1개만!)
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

          {/* 내 위치 버튼 */}
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

          {/* ✅ 바텀시트: 2종 분리 (기존 ZoneBottomSheet 대체) */}
          <ZoneBottomSheetBranch
            open={sheetOpen && selected?.kind === "BRANCH"}
            onClose={() => setSheetOpen(false)}
            zone={selected?.kind === "BRANCH" ? selected : null}
            onPickup={handlePickup}
            onCarClick={(car) => {
              // TODO: 차량 상세 이동
              console.log("car click:", car);
            }}
          />

          <ZoneBottomSheetDrop
            open={sheetOpen && selected?.kind === "DROP"}
            onClose={() => setSheetOpen(false)}
            dropZone={selected?.kind === "DROP" ? selected : null}
            parentZone={parentZone}
            onReturnDrop={handleReturnDrop}
          />

          {/* 첫 진입 위치 모달 */}
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

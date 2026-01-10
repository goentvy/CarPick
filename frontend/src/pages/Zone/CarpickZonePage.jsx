import { useCallback, useEffect, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import myLocationIcon from "@/assets/icons/icon_myLocation.png";
import ZoneBottomSheetBranch from "../../components/zone/sheet/ZoneBottomSheetBranch.jsx";
import ZoneBottomSheetDrop from "../../components/zone/sheet/ZoneBottomSheetDrop.jsx";
import { useZoneMap } from "@/hooks/useZoneMap";
import { getBranchDetail } from "@/services/zoneApi.js";

/** --------------------------------
 * 내 위치 훅 (페이지와 독립)
 * - 선언/사용 순서 이슈와 무관하게 상단에 둠
 * -------------------------------- */
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
      { enableHighAccuracy: false, maximumAge: 10000, timeout: 8000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingOn]);

  return { myPos, locModalOpen, setLocModalOpen, requestMyLocation };
}

export default function CarPickZonePage() {
  /** -----------------------
   *  1) View / UI State
   * ---------------------- */
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);

  /** -----------------------
   *  2) Search State
   * ---------------------- */
  const [q, setQ] = useState("");

  /** -----------------------
   *  3) BottomSheet / Selection State  ✅ (먼저 선언!)
   * ---------------------- */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sheetH, setSheetH] = useState("0px");

  /** -----------------------
   *  4) Branch Detail State
   * ---------------------- */
  const [branchDetail, setBranchDetail] = useState(null);
  const [branchDetailLoading, setBranchDetailLoading] = useState(false);

  /** -----------------------
   *  5) My Location
   * ---------------------- */
  const { myPos, locModalOpen, setLocModalOpen, requestMyLocation } =
    useMyLocation();

  /** -----------------------
   *  6) Map Camera State
   * ---------------------- */
  const [camera, setCamera] = useState({
    lat: 37.5665,
    lng: 126.978,
    nonce: 0,
  });

  /** -----------------------
   *  7) Data from hook
   * ---------------------- */
  const { zones, branchItems, loading, firstBranch } = useZoneMap();

  /** -----------------------
   *  8) Callbacks
   * ---------------------- */
  const moveCamera = useCallback((next) => {
    if (!next?.lat || !next?.lng) return;

    setCamera(() => ({
      lat: Number(next.lat),
      lng: Number(next.lng),
      nonce: Date.now(),
    }));
  }, []);

  const closeOverlays = useCallback(() => {
    setFilterOpen(false);
    setSheetOpen(false);
    setSheetH("0px"); // ✅ 시트 닫힘 기준
  }, []);

  const selectZone = useCallback(
    (id) => {
      setSelectedId(id);
      setSheetOpen(true);
      setFilterOpen(false);

      const target = zones.find((z) => z.id === id);
      if (target) moveCamera({ lat: target.lat, lng: target.lng });
    },
    [zones, moveCamera]
  );

  const onPickZone = useCallback(
    (zoneId) => {
      if (viewMode === "DROP") setViewMode("BRANCH");
      selectZone(zoneId);
      setQ("");
      setFilterOpen(false);
    },
    [selectZone, viewMode]
  );

  const onAllowLocation = useCallback(
    () => requestMyLocation(),
    [requestMyLocation]
  );

  const onGoMyLocation = useCallback(() => {
    if (!myPos) {
      requestMyLocation();
      return;
    }
    moveCamera(myPos);
  }, [myPos, moveCamera, requestMyLocation]);

  /** -----------------------
   *  9) Derived Data
   * ---------------------- */
  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zones;
    return zones.filter((it) => it.kind === viewMode);
  }, [viewMode, zones]);

  // ✅ selectedId 보정
  useEffect(() => {
    if (!visibleItems.length) return;

    const exists =
      selectedId != null && visibleItems.some((it) => it.id === selectedId);

    if (!exists) setSelectedId(visibleItems[0].id);
  }, [visibleItems, selectedId]);

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
   *  10) Effects
   * ---------------------- */

  // ✅ 첫 지점 자동 선택 + 카메라 이동
  useEffect(() => {
    if (!firstBranch) return;

    setSelectedId((prev) => prev ?? firstBranch.id);
    moveCamera({ lat: firstBranch.lat, lng: firstBranch.lng });
  }, [firstBranch, moveCamera]);

  // ✅ BRANCH 상세 불러오기
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!selected || selected.kind !== "BRANCH") {
        setBranchDetail(null);
        setBranchDetailLoading(false);
        return;
      }

      const branchId = selected.branchId;
      if (!branchId) {
        setBranchDetail(null);
        setBranchDetailLoading(false);
        return;
      }

      try {
        setBranchDetailLoading(true);
        const res = await getBranchDetail(branchId);
        if (!alive) return;
        setBranchDetail(res.data);
      } catch (e) {
        if (!alive) return;
        console.error("getBranchDetail fail", e);
        setBranchDetail(null);
      } finally {
        if (alive) setBranchDetailLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selected?.kind, selected?.branchId]);

  /** -----------------------
   *  11) Layout Calc
   * ---------------------- */
  const GAP = 16;
  const BASE_BOTTOM = 120;

  const sheetPx = Number.parseInt(sheetH || "0", 10) || 0;
  const bottom = Math.max(BASE_BOTTOM, sheetPx + GAP);

  /** -----------------------
   *  12) Render
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
              onSelect={selectZone}
              onMapClick={closeOverlays}
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
                  {viewMode === "ALL"
                    ? "모두보기"
                    : viewMode === "BRANCH"
                      ? "카픽존"
                      : "드롭존"}
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
                          viewMode === opt.key
                            ? "bg-[#EEF3FF] font-semibold"
                            : "hover:bg-black/5",
                        ].join(" ")}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading && (
                <div className="text-xs text-black/50 bg-white/90 border border-black/10 rounded-full px-3 h-8 flex items-center">
                  지점 불러오는 중...
                </div>
              )}
            </div>
          </div>

          {/* 아래 배너(예시) */}
          {!sheetOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-80 w-full max-w-[640px] px-4 pointer-events-none">
              <div className="h-20 rounded-2xl bg-[#E6F2F0] px-4 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="text-xs text-black/60">도착하자마자 바로 픽업</div>
                <div className="mt-0.5 text-sm font-semibold text-[#111]">
                  센터 픽업은 딜리버리보다 최대 OO% 저렴해요
                </div>
              </div>
            </div>
          )}

          {/* 내 위치 버튼 */}
          <div
            className="fixed left-1/2 -translate-x-1/2 z-[999] w-full max-w-[640px] px-4 pointer-events-none"
            style={{ bottom: `calc(${bottom}px + env(safe-area-inset-bottom))` }}
          >
            <div className="flex justify-end pointer-events-auto">
              <button
                type="button"
                aria-label="내 위치로 이동"
                onClick={() => {
                  onGoMyLocation();
                  setFilterOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-white/95 border border-black/10 shadow flex items-center justify-center active:scale-[0.96] transition"
              >
                <img src={myLocationIcon} alt="내 위치" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 바텀시트: 2종 분리 */}
          <ZoneBottomSheetBranch
            open={sheetOpen && selected?.kind === "BRANCH"}
            onClose={closeOverlays}
            zone={
              selected?.kind === "BRANCH"
                ? {
                  ...selected,
                  open: branchDetail?.openTime,
                  close: branchDetail?.closeTime,
                  openStatus: branchDetail?.openStatus,
                  openLabel: branchDetail?.openLabel,
                  address: branchDetail?.addressBasic ?? selected.address,
                  phone: branchDetail?.phone,
                }
                : null
            }
            onHeightChange={
              sheetOpen && selected?.kind === "BRANCH" ? setSheetH : undefined
            }
          />

          <ZoneBottomSheetDrop
            open={sheetOpen && selected?.kind === "DROP"}
            onClose={closeOverlays}
            dropZone={selected?.kind === "DROP" ? selected : null}
            parentZone={parentZone}
            onHeightChange={
              sheetOpen && selected?.kind === "DROP" ? setSheetH : undefined
            }
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

import { useCallback, useEffect, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
// import zonesMock from "../../mocks/zones.json";
import myLocationIcon from "@/assets/icons/icon_myLocation.png";
import { getZoneMap } from "@/services/zoneApi.js";
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
  const [zones, setZones] = useState([]);
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);

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
   * [MOD] 최초: ZoneMap 로딩 (branches+dropzones 한 번에)
   * GET /api/zone/map
   * ---------------------- */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingZones(true);

        const res = await getZoneMap(); // ✅ { branches, dropzones }
        if (!alive) return;

        const { branches = [], dropzones = [] } = res.data || {};

        // ✅ map 응답을 "zones" 공통 형태로 변환
        const nextZones = [
          ...branches.map((b) => ({
            id: `B-${b.branchId}`, // ✅ 충돌 방지
            kind: "BRANCH",
            name: b.branchName,
            address: b.addressBasic,
            lat: Number(b.latitude),
            lng: Number(b.longitude),
          })),
          ...dropzones.map((d) => ({
            id: `D-${d.dropzoneId}`, // ✅ 충돌 방지
            kind: "DROP",
            name: d.dropzoneName,
            address: d.addressText,
            lat: Number(d.latitude),
            lng: Number(d.longitude),
            parentZoneId: `B-${d.branchId}`, // ✅ branch 연결
            walkingTimeMin: d.walkingTimeMin,
            locationDesc: d.locationDesc,
            isActive: d.isActive,
          })),
        ];

        setZones(nextZones);

        // ✅ 초기 선택: 첫 BRANCH로
        const firstBranch = nextZones.find((z) => z.kind === "BRANCH");
        if (firstBranch) {
          setSelectedId(firstBranch.id);
          moveCamera({ lat: firstBranch.lat, lng: firstBranch.lng });
        }
      } catch (e) {
        console.error("zone map load fail", e);
        setZones([]);
      } finally {
        if (alive) setLoadingZones(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [moveCamera]);

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
   * 6.5) 선택된 BRANCH의 DROP 로딩 함수
   * - selectZone에서 BRANCH 선택될 때 호출
   * - API 형태(/dropzones?branchId=)에 맞춰 "지점 기준"으로만 DROP을 붙임
   * ---------------------- */
  const loadDropzonesForBranch = useCallback(async (branchIdStr) => {
    const branchId = Number(branchIdStr);
    if (!branchId || Number.isNaN(branchId)) return;

    // ✅ 캐시가 있으면 API 호출 없이 바로 붙임
    if (dropCacheRef.current.has(branchIdStr)) {
      const cached = dropCacheRef.current.get(branchIdStr);

      setZones((prev) => {
        const onlyBranches = prev.filter((it) => it.kind === "BRANCH");
        return [...onlyBranches, ...(cached ?? [])];
      });
      return;
    }

    try {
      const res = await getDropzones(branchId); // GET /api/dropzones?branchId=...
      const dropZones = (res.data ?? []).map((d) => ({
        id: String(d.dropzoneId),
        kind: "DROP",
        name: d.dropzoneName,
        address: d.addressText,
        lat: Number(d.latitude),
        lng: Number(d.longitude),
        parentZoneId: String(d.branchId), // ✅ parentZone 연결용
        walkingTimeMin: d.walkingTimeMin,
        // locationDesc: d.locationDesc,
        // serviceHours: d.serviceHours,
        // isActive: d.isActive,
      }));

      // ✅ 캐시에 저장
      dropCacheRef.current.set(branchIdStr, dropZones);

      // ✅ zones = BRANCH 전체 + (해당 branch DROP만)
      setZones((prev) => {
        const onlyBranches = prev.filter((it) => it.kind === "BRANCH");
        return [...onlyBranches, ...dropZones];
      });
    } catch (e) {
      console.error("dropzones load fail", e);
    }
  }, []);


  /** -----------------------
   *  7) 핸들러들
   * ---------------------- */
  const closeOverlays = useCallback(() => setFilterOpen(false), []);

  const openSheetFor = useCallback((id) => {
    setSelectedId(id);
    setSheetOpen(true);
  }, []);

  // ✅ [MOD] selectZone는 기존 흐름 유지 + BRANCH 선택 시 dropzones 로딩만 추가
  const selectZone = useCallback(
    (id, source = "UNKNOWN") => {
      openSheetFor(id);
      setFilterOpen(false);

      const target = zones.find((z) => z.id === id);
      if (target) {
        moveCamera({ lat: target.lat, lng: target.lng });

        // ✅ BRANCH 선택이면: 해당 지점 dropzones를 API로 불러와 zones에 합치기
        if (target.kind === "BRANCH") {
          loadDropzonesForBranch(target.id);
        }

        // ✅ DROP 선택이면: parentZoneId 기준으로 parentZone도 확실히 잡히게 하고 싶을 때(선택)
        // - 지금은 parentZone을 branchItems에서 찾고 있으니 필수는 아님
        // if (target.kind === "DROP" && target.parentZoneId) {
        //   loadDropzonesForBranch(target.parentZoneId);
        // }
      }
    },
    [zones, moveCamera, openSheetFor, loadDropzonesForBranch]
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
   *  8) 렌더 (return 1개만!)
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

              {/* ✅ [MOD] 로딩 표시(선택) */}
              {/* {loadingZones && (
                <div className="text-xs text-black/50 bg-white/90 border border-black/10 rounded-full px-3 h-8 flex items-center">
                  지점 불러오는 중...
                </div>
              )} */}
            </div>
          </div>

          {/* 아래 배너(예시) */}
          {!sheetOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[80] w-full max-w-[640px] px-4 pointer-events-none">
              <div className="h-20 rounded-2xl bg-[#E6F2F0] px-4 flex flex-col justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                <div className="text-xs text-black/60">
                  도착하자마자 바로 픽업
                </div>
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

          {/* ✅ 바텀시트: 2종 분리 */}
          <ZoneBottomSheetBranch
            open={sheetOpen && selected?.kind === "BRANCH"}
            onClose={() => setSheetOpen(false)}
            zone={selected?.kind === "BRANCH" ? selected : null}
          />

          <ZoneBottomSheetDrop
            open={sheetOpen && selected?.kind === "DROP"}
            onClose={() => setSheetOpen(false)}
            dropZone={selected?.kind === "DROP" ? selected : null}
            parentZone={parentZone}
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
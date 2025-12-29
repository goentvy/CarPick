import { useEffect, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import ZoneBottomSheet from "../../components/zone/ZoneBottomSheet.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import zonesMock from "../../mocks/zones.json";

export default function CarPickZonePage() {
  // ✅ (권장) 나중에 API로 바뀔 걸 대비해서 원본 데이터를 state로 둠
  const [zones] = useState(zonesMock);

  // 모두보기 / 카픽존만 / 드롭존만
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);

  // 검색
  const [q, setQ] = useState("");

  // 내 위치
  const [myPos, setMyPos] = useState(null);
  const [locModalOpen, setLocModalOpen] = useState(true);

  // ✅ center를 setState로 갖고, panTo의 근거를 "center" 하나로 통일
  const [camera, setCamera] = useState({
    lat: 37.5665,
    lng: 126.978,
    reason: "INIT",
  });

  // ✅ 카메라 이동 함수
  const moveCamera = (next, reason = "UNKNOWN") => {
    // 방어코드: lat/lng 없으면 무시
    if (next?.lat == null || next?.lng == null) return;

    setCamera({
      lat: Number(next.lat),
      lng: Number(next.lng),
      reason,
    });
  };

  // 바텀시트
  const [sheetOpen, setSheetOpen] = useState(false);

  // 데이터 분리
  const branchItems = useMemo(
    () => zones.filter((it) => it.kind === "BRANCH"),
    [zones]
  );

  // 보여줄 아이템
  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zones;
    return zones.filter((it) => it.kind === viewMode);
  }, [viewMode, zones]);

  // 선택된 id
  const [selectedId, setSelectedId] = useState(zones[0]?.id ?? null);

  // visibleItems 변경 시 선택 보정
  useEffect(() => {
    if (!visibleItems.length) return;
    const exists = visibleItems.some((it) => it.id === selectedId);
    if (!exists) setSelectedId(visibleItems[0].id);
  }, [visibleItems, selectedId]);

  // 선택된 아이템
  const selected = useMemo(() => {
    if (!visibleItems.length) return null;
    return visibleItems.find((it) => it.id === selectedId) ?? visibleItems[0];
  }, [visibleItems, selectedId]);

  // 드롭존일 때 연결된 카픽존
  const parentZone = useMemo(() => {
    if (!selected || selected.kind !== "DROP") return null;
    return branchItems.find((b) => b.id === selected.parentZoneId) ?? null;
  }, [selected, branchItems]);

  // 검색 결과 (카픽존만 대상으로)
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return branchItems
      .filter((z) => (z.name + " " + z.address).toLowerCase().includes(kw))
      .slice(0, 8);
  }, [q, branchItems]);

  // ✅ 존 선택 함수 (검색/마커 공통으로 사용)
  const selectZone = (id, source = "UNKNOWN") => {
    setSelectedId(id);
    setSheetOpen(true);
    setFilterOpen(false);

    const target = zones.find((z) => z.id === id);
    if (target) {
      // ✅ 지도를 선택된 존으로 이동
      moveCamera({ lat: target.lat, lng: target.lng }, `SELECT:${source}`);
    }
  };

  // ✅ 검색으로 카픽존 선택 (❗️onGoMyLocation 밖으로 빼야 함)
  const onPickZone = (zoneId) => {
    // 검색 결과는 BRANCH만 나오니까 보기 모드도 BRANCH로 맞추기
    setViewMode("BRANCH");
    selectZone(zoneId, "SEARCH");

    setQ("");
    setSheetOpen(true);
    setFilterOpen(false); // 검색 후 드롭다운 닫기
  };

  // 첫 진입 위치 요청
  const requestMyLocation = () => {
    if (!navigator.geolocation) {
      setLocModalOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos(next);

        // ✅ camera로 통일했으니, 허용 직후 지도도 내 위치로 이동
        moveCamera(next, "INIT_MY_LOCATION");

        setLocModalOpen(false);
      },
      () => {
        setLocModalOpen(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // “내 위치로”
  const onGoMyLocation = () => {
    if (!myPos) return;
    moveCamera(myPos, "MY_LOCATION"); // ✅ 여기서만 이동
  };

  // ✅ 내 위치 갱신(옵션)
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setMyPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log("위치 오류:", err);
      },
      {
        enableHighAccuracy: false, // ⭐ 중요
        maximumAge: 10000, // 10초 캐시
        timeout: 8000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // CTA 핸들러
  const handlePickup = () => {
    if (!selected || selected.kind !== "BRANCH") return;
    alert(`픽업 선택: ${selected.name}`);
  };

  const handleReturnDrop = () => {
    if (!selected || selected.kind !== "DROP") return;
    alert(`반납 선택: ${selected.name}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[640px]">
        <section className="relative h-screen md:h-[100dvh] w-full overflow-hidden">
          {/* 지도 */}
          <div className="absolute inset-0">
            <ZoneMapKakao
              items={visibleItems}
              selectedId={selected?.id}
              onSelect={(id) => {
                selectZone(id, "MARKER");
              }}
              onMapClick={() => {
                setSheetOpen(false);
                setFilterOpen(false);
              }}
              center={camera} // ✅ camera 단일 근거
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
                onPick={onPickZone} // ✅ 이제 정상 동작
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
            </div>
          </div>

          {/* 내 위치 버튼 */}
          <div className="fixed right-4 bottom-36 z-[999] pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                console.log("[UI] 내 위치 버튼 클릭됨");
                onGoMyLocation();
                setFilterOpen(false);
              }}
              className="h-8 px-4 rounded-full text-xs font-semibold bg-white/95 text-[#111] border border-black/10 shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur"
            >
              내 위치
            </button>
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

          {/* 첫 진입 위치 모달 */}
          <LocationPermissionModal
            open={locModalOpen}
            onAllow={requestMyLocation}
            onSkip={() => setLocModalOpen(false)}
          />
        </section>
      </div>
    </div>
  );
}

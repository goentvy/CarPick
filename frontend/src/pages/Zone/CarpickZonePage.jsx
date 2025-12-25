import { useEffect, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import ZoneBottomSheet from "../../components/zone/ZoneBottomSheet.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import zonesMock from "../../mocks/zones.json";

export default function CarPickZonePage() {
  // 모두보기 / 카픽존만 / 드롭존만
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);

  // 검색
  const [q, setQ] = useState("");

  // 내 위치
  const [myPos, setMyPos] = useState(null);
  const [locModalOpen, setLocModalOpen] = useState(true);

  // 바텀시트
  const [sheetOpen, setSheetOpen] = useState(false);

  // 데이터 분리
  const branchItems = useMemo(
    () => zonesMock.filter((it) => it.kind === "BRANCH"),
    []
  );

  const dropItems = useMemo(
    () => zonesMock.filter((it) => it.kind === "DROP"),
    []
  ); // (현재 미사용) 필요 없으면 지워도 됨

  // 보여줄 아이템
  const visibleItems = useMemo(() => {
    if (viewMode === "ALL") return zonesMock;
    return zonesMock.filter((it) => it.kind === viewMode);
  }, [viewMode]);

  // 선택된 id
  const [selectedId, setSelectedId] = useState(zonesMock[0]?.id ?? null);

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

  // map center 우선순위: 내 위치 > 선택 지점 > 기본 서울
  const mapCenter = useMemo(() => {
    if (myPos) return myPos;
    return {
      lat: selected?.lat ?? 37.5665,
      lng: selected?.lng ?? 126.978,
    };
  }, [myPos, selected]);

  // 검색 결과 (카픽존만 대상으로)
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return branchItems
      .filter((z) => (z.name + " " + z.address).toLowerCase().includes(kw))
      .slice(0, 8);
  }, [q, branchItems]);

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
        setLocModalOpen(false);
      },
      () => {
        setLocModalOpen(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // 검색으로 카픽존 선택
  const onPickZone = (zoneId) => {
    setSelectedId(zoneId);
    setSheetOpen(true);
    setQ("");
  };

  // “내 위치로”
  const onGoMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos(next);
      },
      () => { },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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
        <section className="relative h-[100dvh] w-full overflow-hidden">
          {/* 지도 */}
          <div className="absolute inset-0">
            <ZoneMapKakao
              items={visibleItems}
              selectedId={selected?.id}
              onSelect={(id) => {
                setSelectedId(id);
                setSheetOpen(true);
              }}
              onMapClick={() => setSheetOpen(false)}   // ✅ 여기 추가
              center={mapCenter}
              myPos={myPos}
            />
          </div>


          {/* 상단 오버레이: 검색/필터/내위치 */}
          <div className="absolute top-3 left-4 right-4 z-30 space-y-2 pointer-events-none">
            <ZoneSearchBar
              value={q}
              onChange={setQ}
              results={results}
              onPick={onPickZone}
              onClear={() => setQ("")}
            />

            {/* 필터 + 내 위치 */}
            <div className="flex items-center justify-between gap-2 pointer-events-auto">
              {/* Filter Dropdown */}
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
           {/* My Location */}
          <div className="absolute right-4 bottom-36 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={onGoMyLocation}
              className="h-8 px-4 rounded-full text-xs font-semibold
               bg-white/95 text-[#111] border border-black/10
               shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur"
            >
              내 위치
            </button>
            </div>

            {/* 하단: 브랜드 한줄 (bottom-15는 비표준이라 bottom-24 추천) */}
            <div className="absolute left-4 right-4 bottom-24 z-20 pointer-events-none">
              <div className="rounded-2xl bg-white/88 border border-black/5 shadow-[0_16px_50px_rgba(0,0,0,0.16)] px-4 py-3 backdrop-blur">
                <div className="text-xs font-semibold text-[#2B56FF]">
                  도착을 출발로 바꾸는, 여행의 가장 빠른 픽
                </div>
                <div className="mt-1 text-sm text-[#111] leading-relaxed">
                  <b>카픽존</b>에서 바로 출발하고, 필요하면{" "}
                  <b>드롭존</b>에 가볍게 반납하세요.
                </div>
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

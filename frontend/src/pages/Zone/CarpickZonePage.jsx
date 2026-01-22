import { useCallback, useMemo, useState } from "react";
import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";
import ZoneSearchBar from "../../components/zone/ZoneSearchBar.jsx";
import LocationPermissionModal from "../../components/zone/LocationPermissionModal.jsx";
import myLocationIcon from "@/assets/icons/icon_myLocation.png";
import ZoneBottomSheetBranch from "../../components/zone/sheet/ZoneBottomSheetBranch.jsx";
import ZoneBottomSheetDrop from "../../components/zone/sheet/ZoneBottomSheetDrop.jsx";

import { useZoneMap } from "@/hooks/useZoneMap";
import { useMyLocation } from "@/hooks/useMyLocation.js";
import { useZoneSelection } from "@/hooks/useZoneSelection.js";
import { useBranchDetail } from "@/hooks/useBranchDetail";
import { useNavigate } from "react-router-dom";
import { Images } from "lucide-react";



export default function CarPickZonePage() {
  /** 1) View / UI */
  const [viewMode, setViewMode] = useState("ALL"); // "ALL" | "BRANCH" | "DROP"
  const [filterOpen, setFilterOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const navigate = useNavigate();

  /** 2) Search */
  const [q, setQ] = useState("");

  /** 3) BottomSheet & Detailpage */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetH, setSheetH] = useState("0px");


  /** 4) Camera */
  const [camera, setCamera] = useState({
    lat: 37.5665,
    lng: 126.978,
    nonce: 0,
  });

  /** 5) Data */
  const { zones, branchItems, loading, firstBranch } = useZoneMap();

  /** 6) Location */
  const { myPos, locModalOpen, setLocModalOpen, requestMyLocation } =
    useMyLocation();

  /** 7) Camera helpers */
  const moveCamera = useCallback((next) => {
    if (!next?.lat || !next?.lng) return;
    setCamera(() => ({
      lat: Number(next.lat),
      lng: Number(next.lng),
      nonce: Date.now(),
    }));
  }, []);

  /** 8) Close overlays */
  const closeOverlays = useCallback(() => {
    setFilterOpen(false);
    setSheetOpen(false);
    setSheetH("0px");
  }, []);

  /** 9) Selection / Derived */
  const {
    selectedId,
    setSelectedId,
    visibleItems,
    selected,
    parentZone,
    results,
  } = useZoneSelection({
    zones,
    branchItems,
    viewMode,
    q,
    firstBranch,
    onFirstPick: (fb) => moveCamera({ lat: fb.lat, lng: fb.lng }),
  });

  /** 10) Select handlers */
  const selectZone = useCallback(
    (id) => {
      setSelectedId(id);
      setSheetOpen(true);
      setFilterOpen(false);

      const target = visibleItems.find((z) => z.id === id); // ✅ CHANGED
      if (target) moveCamera({ lat: target.lat, lng: target.lng });
    },
    [visibleItems, moveCamera, setSelectedId] // ✅ CHANGED (zones -> visibleItems)
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
    if (!myPos) return requestMyLocation();
    moveCamera(myPos);
  }, [myPos, moveCamera, requestMyLocation]);

  /** 11) Branch detail */
  const { branchDetail, branchDetailLoading } = useBranchDetail(selected);

  /** 12) Layout calc */
  const GAP = 16;
  const BASE_BOTTOM = 120;
  const sheetPx = Number.parseInt(sheetH || "0", 10) || 0;
  const bottom = Math.max(BASE_BOTTOM, sheetPx + GAP);

  /** 13) 단일 지점 정보 병합: branchZone, dropzone */
  const branchZone = useMemo(() => {
    if (selected?.kind !== "BRANCH") return null;

    return {
      ...selected,
      address: branchDetail?.addressBasic ?? selected.address,
      openTime: branchDetail?.openTime,
      closeTime: branchDetail?.closeTime,
      openStatus: branchDetail?.openStatus,
      openLabel: branchDetail?.openLabel,
      imageUrl: branchDetail?.imageUrl,
    };
  }, [selected, branchDetail]);

  const goBranchDetail = useCallback(() => {
    if (!branchZone?.branchId) return;
    navigate(`/zone/branch/${branchZone.branchId}`);
  }, [navigate, branchZone?.branchId]);

  const goReserve = useCallback(() => {
    if (!branchZone?.branchId) return;
    navigate(`/cars?pickupBranchId=${branchZone.branchId}`);
  }, [navigate, branchZone?.branchId]);

  /** 14) Rendering */
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
              showCrowd={legendOpen}
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

            {/* 필터 + 혼잡도 토글 */}
            <div className="flex items-center justify-between gap-2 pointer-events-auto">
              {/* 왼쪽: 필터 */}
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
                  <div className="absolute z-40 mt-2 w-36 rounded-2xl bg-white border border-black/10 shadow-[0_16px_50px_rgba(0,0,0,0.16)] overflow-hidden">
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

              {/* 오른쪽: 혼잡도 토글 + 로딩 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLegendOpen((v) => !v)}
                  className={[
                    "h-8 px-3 rounded-full text-xs font-semibold border border-black/10",
                    "bg-white/90 backdrop-blur shadow-[0_6px_18px_rgba(0,0,0,0.12)]",
                    legendOpen ? "text-[#111]" : "text-black/60",
                  ].join(" ")}
                  aria-pressed={legendOpen}
                >
                  혼잡도
                  <span className="ml-1 text-black/40">{legendOpen ? "ON" : "OFF"}</span>
                </button>

                {loading && (
                  <div className="text-xs text-black/50 bg-white/90 border border-black/10 rounded-full px-3 h-8 flex items-center">
                    지점 불러오는 중...
                  </div>
                )}
              </div>
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
            zone={branchZone}
            onDetail={goBranchDetail}
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

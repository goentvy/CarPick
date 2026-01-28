import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getBranchDetail } from "@/services/zoneApi.js";
import { getCarList } from "@/services/carApi.js";
// import PickupCarCard from "@/components/car/PickupCarCard.jsx"; // 상태 데이터 들어갈 경우 사용
import CarCard from "@/pages/Car/CarCard.jsx";

import ZoneMapKakao from "@/components/zone/ZoneMapKakao.jsx";
import { getOpenLabel } from "@/components/zone/utils/zoneFormat.js";

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function BranchDetailPage() {
  const { branchId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  const [expanded, setExpanded] = useState(false);

  const list = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);

  const COLLAPSED_COUNT = 2; // 처음 2개
  const EXPANDED_COUNT = 6;  // 펼치면 최대 6개 (원하면 늘려)

  const visibleCars = useMemo(() => {
    return expanded
      ? list.slice(0, EXPANDED_COUNT)
      : list.slice(0, COLLAPSED_COUNT);
  }, [expanded, list]);

  const hasMore = list.length > COLLAPSED_COUNT;

  // 1) 지점 상세 로드
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getBranchDetail(Number(branchId));
        if (!alive) return;
        setDetail(res.data ?? null);
      } catch (e) {
        console.error("branch detail fail", e);
        if (alive) setDetail(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [branchId]);

  // 2) 지점 차량 로드 (pickupBranchId로 필터링)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setCarsLoading(true);

        // ✅ 네 백엔드/프론트 구조상 차량 목록 조회가 params 받는 형태였음
        // getCarList(params) -> api.get("/cars", { params })
        const res = await getCarList({ pickupBranchId: Number(branchId) });

        if (!alive) return;
        // 서버 응답 형태에 맞춰 조정 (예: res.data.items)
        const list = res.data?.items ?? res.data ?? [];
        setCars(Array.isArray(list) ? list : []);
      } catch (e) {
        console.warn("branch cars fail", e);
        if (alive) setCars([]);
      } finally {
        if (alive) setCarsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [branchId]);

  // 3) 지도 표시용 단일 item
  const mapItem = useMemo(() => {
    const lat = safeNum(detail?.latitude);
    const lng = safeNum(detail?.longitude);

    if (!lat || !lng) return null;

    return [
      {
        id: `B-${detail?.branchId ?? branchId}`,
        kind: "BRANCH",
        branchId: detail?.branchId ?? Number(branchId),
        name: detail?.branchName ?? "카픽존",
        address: detail?.addressBasic ?? "",
        lat,
        lng,
      },
    ];
  }, [detail, branchId]);

  const openLabel = useMemo(() => {
    return getOpenLabel({
      openStatus: detail?.openStatus,
      openLabel: detail?.openLabel,
      openTime: detail?.openTime,
      closeTime: detail?.closeTime,
    });
  }, [detail]);

  const coverImg = useMemo(() => {
    const s = (detail?.imageUrl ?? "").trim();
    return s ? s : null;
  }, [detail]);

  const onCopyAddress = async () => {
    try {
      const text = detail?.addressBasic ?? "";
      if (!text) return;
      await navigator.clipboard.writeText(text);
      alert("주소가 복사됐어요!");
    } catch {
      alert("복사에 실패했어요. 브라우저 권한을 확인해주세요.");
    }
  };

  const onCall = () => {
    const phone = (detail?.phone ?? "").trim();
    if (!phone) return alert("전화번호 정보가 없어요.");
    window.location.href = `tel:${phone}`;
  };

  const onReserve = () => {
    navigate(`/cars?pickupBranchId=${Number(branchId)}`);
  };
  const handleClickCar = (id) => navigate(`/cars/${id}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[640px] p-5">
          <div className="text-sm text-black/50">지점 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[640px] p-5">
          <div className="text-base font-semibold text-[#111]">지점을 찾을 수 없어요</div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-3 h-11 px-4 rounded-2xl bg-black/5 text-sm font-semibold"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[640px]">
        {/* 상단 지도 (작게) */}
        <div className="relative h-[240px] w-full bg-black/5 overflow-hidden">
          {mapItem ? (
            <ZoneMapKakao
              items={mapItem}
              selectedId={mapItem[0].id}
              onSelect={() => { }}
              onMapClick={() => { }}
              center={{ lat: mapItem[0].lat, lng: mapItem[0].lng, nonce: 1 }}
              showCrowd={false}
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-sm text-black/45">
              지도 좌표 정보가 없어요
            </div>
          )}

          {/* 상단 Back */}
          <div className="absolute top-3 left-3 z-10">
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => navigate(-1)}
              className="w-10 h-10
                          rounded-full
                          bg-white/90
                          flex items-center justify-center
                          shadow-md
                          border border-black/5
                          transition
                          active:scale-95
                          "
            >
              <span className="text-xl leading-none">←</span>
            </button>
          </div>
        </div>

        {/* 카드 컨텐츠 */}
        <div className=" mt-5">

          {/* 타이틀 */}
          <div className="px-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[18px] font-semibold text-[#111] truncate">
                  {detail.branchName}
                </div>
                <div className="mt-1 text-xs font-semibold text-[#0A56FF]">
                  {openLabel}
                </div>
              </div>

              <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold bg-[#0A56FF] text-white">
                카픽존
              </span>
            </div>
          </div>

          {/* 대표 이미지 */}
          <div className="px-5 pb-3">
            <div className="rounded-2xl overflow-hidden border border-black/5 bg-black/10">
              {coverImg ? (
                <img
                  src={coverImg}
                  alt=""
                  className="w-full h-[320px] object-cover"
                />
              ) : (
                <div className="w-full h-[320px]" />
              )}
            </div>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="px-5">
            {/* 주소 */}
            <div className="mt-3">
              <div className="text-base font-semibold text-black">주소</div>

              <div className="mt-1 flex items-start justify-between gap-3">
                <div className="text-sm text-[#111] leading-5 break-words">
                  {detail.addressBasic}
                </div>

                <button
                  type="button"
                  onClick={onCopyAddress}
                  className="h-10 shrink-0 px-3 rounded-2xl bg-black/5 text-xs font-semibold text-[#111]"
                >
                  주소 복사
                </button>
              </div>
            </div>

            {/* 전화 */}
            <div className="mt-4">
              <div className="text-base font-semibold text-black">전화</div>

              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="text-sm text-[#111]">{detail.phone}</div>

                <button
                  type="button"
                  onClick={onCall}
                  className="h-10 shrink-0 px-3 rounded-2xl bg-black/5 text-xs font-semibold text-[#111]"
                >
                  전화
                </button>
              </div>
            </div>

            <div className="py-4">
              <div className="text-base font-semibold text-[#111]">운영 시간</div>

              <div className="mt-3 px-1 grid grid-cols-2 gap-y-2 text-sm">
                {[
                  { label: "평일", key: "weekday" },
                  { label: "토요일", key: "sat" },
                  { label: "일요일", key: "sun" },
                  { label: "공휴일", key: "holiday" },
                ].map((d) => (
                  <div key={d.key} className="contents">
                    <div className="text-black/55">{d.label}</div>
                    <div className="text-right text-black/55">
                      {detail.openTime && detail.closeTime
                        ? `${detail.openTime} ~ ${detail.closeTime}`
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="bg-[#E6F2F0] mt-5 px-5 h-[72px] flex items-center">
            <div className="text-center text-sm font-semibold text-[#0A56FF] w-full">
              더 많은 할인 정보가 궁금하다면?
            </div>
          </div>

          {/* 차량 섹션 */}
          <div className="px-5 pt-8">
            <div className="text-base font-semibold text-[#111] leading-tight">
              <span className="text-[#1D6BF3]">{detail.branchName}</span>
              <span className="block">바로 픽업 차량</span>
            </div>

            {carsLoading ? (
              <div className="mt-3 text-sm text-black/50">차량을 불러오는 중...</div>
            ) : list.length === 0 ? (
              <div className="mt-3 text-sm text-black/50">표시할 차량이 없어요.</div>
            ) : (
              <>
                {/* ✅ 접힘/펼침 슬라이드 */}
                <div
                  className={`
              mt-4 overflow-hidden p-1
              transition-[max-height] duration-300 ease-in-out
              ${expanded ? "max-h-[1200px]" : "max-h-[360px]"}
            `}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {visibleCars.map((car) => {
                      // ✅ FIX: key/id 안전 처리
                      const id = car.specId ?? car.vehicleId ?? car.id;
                      return (
                        <CarCard
                          key={id} // ✅ FIX: car.specId -> id
                          id={id}
                          discountRate={car.discountRate ?? car.discount}
                          imageSrc={
                            car.imgUrl ||
                            "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png"
                          }
                          title={car.displayNameShort}
                          info={{
                            year: car.modelYear,
                            seat: (car.seatingCapacity ?? "") + "인승", // ✅ FIX: null 방어
                          }}
                          features={car.driveLabels}
                          baseTotalAmount={car.baseTotalAmount ?? car.originalPrice ?? 0} // ✅ 핵심
                          price={car.finalPrice ?? 0} // ✅ 핵심
                          day={true}
                          onClick={handleClickCar}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* ✅ 더보기 버튼 */}
                {hasMore && (
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="h-10 px-4 rounded-2xl bg-black/5 text-sm font-semibold text-[#111] flex items-center gap-2"
                    >
                      {expanded ? "접기" : "더보기"}
                      <span
                        className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""
                          }`}
                      >
                        ▼
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>


          {/* 카픽존 이용 안내 */}
          <div className="px-5 py-6 space-y-4">
            <div className="text-base font-semibold text-[#111] leading-tight">
              <span className="text-[#1D6BF3]">카픽존</span>
              <span className="block">이용 안내</span>
            </div>

            {/* STEP 01 */}
            <div className="rounded-xl border border-black/5 p-4">
              <div className="text-xs font-semibold text-black/40 mb-1">
                STEP 01
              </div>
              <p className="text-sm text-black/70 leading-relaxed">
                예약이 확정되면, 선택한 시간에 카픽존으로 방문해주세요.
                카픽은 <b>예약·결제·차량 배정이 모두 사전에 확정</b>되어
                현장에서 조건이 변경되지 않습니다.
              </p>
            </div>

            {/* STEP 02 */}
            <div className="rounded-xl border border-black/5 p-4">
              <div className="text-xs font-semibold text-black/40 mb-1">
                STEP 02
              </div>
              <p className="text-sm text-black/70 leading-relaxed">
                도착 후 안내 데스크에서 예약 정보를 확인하면
                담당 스태프가 차량 위치와 이용 방법을 안내해드립니다.
              </p>
            </div>

            {/* STEP 03 */}
            <div className="rounded-xl border border-black/5 p-4">
              <div className="text-xs font-semibold text-black/40 mb-1">
                STEP 03
              </div>
              <p className="text-sm text-black/70 leading-relaxed">
                차량 상태 확인 후 바로 출발하실 수 있습니다.
                결제 이후 추가 선택이나 비용은 발생하지 않습니다.
              </p>
            </div>

            {/* 유의사항 */}
            <div className="rounded-xl bg-black/[0.03] p-4">
              <div className="text-xs font-semibold text-black/50 mb-1">
                이용 시 유의사항
              </div>
              <ul className="text-sm text-black/55 leading-relaxed list-disc pl-4 space-y-1">
                <li>예약 시간 기준으로 방문해주세요.</li>
                <li>현장 상황에 따라 짧은 대기 시간이 발생할 수 있습니다.</li>
                <li>대기 중에도 예약된 차량과 조건은 그대로 유지됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}

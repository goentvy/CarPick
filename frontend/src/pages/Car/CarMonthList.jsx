import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";

const CarMonthList = () => {
    console.log("✅ RENDER: CarMonthList", window.location.href);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ 가격 로딩 상태(단기와 동일)
    const [priceLoading, setPriceLoading] = useState(false);

    const navigate = useNavigate();
    const routerLocation = useLocation();

    const ensureSeconds = (s) => {
        if (!s) return "";
        if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(s)) return `${s}:00`;
        return s;
    };

    // ✅ 가격 API는 startDate/endDate 키를 받으니, 최종적으로 둘 다 만들어두는 게 안전합니다.
    const normalizedParams = useMemo(() => {
        const raw = Object.fromEntries(new URLSearchParams(routerLocation.search));

        // 1) pickupBranchId 보정
        if (!raw.pickupBranchId && raw.branchId) raw.pickupBranchId = raw.branchId;

        // 2) returnBranchId 기본값
        if (!raw.returnBranchId && raw.pickupBranchId) raw.returnBranchId = raw.pickupBranchId;

        // 3) rentType 보정
        const rentType = raw.rentType ? String(raw.rentType).toUpperCase() : "LONG";

        // 4) 날짜: 어떤 키로 오든 startDate/endDate로 통일 (price API용)
        const startDate = ensureSeconds(raw.startDate || raw.startDateTime || "");
        const endDate = ensureSeconds(raw.endDate || raw.endDateTime || "");

        // 5) months (장기 필수) : 어떤 팀원이 rentMonths로 만들었을 가능성까지 흡수
        const months = raw.months ?? raw.rentMonths ?? "1";

        return {
            pickupBranchId: raw.pickupBranchId ? String(raw.pickupBranchId) : "",
            returnBranchId: raw.returnBranchId ? String(raw.returnBranchId) : "",
            startDate,
            endDate,
            rentType,
            months: String(months),
        };
    }, [routerLocation.search]);

    useEffect(() => {
        if (!normalizedParams.pickupBranchId) {
            console.error("[CarMonthList] pickupBranchId 누락. API 호출 중단", {
                search: routerLocation.search,
                normalizedParams,
            });
            setCars([]);
            setLoading(false);
            return;
        }

        // 장기에서 months 없으면 price가 무조건 터지니, 여기서도 방어
        if (!normalizedParams.months || Number(normalizedParams.months) <= 0) {
            console.warn("[CarMonthList] months 누락/이상. 기본값 1로 보정", normalizedParams);
            normalizedParams.months = "1";
        }

        setLoading(true);
        setPriceLoading(false);

        let cancelled = false;

        const run = async () => {
            try {
                // ✅ 1) 차량 목록 조회 (/api/cars)
                const qs = new URLSearchParams({
                    pickupBranchId: normalizedParams.pickupBranchId,
                    returnBranchId: normalizedParams.returnBranchId,
                    // cars API 쪽은 기존 스펙이 startDateTime/endDateTime 일 수도 있어서,
                    // 현재 백엔드가 startDate/endDate를 받는다면 그대로 쓰고,
                    // startDateTime을 요구한다면 여기 키만 바꾸면 됩니다.
                    // 우선은 선생님이 쓰던 방식대로 startDateTime/endDateTime으로 맞추고 싶으면 아래 두 줄을 바꾸세요.
                    startDateTime: normalizedParams.startDate,
                    endDateTime: normalizedParams.endDate,
                    rentType: normalizedParams.rentType,
                }).toString();

                const carsUrl = `${import.meta.env.VITE_API_BASE_URL}/api/cars?${qs}`;
                console.log("[CarMonthList] GET", carsUrl);

                const carRes = await axios.get(carsUrl);
                if (cancelled) return;

                const carList = carRes.data ?? [];
                setCars(carList);

                // ✅ 2) 가격 조회 준비
                const branchId = normalizedParams.pickupBranchId;
                const startDate = normalizedParams.startDate;
                const endDate = normalizedParams.endDate;
                const rentType = normalizedParams.rentType || "LONG";
                const months = normalizedParams.months;

                if (!branchId || !startDate || !endDate || carList.length === 0) return;

                setPriceLoading(true);

                // ✅ 3) /api/price 호출 + 병합
                const results = await Promise.all(
                    carList.map(async (car) => {
                        const specId = car.specId;
                        if (!specId) return [null, null];

                        try {
                            const priceParams = {
                                specId,
                                branchId,
                                startDate,
                                endDate,
                                rentType,
                                months, // ⭐ 장기 핵심
                            };

                            const resp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/price`, {
                                params: priceParams,
                            });

                            return [specId, resp.data];
                        } catch (e) {
                            console.warn(`[CarMonthList] 가격 조회 실패 (specId: ${specId})`, e);
                            return [specId, null];
                        }
                    })
                );

                if (cancelled) return;

                const priceMap = Object.fromEntries(results.filter(([k, v]) => k != null && v != null));

                setCars((prev) =>
                    prev.map((car) => {
                        const p = priceMap[car.specId];
                        if (!p) return car;

                        const rentMonthsNum = Number(p.months ?? 1);
                        const basePriceNum = Number(p.basePrice ?? 0);
                        const totalNum = Number(p.estimatedTotalAmount ?? 0);

                        // [유지] 정가(취소선) = 단가 * 일수, 최종가 = 총액
                        return {
                            ...car,
                            baseTotalAmount: Number(p.baseTotalAmount ?? 0),  // ✅ 추가
                            finalPrice: Number(p.estimatedTotalAmount ?? 0),
                            discountRate: p.discountRate ?? 0,
                        };
                    })
                );
            } catch (err) {
                console.error("[CarMonthList] 로딩 치명적 오류:", err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setPriceLoading(false);
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalizedParams, routerLocation.search]);

    const handleClickCar = (specId) => {
        navigate(`/cars/detail/${specId}${routerLocation.search}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            <RentHeader type="long" location="month" />

            {priceLoading && cars.length > 0 && (
                <p className="max-w-[90%] w-full mx-auto mt-2 text-sm text-gray-400">
                    가격 계산 중...
                </p>
            )}

            {cars.length === 0 ? (
                <div className="text-center min-h-[200px] mt-20 space-y-4">
                    <img src="/images/common/filterNull.svg" className="mx-auto" alt="차량 없음" />
                    <h3 className="text-[24px] font-bold mb-[8px]">조건에 맞는 차량이 없습니다.</h3>
                    <p className="text-[16px] text-gray-400 font-medium">대여 지점/기간을 다시 확인해 주세요.</p>
                </div>
            ) : (
                <div className="mt-4 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {cars.map((car) => (
                        <CarCard
                            key={car.specId}
                            id={car.specId}
                            title={car.displayNameShort}
                            info={{ year: car.modelYear, seat: `${car.seatingCapacity}인승` }}
                            baseTotalAmount={car.baseTotalAmount}  // 변경: cost → baseTotalAmount
                            price={car.finalPrice}
                            discountRate={car.discountRate}        // 추가
                            discount={car.discountRate > 0}        //  추가
                            day={false}
                            imageSrc={
                                car.imgUrl ||
                                car.mainImageUrl ||
                                "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png"
                            }
                            onClick={() => handleClickCar(car.specId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarMonthList;

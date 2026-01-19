import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from "../../components/common/PickupFilterModal";

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // [추가] 가격 로딩 상태 분리 (차 목록은 떠도, 가격만 늦게 올 수 있으므로)
    const [priceLoading, setPriceLoading] = useState(false);

    const navigate = useNavigate();
    const routerLocation = useLocation();
    const [ShowFilter, setShowFilter] = useState(false);

    // 필터 상태
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState([]);

    const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
    const [priceRange, setPriceRange] = useState([10000, 1000000]);

    const handleApplyFilter = (level, fuel, person) => {
        setSelectedLevel(level);
        setSelectedFuel(fuel);
        setSelectedPerson(person);
        setShowFilter(false);
    };

    const handleResetFilter = () => {
        setSelectedLevel([]);
        setSelectedFuel([]);
        setSelectedPerson([]);
        setYearRange([2010, new Date().getFullYear()]);
        setPriceRange([10000, 1000000]);
    };

    useEffect(() => {
        const params = Object.fromEntries(new URLSearchParams(routerLocation.search));

        // [기존] pickupBranchId 보정 (MVP 임시)
        if (!params.pickupBranchId && params.branchId) params.pickupBranchId = params.branchId;

        // [기존] returnBranchId 기본값
        if (!params.returnBranchId && params.pickupBranchId) params.returnBranchId = params.pickupBranchId;

        // [기존] rentType 보정 (SHORT/LONG)
        if (params.rentType) params.rentType = String(params.rentType).toUpperCase();
        else params.rentType = "SHORT";

        // [기존] 필수값 없으면 중단
        if (!params.pickupBranchId) {
            console.error("[CarList] pickupBranchId 누락. API 호출 중단", params);
            setLoading(false);
            return;
        }

        // [추가] 날짜 누락 시 price 호출 스킵 로그 (디버깅 편의)
        if (!params.startDate || !params.endDate) {
            console.warn("[CarList] startDate/endDate 누락. price 호출 스킵", params);
        }

        setLoading(true);
        setPriceLoading(false);

        let cancelled = false;

        // [수정] 초 단위 보정 로직 강화 (HH:mm / T 포함 케이스 대응)
        const ensureSeconds = (s) => {
            if (!s) return "";
            // "yyyy-MM-dd HH:mm" 또는 "yyyy-MM-ddTHH:mm" 형태면 초 붙이기
            if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(s)) return `${s}:00`;
            return s;
        };

        const run = async () => {
            try {
                // [2] 차량 목록 조회
                console.log("[CarList] GET /api/cars params =", params);
                const carRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`, { params });

                if (cancelled) return;

                const carList = carRes.data ?? [];
                setCars(carList); // 목록 먼저 보여주기

                // [3] 가격 조회 준비
                const branchId = params.pickupBranchId;
                const startDate = ensureSeconds(params.startDate);
                const endDate = ensureSeconds(params.endDate);
                const rentType = params.rentType || "SHORT";

                // [기존] 필수값 없으면 price 호출 생략
                if (!branchId || !startDate || !endDate || carList.length === 0) {
                    return;
                }

                // [추가] 가격 로딩 시작
                setPriceLoading(true);

                // [4] 가격 조회 (개별 실패 허용)
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
                                // couponCode, rentMonths 등은 필요 없으면 제외
                            };

                            const resp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/price`, {
                                params: priceParams,
                            });

                            return [specId, resp.data];
                        } catch (e) {
                            console.warn(`[CarList] 가격 조회 실패 (specId: ${specId})`, e);
                            return [specId, null];
                        }
                    })
                );

                if (cancelled) return;

                // [5] 가격 데이터 병합
                const priceMap = Object.fromEntries(results.filter(([k, v]) => k != null && v != null));

                setCars((prev) =>
                    prev.map((car) => {
                        const p = priceMap[car.specId];

                        // 가격 정보가 없으면 기존 데이터 유지
                        if (!p) return car;

                        const rentDaysNum = Number(p.rentDays ?? 1);
                        const basePriceNum = Number(p.basePrice ?? 0);
                        const totalNum = Number(p.estimatedTotalAmount ?? 0);

                        // [유지] 정가(취소선) = 단가 * 일수, 최종가 = 총액
                        return {
                            ...car,
                            originalPrice: basePriceNum * rentDaysNum,
                            finalPrice: totalNum,
                            discountRate: p.discountRate ?? 0,
                        };
                    })
                );
            } catch (err) {
                console.error("차량 리스트 로딩 치명적 오류:", err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setPriceLoading(false); // [추가] priceLoading 종료
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [routerLocation.search]);

    const handleClickCar = (specId) => {
        navigate(`/cars/detail/${specId}${routerLocation.search}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            <RentHeader type="short" location="day" />

            <div className="overflow-x-auto max-w-[90%] w-full mx-auto">
                <div className="w-max flex items-center whitespace-nowrap">
                    <button
                        className="btn flex items-center rounded-[50px] px-4 py-1.5 cursor-pointer font-bold bg-blue-50 mt-[14px] max-w-[150px]"
                        onClick={() => setShowFilter((prev) => !prev)}
                    >
                        <img src="/images/common/car_filter-solid.svg" className="pr-2" />
                        필터
                    </button>

                    <div className="keyword flex flex-wrap gap-2 mt-[14px] ml-2">
                        {[...selectedLevel, ...selectedFuel, ...selectedPerson].map((item) => (
                            <span key={item} className="bg-blue-50 px-4 py-1.5 rounded-full font-bold">
                                {item}
                            </span>
                        ))}
                    </div>

                    {ShowFilter && (
                        <PickupFilterModal
                            onClose={() => setShowFilter(false)}
                            selectedLevel={selectedLevel}
                            setSelectedLevel={setSelectedLevel}
                            selectedFuel={selectedFuel}
                            setSelectedFuel={setSelectedFuel}
                            selectedPerson={selectedPerson}
                            setSelectedPerson={setSelectedPerson}
                            yearRange={yearRange}
                            setYearRange={setYearRange}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            onApply={handleApplyFilter}
                            onReset={handleResetFilter}
                        />
                    )}
                </div>
            </div>

            <div className="max-w-[90%] w-full flex justify-between items-center mx-auto mt-[30px]">
                <h4 className="font-bold">총 <span>{cars.length}</span>대</h4>
                <select className="bg-blue-50 px-2 py-1 rounded-[50px] font-bold">
                    <option>AI추천순</option>
                    <option>낮은가격순</option>
                    <option>차종류순</option>
                    <option>신차순</option>
                </select>
            </div>

            {/* [추가] 차는 떴는데 가격만 계산 중인 경우 안내 */}
            {priceLoading && cars.length > 0 && (
                <p className="max-w-[90%] w-full mx-auto mt-2 text-sm text-gray-400">
                    가격 계산 중...
                </p>
            )}

            {cars.length === 0 ? (
                <div className="text-center min-h-[200px] mt-20 space-y-4">
                    <img src="/images/common/filterNull.svg" className="mx-auto" alt="차량 없음" />
                    <h3 className="text-[24px] font-bold mb-[8px]">필터 조건에서는 함께 떠날 차를 찾지 못했어요.</h3>
                    <p className="text-[20px] text-gray-400 font-medium mb-[42px]">필터를 조금만 넓히면 더 빠르게 픽할 수 있어요.</p>
                    <button
                        type="button"
                        className="bg-blue-50 px-4 py-2 rounded-[50px] border border-blue-500 font-bold"
                        onClick={handleResetFilter}
                    >
                        필터 초기화
                    </button>
                </div>
            ) : (
                <div className="xx:p-2 sm:p-6 flex xx:flex-col xs:flex-row justify-between gap-2 flex-wrap">
                    {cars.map((car) => (
                        <div key={car.specId} className="w-full sm:w-[49%]">
                            <CarCard
                                id={car.specId}
                                // [수정] 할인 표시 조건은 > 0으로 (0이어도 배지 뜨는 문제 방지)
                                discount={Number(car.discountRate) > 0}
                                discountRate={Number(car.discountRate) || 0}
                                imageSrc={
                                    car.imgUrl || "https://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png"
                                }
                                title={car.displayNameShort}
                                info={{
                                    year: car.modelYear,
                                    seat: car.seatingCapacity + "인승",
                                }}
                                features={car.driveLabels}
                                cost={car.originalPrice}
                                price={car.finalPrice}
                                day={true}
                                onClick={handleClickCar}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarList;

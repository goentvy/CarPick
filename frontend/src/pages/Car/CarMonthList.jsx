import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from "../../components/common/PickupFilterModal";

import { getBranches } from "@/services/zoneApi";
import { filterCars } from "@/utils/carFilter";

const CarMonthList = () => {
    console.log("✅ RENDER: CarMonthList", window.location.href);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ 가격 로딩 상태(단기와 동일)
    const [priceLoading, setPriceLoading] = useState(false);

    const navigate = useNavigate();
    const routerLocation = useLocation();

    // ✅ 지점 목록 (단기와 동일하게)
    const [branches, setBranches] = useState([]);

    // ✅ 필터 모달
    const [ShowFilter, setShowFilter] = useState(false);

    // ✅ 필터 상태 (단기와 동일)
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState([]);
    const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
    const [priceRange, setPriceRange] = useState([10000, 1000000]);

    // ✅ 정렬 상태
    const [sortKey, setSortKey] = useState(""); // "", PRICE_ASC, TYPE, NEW

    const handleApplyFilter = (f) => {
        setSelectedLevel(f.selectedLevel ?? []);
        setSelectedFuel(f.selectedFuel ?? []);
        setSelectedPerson(f.selectedPerson ?? []);
        setYearRange(f.yearRange ?? [2010, new Date().getFullYear()]);
        setPriceRange(f.priceRange ?? [10000, 1000000]);
        setShowFilter(false);
    };

    const handleResetFilter = () => {
        setSelectedLevel([]);
        setSelectedFuel([]);
        setSelectedPerson([]);
        setYearRange([2010, new Date().getFullYear()]);
        setPriceRange([10000, 1000000]);
        setSortKey("");
    };

    // ✅ 필터 객체 & 결과 (단기와 동일)
    const filters = useMemo(
        () => ({
            selectedLevel,
            selectedFuel,
            selectedPerson,
            yearRange,
            priceRange,
        }),
        [selectedLevel, selectedFuel, selectedPerson, yearRange, priceRange]
    );

    const filteredCars = useMemo(() => filterCars(cars, filters), [cars, filters]);

    // ✅ 필터 + 정렬 결과
    const displayCars = useMemo(() => {
        const arr = [...filteredCars];

        switch (sortKey) {
            case "PRICE_ASC": {
                arr.sort((a, b) => {
                    const ap = a.finalPrice ?? Number.POSITIVE_INFINITY;
                    const bp = b.finalPrice ?? Number.POSITIVE_INFINITY;
                    return ap - bp;
                });
                break;
            }
            case "NEW": {
                arr.sort((a, b) => (b.modelYear ?? 0) - (a.modelYear ?? 0));
                break;
            }
            case "TYPE": {
                arr.sort((a, b) => {
                    const ac = (a.carClass ?? "").toString();
                    const bc = (b.carClass ?? "").toString();
                    if (ac !== bc) return ac.localeCompare(bc);
                    return (a.displayNameShort ?? "").localeCompare(b.displayNameShort ?? "");
                });
                break;
            }
            default:
                // 정렬 없음
                break;
        }

        return arr;
    }, [filteredCars, sortKey]);

    const ensureSeconds = (s) => {
        if (!s) return "";
        if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(s)) return `${s}:00`;
        return s;
    };

    // ✅ price API는 startDate/endDate 키를 받으니, 최종적으로 둘 다 만들어두는 게 안전합니다.
    const normalizedParams = useMemo(() => {
        const raw = Object.fromEntries(new URLSearchParams(routerLocation.search));

        // 1) pickupBranchId 보정
        if (!raw.pickupBranchId && raw.branchId) raw.pickupBranchId = raw.branchId;

        // 2) rentType 보정
        const rentType = raw.rentType ? String(raw.rentType).toUpperCase() : "LONG";

        // 3) 날짜 키 통일
        const startDate = ensureSeconds(raw.startDate || raw.startDateTime || "");
        const endDate = ensureSeconds(raw.endDate || raw.endDateTime || "");

        // 4) months 보정
        const months = raw.months ?? raw.rentMonths ?? "1";

        return {
            pickupBranchId: raw.pickupBranchId ? String(raw.pickupBranchId) : "",
            startDate,
            endDate,
            rentType,
            months: String(months),
        };
    }, [routerLocation.search]);

    // ✅ 지점 목록 로드 (단기와 동일)
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await getBranches();
                if (!alive) return;
                setBranches(res.data ?? []);
            } catch (e) {
                console.error("[CarMonthList] getBranches fail", e);
                if (!alive) return;
                setBranches([]);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        // ✅ 필수값 체크 (백엔드가 pickupBranchId required)
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

        // 장기에서 months 없으면 price가 무조건 터지니 방어
        const safeMonths = !normalizedParams.months || Number(normalizedParams.months) <= 0
            ? "1"
            : normalizedParams.months;

        setLoading(true);

        // ✅ 가장 확실한 방식: URL에 쿼리를 직접 붙여서 요청 (params 누락 문제를 원천 차단)
        const qs = new URLSearchParams(normalizedParams).toString();
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/cars?${qs}`;

        console.log("[CarMonthList] GET", url);

        let cancelled = false;

        const run = async () => {
            try {
                // 1) 차량 목록 조회 (/api/cars)
                const qs = new URLSearchParams({
                    pickupBranchId: normalizedParams.pickupBranchId,
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

                // 2) 가격 조회 준비
                const branchId = normalizedParams.pickupBranchId;
                const startDate = normalizedParams.startDate;
                const endDate = normalizedParams.endDate;
                const rentType = normalizedParams.rentType || "LONG";
                const months = safeMonths;

                if (!branchId || !startDate || !endDate || carList.length === 0) return;

                setPriceLoading(true);

                // 3) /api/price 호출 + 병합
                const results = await Promise.all(
                    carList.map(async (car) => {
                        const specId = car.specId;
                        if (!specId) return [null, null];

                        try {
                            const priceParams = { specId, branchId, startDate, endDate, rentType, months };
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

                        return {
                            ...car,
                            baseTotalAmount: Number(p.baseTotalAmount ?? 0),
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
            {/* ✅ RentHeader에 branches 넣고 싶으면 아래처럼 */}
            <RentHeader type="long" location="month" branches={branches} />

            {/* ✅ 필터 버튼 + 키워드 칩 (단기와 동일) */}
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

            {/* ✅ 총 대수 + 정렬 (단기와 동일) */}
            <div className="max-w-[90%] w-full flex justify-between items-center mx-auto mt-[30px]">
                <h4 className="font-bold">
                    총 <span>{displayCars.length}</span>대
                </h4>

                <select
                    className="bg-blue-50 px-2 py-1 rounded-[50px] font-bold"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                >
                    <option value="NEW">신차순</option>
                    <option value="PRICE_ASC">낮은가격순</option>
                    <option value="TYPE">차종류순</option>
                </select>
            </div>

            {priceLoading && cars.length > 0 && (
                <p className="max-w-[90%] w-full mx-auto mt-2 text-sm text-gray-400">
                    가격 계산 중...
                </p>
            )}

            {displayCars.length === 0 ? (
                <div className="text-center min-h-[200px] mt-20 space-y-4">
                    <img src="/images/common/filterNull.svg" className="mx-auto" alt="차량 없음" />
                    <h3 className="text-[24px] font-bold mb-[8px]">
                        필터 조건에서는 함께 떠날 차를 찾지 못했어요.
                    </h3>
                    <p className="text-[20px] text-gray-400 font-medium mb-[42px]">
                        필터를 조금만 넓히면 더 빠르게 픽할 수 있어요.
                    </p>
                    <button
                        type="button"
                        className="bg-blue-50 px-4 py-2 rounded-[50px] border border-blue-500 font-bold"
                        onClick={handleResetFilter}
                    >
                        필터 초기화
                    </button>
                </div>
            ) : (
                <div className="mt-4 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {displayCars.map((car) => (
                        <CarCard
                            key={car.specId}
                            id={car.specId}
                            title={car.displayNameShort}
                            info={{ year: car.modelYear, seat: `${car.seatingCapacity}인승` }}
                            baseTotalAmount={car.baseTotalAmount}
                            price={car.finalPrice}
                            discountRate={car.discountRate || 0}
                            discount={(car.discountRate || 0) > 0}
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
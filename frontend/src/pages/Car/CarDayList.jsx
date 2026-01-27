import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from "../../components/common/PickupFilterModal";
import { getBranches } from "@/services/zoneApi";
import { filterCars } from "@/utils/carFilter";

// ✅ 백이 원하는 포맷: "yyyy-MM-dd HH:mm:ss"
const pad2 = (n) => String(n).padStart(2, "0");
const toBackendDateTime = (v) => {
    if (!v) return "";
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v)) return v;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v)) return `${v}:00`;

    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";

    const yyyy = d.getFullYear();
    const MM = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const HH = pad2(d.getHours());
    const mm = pad2(d.getMinutes());
    const ss = pad2(d.getSeconds());
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
};

const CarDayList = () => {
    console.log("✅ RENDER: CarDayList", window.location.href);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceLoading, setPriceLoading] = useState(false);

    const navigate = useNavigate();
    const routerLocation = useLocation();
    const query = new URLSearchParams(routerLocation.search);

    const [branches, setBranches] = useState([]);
    const type = query.get("rentType");
    const [ShowFilter, setShowFilter] = useState(false);

    // ✅ 필터 상태
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState([]);
    const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
    const [priceRange, setPriceRange] = useState([10000, 1000000]);

    // ✅ 정렬 상태 (AI추천순 제거, 기본은 정렬 없음)
    const [sortKey, setSortKey] = useState(""); // "", PRICE_ASC, TYPE, NEW

    // ✅ 모달 Apply: 객체 받기
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
        setSortKey(""); // ✅ 초기화 시 정렬도 원복(원하면 제거 가능)
    };

    // ✅ 필터 객체 & 결과
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

    // ✅ 필터 + 정렬 결과 (화면은 displayCars로 렌더링)
    const displayCars = useMemo(() => {
        const arr = [...filteredCars];

        switch (sortKey) {
            case "PRICE_ASC": {
                // 낮은가격순 (가격 없는 건 뒤로)
                arr.sort((a, b) => {
                    const ap = a.finalPrice ?? Number.POSITIVE_INFINITY;
                    const bp = b.finalPrice ?? Number.POSITIVE_INFINITY;
                    return ap - bp;
                });
                break;
            }
            case "NEW": {
                // 신차순 (연식 내림차순)
                arr.sort((a, b) => (b.modelYear ?? 0) - (a.modelYear ?? 0));
                break;
            }
            case "TYPE": {
                // 차종류순 (carClass → 이름)
                arr.sort((a, b) => {
                    const ac = (a.carClass ?? "").toString();
                    const bc = (b.carClass ?? "").toString();
                    if (ac !== bc) return ac.localeCompare(bc);
                    return (a.displayNameShort ?? "").localeCompare(b.displayNameShort ?? "");
                });
                break;
            }
            default:
                // 정렬 없음: 원래 순서 유지
                break;
        }

        return arr;
    }, [filteredCars, sortKey]);

    // ✅ 브랜치 기본값 주입 (pickupBranchId 없으면 1)
    useEffect(() => {
        const params = new URLSearchParams(routerLocation.search);

        if (!params.get("pickupBranchId")) {
            params.set("pickupBranchId", "1");
            if (!params.get("rentType")) params.set("rentType", "SHORT");

            const pad = (n) => String(n).padStart(2, "0");
            const fmt = (d) =>
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
                `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

            if (!params.get("startDate") && !params.get("startDateTime")) {
                params.set("startDate", fmt(new Date()));
            }
            if (!params.get("endDate") && !params.get("endDateTime")) {
                params.set("endDate", fmt(new Date(Date.now() + 24 * 60 * 60 * 1000)));
            }

            navigate(`${routerLocation.pathname}?${params.toString()}`, { replace: true });
        }
    }, [routerLocation.pathname, routerLocation.search, navigate]);

    // ✅ 지점 목록 로드
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await getBranches();
                if (!alive) return;
                setBranches(res.data ?? []);
            } catch (e) {
                console.error("[CarDayList] getBranches fail", e);
                if (!alive) return;
                setBranches([]);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    // ✅ cars + price 로딩
    useEffect(() => {
        const params = Object.fromEntries(new URLSearchParams(routerLocation.search));

        if (!params.pickupBranchId && params.branchId) params.pickupBranchId = params.branchId;


        params.rentType = params.rentType ? String(params.rentType).toUpperCase() : "SHORT";

        if (!params.pickupBranchId) {
            console.error("[CarDayList] pickupBranchId 누락. API 호출 중단", params);
            setLoading(false);
            return;
        }

        setLoading(true);
        setPriceLoading(false);

        let cancelled = false;

        const run = async () => {
            try {
                // ✅ cars API는 기존대로 보내도 됨 (백에서 startDateTime/endDateTime optional)
                console.log("[CarList] GET /api/cars params =", params);
                const carRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`, { params });

                if (cancelled) return;

                const carList = carRes.data ?? [];
                setCars(carList);

                // ✅ price API
                const branchId = params.pickupBranchId;
                const startDateRaw = params.startDateTime || params.startDate;
                const endDateRaw = params.endDateTime || params.endDate;

                const startDate = toBackendDateTime(startDateRaw);
                const endDate = toBackendDateTime(endDateRaw);
                const rentType = params.rentType || "SHORT";

                if (!branchId || !startDate || !endDate || carList.length === 0) return;

                setPriceLoading(true);

                const results = await Promise.all(
                    carList.map(async (car) => {
                        const specId = car.specId;
                        if (!specId) return [null, null];

                        try {
                            const priceParams = { specId, branchId, startDate, endDate, rentType };

                            const resp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/price`, {
                                params: priceParams,
                            });

                            return [specId, resp.data];
                        } catch (e) {
                            console.warn(`[CarDayList] 가격 조회 실패 (specId: ${specId})`, e);
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
                console.error("차량 리스트 로딩 치명적 오류:", err);
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
    }, [routerLocation.search]);

    const handleClickCar = (specId) => {
        navigate(`/cars/detail/${specId}${routerLocation.search}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            <RentHeader type={type} location="day" branches={branches} />

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
                <h4 className="font-bold">
                    총 <span>{displayCars.length}</span>대
                </h4>

                {/* ✅ 정렬 동작 */}
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
                <p className="max-w-[90%] w-full mx-auto mt-2 text-sm text-gray-400">가격 계산 중...</p>
            )}

            {displayCars.length === 0 ? (
                <div className="text-center min-h-[200px] mt-20 space-y-4">
                    <img src="/images/common/filterNull.svg" className="mx-auto" alt="차량 없음" />
                    <h3 className="text-[24px] font-bold mb-[8px]">필터 조건에서는 함께 떠날 차를 찾지 못했어요.</h3>
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
                            discount={car.discountRate > 0}
                            discountRate={car.discountRate || 0}
                            imageSrc={car.imgUrl || "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png"}
                            title={car.displayNameShort}
                            info={{ year: car.modelYear, seat: car.seatingCapacity + "인승" }}
                            features={car.driveLabels}
                            baseTotalAmount={car.baseTotalAmount}
                            price={car.finalPrice}
                            day={true}
                            onClick={handleClickCar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarDayList;

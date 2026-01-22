import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from "../../components/common/PickupFilterModal";

const CarMonthList = () => {
    console.log("✅ RENDER: CarMonthList", window.location.href);

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const routerLocation = useLocation();

    // ✅ 날짜 포맷 보정: "yyyy-MM-dd HH:mm" 또는 "yyyy-MM-ddTHH:mm" => 초 붙이기
    const ensureSeconds = (s) => {
        if (!s) return "";
        if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(s)) return `${s}:00`;
        return s;
    };

    // ✅ 서버에 보낼 params를 "정규화" 해서 만들기 (불필요 키 제거 + 키 이름 맞추기)
    const normalizedParams = useMemo(() => {
        const raw = Object.fromEntries(new URLSearchParams(routerLocation.search));

        // 1) pickupBranchId 보정
        if (!raw.pickupBranchId && raw.branchId) raw.pickupBranchId = raw.branchId;

        // 2) returnBranchId 기본값
        if (!raw.returnBranchId && raw.pickupBranchId) raw.returnBranchId = raw.pickupBranchId;

        // 3) rentType 보정 (Swagger: SHORT, LONG)
        const rentType = raw.rentType ? String(raw.rentType).toUpperCase() : "LONG";

        // 4) 날짜 키 변환 (Swagger: startDateTime/endDateTime)
        const startDateTime = ensureSeconds(raw.startDateTime || raw.startDate || "");
        const endDateTime = ensureSeconds(raw.endDateTime || raw.endDate || "");

        // 5) 서버가 요구하는 키만 보내기 (pickupBranchId는 필수)
        const params = {
            pickupBranchId: raw.pickupBranchId ? String(raw.pickupBranchId) : "",
            returnBranchId: raw.returnBranchId ? String(raw.returnBranchId) : "",
            startDateTime,
            endDateTime,
            rentType,
        };

        return params;
    }, [routerLocation.search]);

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

        setLoading(true);

        // ✅ 가장 확실한 방식: URL에 쿼리를 직접 붙여서 요청 (params 누락 문제를 원천 차단)
        const qs = new URLSearchParams(normalizedParams).toString();
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/cars?${qs}`;

        console.log("[CarMonthList] GET", url);

        let cancelled = false;

        axios
            .get(url)
            .then((res) => {
                if (cancelled) return;
                setCars(res.data ?? []);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("[CarMonthList] 차량 리스트 불러오기 실패:", err);
                setCars([]);
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [normalizedParams, routerLocation.search]);

    const handleClickCar = (specId) => {
        // ✅ 단기처럼 쿼리 유지해서 상세로 넘김 (branch/time 컨텍스트 유지)
        navigate(`/cars/detail/${specId}${routerLocation.search}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            <RentHeader type="long" location="month" />

            {cars.length === 0 ? (
                <div className="text-center min-h-[200px] mt-20 space-y-4">
                    <img src="/images/common/filterNull.svg" className="mx-auto" alt="차량 없음" />
                    <h3 className="text-[24px] font-bold mb-[8px]">
                        필터 조건에서는 함께 떠날 차를 찾지 못했어요.
                    </h3>
                    <p className="text-[16px] text-gray-400 font-medium">
                        대여 지점/기간을 다시 확인해 주세요.
                    </p>
                </div>
            ) : (
                <div className="mt-4 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {cars.map((car) => (
                        <CarCard
                            key={car.specId}
                            id={car.specId}
                            title={car.displayNameShort}
                            info={{ year: car.modelYear, seat: `${car.seatingCapacity}인승` }}
                            features={car.driveLabels}
                            cost={car.originalPrice}
                            price={car.finalPrice}
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

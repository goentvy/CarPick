import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from '../../components/common/PickupFilterModal';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const routerLocation = useLocation(); // ✅ 현재 /day?... 쿼리 가져오기
    const [ShowFilter, setShowFilter] = useState(false);

    // 필터 상태
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState([]);

    const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
    const [priceRange, setPriceRange] = useState([10000, 1000000]);

    // 필터 적용 시 호출
    const handleApplyFilter = (level, fuel, person) => {
        setSelectedLevel(level);
        setSelectedFuel(fuel);
        setSelectedPerson(person);
        setShowFilter(false); // 모달 닫기
    };

    // 필터 초기화
    const handleResetFilter = () => {
        setSelectedLevel([]);
        setSelectedFuel([]);
        setSelectedPerson([]);
        setYearRange([2010, new Date().getFullYear()]);
        setPriceRange([10000, 1000000]);
    };
    console.log("CarList search =", routerLocation.search);
    useEffect(() => {
        // ✅ 수정: search가 바뀌면 재호출 (지점/날짜 변경 시 반영)
        // ✅ 수정: URL 뒤에 문자열로 붙이지 말고 params로 전달(가장 안전)
        const params = Object.fromEntries(new URLSearchParams(routerLocation.search));

        // ✅ 수정: pickupBranchId가 없고 branchId만 있으면 보정 (MVP 임시)
        if (!params.pickupBranchId && params.branchId) {
            params.pickupBranchId = params.branchId;
        }

        // ✅ 수정: returnBranchId가 없으면 pickupBranchId로 보정(왕복 동일 지점 기본)
        if (!params.returnBranchId && params.pickupBranchId) {
            params.returnBranchId = params.pickupBranchId;
        }

        // ✅ 수정: rentType 소문자 -> 대문자 (SHORT/LONG)
        if (params.rentType) {
            params.rentType = String(params.rentType).toUpperCase();
        } else {
            params.rentType = "SHORT";
        }
        // ✅ 수정: pickupBranchId가 없으면 백엔드에서 400 나므로 호출 중단
        if (!params.pickupBranchId) {
            console.error("[CarList] pickupBranchId가 없어 /api/cars 호출을 중단합니다.", params);
            setLoading(false);
            return;
        }

        setLoading(true);

        // ✅ 수정: 요청 URL/파라미터 로깅 (Network 보기 전에 여기서도 확인 가능)
        console.log("[CarList] GET /api/cars params =", params);

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/cars`, { params })
            .then((res) => {
                setCars(res.data);
            })
            .catch((err) => {
                // ✅ 수정: 왜 실패인지 바로 보이게
                console.error("차량 리스트 불러오기 실패:", {
                    message: err.message,
                    status: err.response?.status,
                    data: err.response?.data,
                    params
                });
            })
            .finally(() => setLoading(false));
    }, [routerLocation.search]); // ✅ 수정: [] -> [routerLocation.search]



    const handleClickCar = (specId) => {

        navigate(`/cars/detail/${specId}${routerLocation.search}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            {/* 대여장소, 일정 검색 */}
            <RentHeader type="short" location="day" />

            {/* 필터 버튼 */}
            <div className="overflow-x-auto max-w-[90%] w-full mx-auto">
                <div className="w-max flex items-center whitespace-nowrap">
                    <button
                        className="btn flex items-center rounded-[50px] px-4 py-1.5 cursor-pointer font-bold bg-blue-50 mt-[14px] max-w-[150px]"
                        onClick={() => setShowFilter((prev) => !prev)}
                    >
                        <img src="/images/common/car_filter-solid.svg" className="pr-2" />필터
                    </button>

                    <div className="keyword flex flex-wrap gap-2 mt-[14px] ml-2">
                        {[
                            ...selectedLevel,
                            ...selectedFuel,
                            ...selectedPerson
                        ].map((item) => (
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

            {/* 차량수 */}
            <div className="max-w-[90%] w-full flex justify-between items-center mx-auto mt-[30px]">
                <h4 className="font-bold">총 <span>{cars.length}</span>대</h4>
                <select className="bg-blue-50 px-2 py-1 rounded-[50px] font-bold">
                    <option>AI추천순</option>
                    <option>낮은가격순</option>
                    <option>차종류순</option>
                    <option>신차순</option>
                </select>
            </div>

            {/* 차량목록 */}
            {cars.length === 0 ? (
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
                <div className="xx:p-2 sm:p-6 flex xx:flex-col xs:flex-row justify-between gap-2 flex-wrap">
                    {cars.map((car) => (
                        <div key={car.specId} className="w-full sm:w-[49%]">
                            <CarCard
                                id={car.specId}
                                discount={car.discountRate !== null}
                                discountRate={car.discountRate || 0}
                                imageSrc={car.mainImageUrl || "/images/common/carList.png"}
                                title={car.displayNameShort}
                                info={{
                                    year: car.modelYear,
                                    seat: car.seatingCapacity + "인승",
                                }}
                                features={car.driveLabels} // "가솔린,SUV,패밀리카"
                                cost={car.originalPrice}
                                price={car.finalPrice}
                                day={true} // 단기면 true, 장기면 false
                                onClick={() => handleClickCar(car.specId)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default CarList;
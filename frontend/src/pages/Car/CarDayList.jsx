import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import RentHeader from "./RentHeader";
import CarCard from "./CarCard";
import PickupFilterModal from '../../components/common/PickupFilterModal';

const CarList = () => {
    const [ShowFilter, setShowFilter] = useState(false);

    // 필터 상태
    const [selectedLevel, setSelectedLevel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState([]);

    const [yearRange, setYearRange] = useState([2010, new Date().getFullYear()]);
    const [priceRange, setPriceRange] = useState([10000, 1000000]);

    const navigate = useNavigate();

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

    const features = {
        option: ['가솔린','경차', '도심 주행']
    };
    const info = {
        year: "2020년식",
        seats: "4인승",
        fuel: "휘발유",
        age: "만 26세 이상",
    };

     const handleClickCar = (id) => {
        navigate(`/car/detail/${id}`);
    };


    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[59px] mx-auto">
            {/* 대여장소, 일정 검색 */}
            <RentHeader />

            {/* 필터 버튼 */}
            <div className="overflow-x-auto max-w-[90%] w-full m-auto">
                <div className="w-max flex items-center whitespace-nowrap">
                    <button 
                    className="btn flex items-center rounded-[50px] px-4 py-1.5 cursor-pointer font-bold bg-blue-50 mt-[14px] max-w-[150px]"
                    onClick={() => setShowFilter((prev) => !prev)}
                    >
                    <img src="/images/common/car_filter-solid.svg" className="pr-2"/>필터
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
            <div className="max-w-[90%] w-full flex justify-between items-center m-auto mt-[30px]">
                <h4 className="font-bold">총 <span>13</span>대</h4>
                <select className="bg-blue-50 px-2 py-1 rounded-[50px] font-bold">
                    <option>AI추천순</option>
                    <option>낮은가격순</option>
                    <option>차종류순</option>
                    <option>신차순</option>
                </select>
            </div>

            {/* 차량목록 */}
            <div className="xx:p-2 sm:p-6">
                <div className="flex gap-2">
                    <CarCard
                        discount={true}
                        discountRate={30}
                        imageSrc="/images/common/carList.png"
                        title="Carnival High- Limousine"
                        info={info}
                        features={features}
                        cost={190000}
                        price={128000}
                        day={true} /* 단기면 true, 장기면 false */
                        onClick={() => handleClickCar(1)}
                    />
                </div>
                <div className="flex gap-2">
                    <CarCard
                        discount={true}
                        discountRate={50}
                        imageSrc="/images/common/carList.png"
                        title="Carnival High- Limousine"
                        features={features}
                        info={info}
                        cost={190000}
                        price={128000}
                        day={true} /* 단기면 true, 장기면 false */
                        onClick={() => handleClickCar(2)}
                    />
                </div>
            </div>
        </div>
    );
};
export default CarList;
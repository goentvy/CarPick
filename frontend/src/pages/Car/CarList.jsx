import RentHeader from "./RentHeader";
import CarCard from "./CarCard";

const CarList = () => {
    const features = {
        title: '가족여행에 최적화 된 공간',
        option: ['유아 카시트 2개', '넓은 트렁크']
    };
    const info = {
        year: "2020년식",
        seats: "4인승",
        fuel: "휘발유",
        age: "만 26세 이상",
    };


    return (
        <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-white pb-10 mt-[60px] mx-auto">
             {/* 대여장소, 일정 검색 */}
            <RentHeader />

            {/* 차량목록 */}
            <div className="xx:p-2 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <CarCard
                        discount={true}
                        imageSrc="/images/common/car.png"
                        title="Carnival High- Limousine"
                        features={features}
                        price={128000}
                    />
                    <CarCard
                        discount={false}
                        imageSrc="/images/common/car.png"
                        title="Carnival High- Limousine"
                        features={features}
                        price={128000}
                    />
                </div>
            </div>
        </div>
    );
};
export default CarList;
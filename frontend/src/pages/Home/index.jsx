import { useLocation } from "react-router-dom";
import HomeRentHeader from "./HomeRentHeader";
import AIRecommendation from "./AIRecommendation";
import VehicleCard from "./VehicleCard";
import CarPickZone from "./CarPickZone";
import CustomerReview from "./CustomerReview";
import HomeFooter from "./HomeFooter";
import { useState } from "react";
const Home = () => {
    const location = useLocation();
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    // const segment = location.state?.segment || "정보 없음";
    const reason = location.state?.reason || "추천 이유를 불러올 수 없습니다.";
    const features = {
        year: '25년식',
        seat: '4인승',
        option: ['가솔린', '경차', '도심 주행']
    };

    return (
        <div className="flex flex-col w-full max-w-[640px] justify-center min-h-screen bg-white pb-10 mt-[60px] mx-auto">
            {/* Promo */}
            <HomeRentHeader 
                showPickupModal={showPickupModal}
                setShowPickupModal={setShowPickupModal}
                selectedCar={selectedCar}
            />

            {/* AI 추천 차량 */}
            <div className="xx:p-2 sm:p-6">
                <div className="xx:text-[18px] sm:text-2xl font-bold mt-2">AI 추천차량</div>
                <AIRecommendation content={reason}/>
                <div className="flex xx:flex-col xs:flex-row justify-between gap-4">
                    <VehicleCard
                        discount={30}
                        imageSrc="./images/common/car.png"
                        title="캐스퍼 가솔린"
                        features={features}
                        price={324000}
                        onClick={() => {
                            setSelectedCar({ title: "캐스퍼 가솔린", price: 324000, discount: 30})
                            setShowPickupModal(true);
                        }}
                    />
                    <VehicleCard
                        discount={50}
                        imageSrc="./images/common/car.png"
                        title="캐스퍼"
                        features={features}
                        price={128000}
                        onClick={() => {
                            setSelectedCar({ title: "캐스퍼", price: 128000, discount: 50})
                            setShowPickupModal(true)
                        }}
                    />
                </div>

                {/* 카픽존 찾기 */}
                <h2 className="xx:text-[18px] sm:text-2xl font-bold mb-2">카픽존 찾기</h2>
                <CarPickZone />

                {/* 고객 후기 */}
                <h2 className="xx:text-[18px] sm:text-2xl font-bold xx:mb-2 sm:mb-4">고객후기</h2>
                <CustomerReview />
            </div>

            {/* Footer */}
            <HomeFooter />
        </div>
    );
};

export default Home;
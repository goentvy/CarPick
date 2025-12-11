import { useLocation, useNavigate } from "react-router-dom";
import HomeRentHeader from "./HomeRentHeader";
import AIRecommendation from "./AIRecommendation";
import VehicleCard from "./VehicleCard";
import CarPickZone from "./CarPickZone";
import CustomerReview from "./CustomerReview";
import HomeFooter from "./HomeFooter";
const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const segment = location.state?.segment || "정보 없음";
    const reason = location.state?.reason || "추천 이유를 불러올 수 없습니다.";
    const features = {
        title: '가족여행에 최적화 된 공간',
        option: ['유아 카시트 2개', '넓은 트렁크']
    };

    return (
        <div className="flex flex-col w-full max-w-[640px] justify-center min-h-screen bg-white pb-10 mt-20 px-[25px] mx-auto">
            {/* Promo */}
            <HomeRentHeader />

            <AIRecommendation content={reason}/>

            {/* AI 추천 차량 */}
            <div>AI 추천차량</div>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <VehicleCard
                    discount={true}
                    imageSrc="/src/assets/car.png"
                    title="Carnival High- Limousine"
                    features={features}
                    price={128000}
                />
                <VehicleCard
                    discount={false}
                    imageSrc="/src/assets/car.png"
                    title="Carnival High- Limousine"
                    features={features}
                    price={128000}
                />
            </div>

            {/* 카픽존 찾기 */}
            <h2 className="text-lg! font-bold! mb-2">카픽존 찾기</h2>
            <CarPickZone />

            {/* 고객 후기 */}
            <h2 className="text-lg! font-bold! mb-4">고객후기</h2>
            <CustomerReview />

            {/* Footer */}
            <HomeFooter />
        </div>
    );
};

export default Home;
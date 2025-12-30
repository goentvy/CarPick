import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import HomeRentHeader from "./HomeRentHeader";
import AIRecommendation from "./AIRecommendation";
import VehicleCard from "./VehicleCard";
import CarPickZone from "./CarPickZone";
import CustomerReview from "./CustomerReview";
import HomeFooter from "./HomeFooter";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [segment, setSegment] = useState("정보 없음");
    const [reason, setReason] = useState("추천 이유를 불러올 수 없습니다.");
    const [selectedCar, setSelectedCar] = useState(null);
    const [cars, setCars] = useState([]);


    // 슬라이더 설정
    const settings = {
        dots: true,
        infinite: true,      // 슬라이드 끝나도 반복
        speed: 500,
        slidesToShow: 2,     
        slidesToScroll: 2,   
        autoplay: true,       // 자동 슬라이드
        autoplaySpeed: 5000,  // 5초마다 이동
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    useEffect(() => {
        const storedSegment = localStorage.getItem("recommendedSegment");
        const storedReason = localStorage.getItem("recommendedReason");

        if (storedSegment) setSegment(storedSegment);
        if (storedReason) setReason(storedReason);

        if(segment !== "정보 없음") {
           axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ai-pick/cars`, {
                params: { carClass: segment }
            })
            .then((res) => {
                setCars(res.data);
                console.log(res.datat);
            })
            .catch((err) => {
                console.error("차량 리스트 불러오기 실패:", err);
            });
        }
    }, [segment]);

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
                <div className="my-8">
                <Slider {...settings} className="space-x-4">
                    {cars.slice(0, 6).map((car, index) => (
                    <div key={index} className="px-2">
                        <VehicleCard
                        discount={car.discountRate}
                        imageSrc={car.mainImageUrl || "/images/common/car.png"}
                        title={car.displayNameShort}
                        aiSummary={car.aiSummary}
                        features={{ option: car.driveLabels.split(',') }}
                        price={car.finalPrice}
                        onClick={() => {
                            setSelectedCar({
                            title: car.displayNameShort,
                            price: car.finalPrice,
                            discount: car.discountRate,
                            });
                            setShowPickupModal(true);
                        }}
                        />
                    </div>
                    ))}
                </Slider>
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
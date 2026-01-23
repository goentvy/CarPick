import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

import HomeRentHeader from "./HomeRentHeader";
import AIRecommendation from "./AIRecommendation";
import VehicleCard from "./VehicleCard";
import CarPickZone from "./CarPickZone";
import CustomerReview from "./CustomerReview";
import HomeFooter from "./HomeFooter";

// 슬라이더 설정
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 5000,
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

const Home = () => {
  const [showPickupModal, setShowPickupModal] = useState(false);

  // ✅ 지점 목록(브랜치) 상태 추가
  const [branches, setBranches] = useState([]);

  const sg = [
    { key: "LIGHT", label: "경형", reason: "연비가 뛰어나고 주차가 쉬워 도심 이동에 적합합니다." },
    { key: "COMPACT", label: "준중형", reason: "연비와 공간의 균형이 좋아 가장 무난한 선택입니다." },
    { key: "MID", label: "중형", reason: "승차감과 실내 공간이 넉넉해 장거리 운전에 적합합니다." },
    { key: "SUV", label: "SUV", reason: "적재 공간이 넓고 안정적인 주행 성능으로 여행에 적합합니다." },
    { key: "RV", label: "RV/승합", reason: "여러 명이 함께 이동하거나 단체 여행에 최적화된 차량입니다." },
  ];

  const getRandomSegment = () => sg[Math.floor(Math.random() * sg.length)];

  const getInitialRecommendation = () => {
    const savedSegment = localStorage.getItem("recommendedSegment");
    const savedReason = localStorage.getItem("recommendedReason");

    if (savedSegment && savedReason) {
      return { segment: savedSegment, reason: savedReason };
    }

    const random = getRandomSegment();
    localStorage.setItem("recommendedSegment", random.key);
    localStorage.setItem("recommendedReason", random.reason);
    return { segment: random.key, reason: random.reason };
  };

  const { segment: initialSegment, reason: initialReason } = getInitialRecommendation();
  const [segment, setSegment] = useState(initialSegment);
  const [reason, setReason] = useState(initialReason);

  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);

  // ✅ 1) 홈 진입 시 지점 목록 가져오기 (하드코딩 제거 핵심)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/branches`
        );
        setBranches(res.data ?? []);
      } catch (err) {
        console.error("지점 목록 불러오기 실패:", err);
        setBranches([]);
      }
    };

    fetchBranches();
  }, []);

  // ✅ 2) AI 추천 차량 리스트
  useEffect(() => {
    if (segment === "정보 없음") return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/ai-pick/cars`,
          { params: { carClass: segment } }
        );
        setCars(res.data);
      } catch (err) {
        console.error("차량 리스트 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [segment]);

  return (
    <div
      id="home"
      className="flex flex-col w-full max-w-[640px] justify-center min-h-screen bg-white mt-[60px] mx-auto"
    >
      {/* Promo */}
      <HomeRentHeader
        showPickupModal={showPickupModal}
        setShowPickupModal={setShowPickupModal}
        selectedCar={selectedCar}
        branches={branches} // ✅ 여기 추가!
      />

      {/* AI 추천 차량 */}
      <div className="xx:p-2 sm:p-6">
        <div className="text-[20px] font-bold mt-2">AI 추천차량</div>
        <AIRecommendation content={reason} />

        <div className="my-8">
          {cars.length > 0 ? (
            <Slider {...sliderSettings} className="space-x-4">
              {cars.slice(0, 6).map((car) => (
                <div key={car.vehicleId} className="px-2">
                  <VehicleCard
                    discount={car.discountRate}
                    imageSrc={car.mainImageUrl || "/images/common/car.png"}
                    title={car.displayNameShort}
                    aiSummary={car.aiSummary}
                    features={{ option: car.driveLabels.split(",") }}
                    price={car.finalPrice}
                    onClick={() => {
                      setSelectedCar({
                        id: car.vehicleId,
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
          ) : (
            <p className="text-gray-500 text-center">추천 차량이 없습니다.</p>
          )}
        </div>

        {/* 카픽존 찾기 */}
        <h2 className="text-[20px] font-bold mb-2">카픽존 찾기</h2>
        <CarPickZone />

        {/* 고객 후기 */}
        <h2 className="text-[20px] font-bold xx:mb-2 sm:mb-4">고객후기</h2>
        <CustomerReview />
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Home;

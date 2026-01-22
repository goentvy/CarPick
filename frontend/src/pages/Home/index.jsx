import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

import HomeRentHeader from './HomeRentHeader';
import AIRecommendation from './AIRecommendation';
import VehicleCard from './VehicleCard';
import CarPickZone from './CarPickZone';
import CustomerReview from './CustomerReview';
import HomeFooter from './HomeFooter';

// 슬라이더 설정 (컴포넌트 밖으로 이동)
const sliderSettings = {
  dots: true,
  infinite: true, // 슬라이드 반복
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  autoplay: true, // 자동슬라이드
  autoplaySpeed: 5000, // 5초마다 진행
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
  const sg = [
    { key: 'LIGHT', label: '경형', reason: '연비가 뛰어나고 주차가 쉬워 도심 이동에 적합합니다.' },
    { key: 'SMALL', label: '소형', reason: '유지비 부담이 적고 실용성이 높아 일상 이동에 적합합니다.' },
    { key: 'COMPACT', label: '준중형', reason: '연비와 공간의 균형이 좋아 가장 무난한 선택입니다.' },
    { key: 'MID', label: '중형', reason: '승차감과 실내 공간이 넉넉해 장거리 운전에 적합합니다.' },
    { key: 'LARGE', label: '대형', reason: '넉넉한 공간과 고급스러운 주행 경험을 제공합니다.' },
    { key: 'SUV', label: 'SUV', reason: '적재 공간이 넓고 안정적인 주행 성능으로 여행에 적합합니다.' },
    { key: 'RV', label: 'RV/승합', reason: '여러 명이 함께 이동하거나 단체 여행에 최적화된 차량입니다.' },
  ];

  const getRandomSegment = () => {
    return sg[Math.floor(Math.random() * sg.length)];
  };

  const getInitialRecommendation = () => {
    const savedSegment = localStorage.getItem('recommendedSegment');
    const savedReason = localStorage.getItem('recommendedReason');

    if (savedSegment && savedReason) {
      return { segment: savedSegment, reason: savedReason };
    }
    const random = getRandomSegment();

    // 최초 진입 시 스토리지에도 저장 (선택)
    localStorage.setItem('recommendedSegment', random.key);
    localStorage.setItem('recommendedReason', random.reason);

    return { segment: random.key, reason: random.reason };

  };


  const { segment: initialSegment, reason: initialReason } = getInitialRecommendation();
  const [segment, setSegment] = useState(initialSegment);
  const [reason, setReason] = useState(initialReason);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    if (segment === '정보 없음') return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ai-pick/cars`, {
          params: { carClass: segment },
        });
        setCars(res.data); // 비동기 콜백 안에서 상태 업데이트
      } catch (err) {
        console.error('차량 리스트 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [segment]);

  return (
    <div id="home" className="flex flex-col w-full max-w-[640px] justify-center min-h-screen bg-white mt-[60px] mx-auto">
      {/* Promo */}
      <HomeRentHeader
        showPickupModal={showPickupModal}
        setShowPickupModal={setShowPickupModal}
        selectedCar={selectedCar}
      />

      {/* AI 추천 차량 */}
      <div className="xx:p-2 sm:p-6">
        <div className="xx:text-[18px] sm:text-2xl font-bold mt-2">AI 추천차량</div>
        <AIRecommendation content={reason} />

        <div className="my-8">
          {cars.length > 0 ? (
            <Slider {...sliderSettings} className="space-x-4">
              {cars.slice(0, 6).map((car) => (
                <div key={car.vehicleId} className="px-2">
                  <VehicleCard
                    discount={car.discountRate}
                    imageSrc={car.mainImageUrl || '/images/common/car.png'}
                    title={car.displayNameShort}
                    aiSummary={car.aiSummary}
                    features={{
                      option: car.driveLabels.split(','),
                    }}
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

import { useEffect, useMemo, useState } from "react";
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

import api from "@/services/api"; // ✅ axios instance (baseURL: `${VITE_API_BASE_URL}/api`)

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
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toLocalDateTimeString(d) {
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  );
}

export default function Home() {
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [branches, setBranches] = useState([]);

  const sg = useMemo(
    () => [
      { key: "LIGHT", label: "경형", reason: "연비가 뛰어나고 주차가 쉬워 도심 이동에 적합합니다." },
      { key: "COMPACT", label: "준중형", reason: "연비와 공간의 균형이 좋아 가장 무난한 선택입니다." },
      { key: "MID", label: "중형", reason: "승차감과 실내 공간이 넉넉해 장거리 운전에 적합합니다." },
      { key: "SUV", label: "SUV", reason: "적재 공간이 넓고 안정적인 주행 성능으로 여행에 적합합니다." },
      { key: "RV", label: "RV/승합", reason: "여러 명이 함께 이동하거나 단체 여행에 최적화된 차량입니다." },
    ],
    []
  );

  const getRandomSegment = () => sg[Math.floor(Math.random() * sg.length)];
  const getInitialRecommendation = () => {
    const savedSegment = localStorage.getItem("recommendedSegment");
    const savedReason = localStorage.getItem("recommendedReason");
    if (savedSegment && savedReason) return { segment: savedSegment, reason: savedReason };

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
  const [loading, setLoading] = useState(true);

  // 1) 지점 목록
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get("/branches");
        setBranches(res.data ?? []);
      } catch (err) {
        console.error("지점 목록 불러오기 실패:", err);
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  // 2) AI → specIds → /cars 실데이터 → merge
  useEffect(() => {
    if (!segment) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // A) AI 추천 목록 (specId + reason)
        const aiRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/ai-pick/cars`,
          { params: { carClass: segment } }
        );
        const aiList = Array.isArray(aiRes.data) ? aiRes.data : [];

        const specIds = [...new Set(aiList.map((a) => a.specId).filter(Boolean))].slice(0, 12);
        if (specIds.length === 0) {
          setCars([]);
          return;
        }

        const reasonMap = new Map(aiList.map((a) => [a.specId, a.reason ?? a.aiSummary ?? ""]));

        // B) /cars 실데이터 호출 
        const pickupBranchId = branches?.[0]?.branchId;

        const start = new Date(Date.now() + 60 * 60 * 1000);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        const params = new URLSearchParams();
        specIds.forEach((id) => params.append("specIds", String(id)));

        if (pickupBranchId) params.set("pickupBranchId", String(pickupBranchId));
        params.set("startAt", toLocalDateTimeString(start));
        params.set("endAt", toLocalDateTimeString(end));
        // params.set("rentType", "DAY"); // 필요하면 켜

        const carRes = await api.get("/cars", { params });
        const realList = Array.isArray(carRes.data) ? carRes.data : (carRes.data?.items ?? []);

        // C) merge + AI 순서 유지
        const merged = realList
          .map((c) => ({ ...c, aiSummary: reasonMap.get(c.specId) ?? "" }))
          .sort((a, b) => specIds.indexOf(a.specId) - specIds.indexOf(b.specId));

        setCars(merged);
      } catch (err) {
        console.log("status:", err?.response?.status);
        console.log("data:", err?.response?.data); // ✅ 400 원인 확인용
        console.error("홈 추천차량 불러오기 실패:", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment, branches]);

  return (
    <div
      id="home"
      className="flex flex-col w-full max-w-[640px] justify-center min-h-screen bg-white mt-[60px] mx-auto"
    >
      <HomeRentHeader
        showPickupModal={showPickupModal}
        setShowPickupModal={setShowPickupModal}
        selectedCar={selectedCar}
        branches={branches}
      />

      <div className="xx:p-2 sm:p-6">
        <div className="text-[20px] font-bold mt-2">AI 추천차량</div>
        <AIRecommendation content={reason} />

        <div className="my-9">
          {loading ? (
            <p className="text-gray-500 text-center">추천 차량 불러오는 중…</p>
          ) : cars.length > 0 ? (
            <Slider {...sliderSettings} className="space-x-4">
              {cars.slice(0, 6).map((car) => (
                <div key={car.specId ?? car.vehicleId} className="px-2">
                  <VehicleCard
                    discount={car.discountRate ?? 0}
                    imageSrc={car.imgUrl || "/images/common/car.png"}
                    title={car.displayNameShort || car.displayName || "추천 차량"}
                    info={{
                      year: car.modelYear,
                      seat: `${car.seatingCapacity}인승`,
                    }}
                    features={car.driveLabels || `${car.fuelType ?? ""},${car.carClass ?? ""}`}
                    price={Number(car.originalPrice ?? car.finalPrice ?? 0)}
                    onClick={() => {
                      setSelectedCar({
                        id: car.specId ?? car.vehicleId,
                        title: car.displayNameShort || car.displayName,
                        price: Number(car.originalPrice ?? car.finalPrice ?? 0),
                        discount: car.discountRate ?? 0,
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

        <h2 className="text-[20px] font-bold mb-2">카픽존 찾기</h2>
        <CarPickZone />

        <h2 className="text-[20px] font-bold xx:mb-2 sm:mb-4">고객후기</h2>
        <CustomerReview />
      </div>

      <HomeFooter />
    </div>
  );
}
import { useNavigate } from "react-router-dom";

const CarPickZone = () => {
  const navigate = useNavigate();

  return (
    <section className="xx:mb-2 sm:mb-8">
      <div className="flex flex-col justify-center items-center rounded-2xl border border-blue-500 p-4 xx:space-y-2 bg-gray-50 mb-4">
        <p className="text-[18px] text-brand font-bold sm:mt-8 sm:mb-1">내 주변 카픽존 찾기</p>
        <p className="text-base text-brand sm:mb-5">가까운 차량 픽업 위치를 확인하세요</p>

        <button
          className="bg-[#1D6BF3] xx:px-4 sm:px-6 xx:py-1 sm:py-2 sm:mb-12 border border-blue-500 rounded-4xl font-bold text-base text-white hover:bg-[#0A56FF] cursor-pointer"
          onClick={() => navigate("/zone")}
        >
          지도 보기
        </button>
      </div>
    </section>
  );
};

export default CarPickZone;

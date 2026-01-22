import { useNavigate } from "react-router-dom";

const CarPickZone = () => {
  const navigate = useNavigate();

  return (
    <section className="xx:mb-2 sm:mb-8">
      <div className="flex flex-col justify-center items-center rounded-2xl border border-blue-500 p-4 xx:space-y-2 bg-gray-50 mb-4">
        <p className="xx:text-base sm:text-2xl text-brand font-bold sm:mt-8 sm:mb-1">내 주변 카픽존 찾기</p>
        <p className="xx:text-sm sm:text-xl text-brand sm:mb-8">가까운 차량 픽업 위치를 확인하세요</p>

        <button
          className="bg-lime-300 xx:px-4 sm:px-6 xx:py-1 sm:py-2 sm:mb-12 border border-blue-500 rounded-4xl font-bold xx:text-base sm:text-2xl text-brand hover:bg-lime-400 cursor-pointer"
          onClick={() => navigate("/zone")}
        >
          지도 보기
        </button>
      </div>
    </section>
  );
};

export default CarPickZone;

import { useNavigate } from "react-router-dom";

const CarPickZone = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex flex-col justify-center items-center rounded-2xl border border-blue-500 p-4 bg-gray-50 mb-4">
        <p className="text-2xl! text-blue-500 font-bold mt-8 mb-1">내 주변 카픽존 찾기</p>
        <p className="text-xl! text-blue-500 mb-8">가까운 차량 픽업 위치를 확인하세요</p>

        <button
            className="bg-lime-300 px-6 py-2 mb-12 border border-blue-500 rounded-4xl font-bold text-2xl! text-blue-500 hover:bg-lime-400"
            onClick={() => navigate("/zone/picture")}
        >
            지도 보기
        </button>
      </div>
    </section>
  );
};

export default CarPickZone;

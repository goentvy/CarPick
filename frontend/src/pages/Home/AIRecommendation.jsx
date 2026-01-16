import { useNavigate } from "react-router-dom";

const AIRecommendation = ({ content }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-700 text-white rounded-2xl xx:p-3 sm:p-5 shadow-md xx:my-2 sm:my-5 border-3 border-lime-300">
      {/* 상단 AI 라벨 */}
      <p className="text-lime-300 xx:text-xs sm:text-sm mb-3 cursor-default">✦ AI RECOMMENDATION</p>

      {/* 추천 문구 */}
      <p className="xx:text-base sm:text-xl font-bold leading-relaxed mb-2 cursor-default">
        {content}
      </p>

      {/* 다시 고르기 버튼 */}
      <div className="text-right">
        <button
          className="bg-lime-300 text-gray-500 font-semibold xx:text-xs sm:text-base px-4 py-1 rounded-4xl hover:bg-lime-400 cursor-pointer"
          onClick={() => navigate("/")}>
          다시 선택
        </button>
      </div>
    </div>
  );
};

export default AIRecommendation;

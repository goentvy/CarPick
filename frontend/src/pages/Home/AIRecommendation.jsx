const AIRecommendation = ({content}) => {
  return (
    <div className="bg-gray-700 text-white rounded-2xl p-5 shadow-md my-5 border-3 border-lime-300">
      {/* 상단 AI 라벨 */}
      <p className="text-lime-300 text-sm mb-3">✦ AI RECOMMENDATION</p>

      {/* 추천 문구 */}
      <p className="text-xl font-bold leading-relaxed mb-2">
        {content}
      </p>

      {/* 다시 고르기 버튼 */}
      <div className="text-right">
        <button className="bg-lime-300 text-gray-500 font-semibold px-4 py-1 rounded-4xl hover:bg-lime-400">
          다시 선택
        </button>
      </div>
    </div>
  );
};

export default AIRecommendation;

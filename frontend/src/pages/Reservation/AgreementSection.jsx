const AgreementSection = () => {
  return (
    <section className="mt-6 mb-20">
      <h2 className="text-lg font-semibold mb-4">약관 및 결제 동의</h2>

      {/* 약관 목록 */}
      <ul className="space-y-2 text-sm text-blue-600 underline">
        <li><a href="#">서비스 이용약관</a></li>
        <li><a href="#">자동차 대여 표준 약관</a></li>
        <li><a href="#">취소 안내</a></li>
        <li><a href="#">개인정보 제3자 제공 동의</a></li>
        <li><a href="#">개인정보 수집 이용 동의</a></li>
        <li><a href="#">이용 안내</a></li>
      </ul>

      {/* 결제 동의 체크박스 */}
      <div className="mt-4">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400" />
          <span>위 내용을 모두 확인하였으며, 결제에 동의합니다.</span>
        </label>
      </div>

      {/* 결제 버튼 */}
      <div className="mt-6 flex space-x-4">
        <button
          type="button"
          className="flex-1 px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
        >
          49,900원 결제하기
        </button>
        <button
          type="button"
          className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          비회원 49,900원 결제하기
        </button>
      </div>
    </section>
  );
};

export default AgreementSection;

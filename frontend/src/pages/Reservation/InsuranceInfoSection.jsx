const InsuranceInfoSection = () => {
  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4 xx:space-y-3 sm:space-y-4">
      <h2 className="xx:text-base sm:text-lg font-semibold">보험정보</h2>

      {/* 기본 보험 안내 */}
      <div className="space-y-2 p-4 border border-blue-500 rounded-lg bg-gray-50">
        <p className="text-sm">
          <strong>일반면책:</strong> 10,000원
        </p>
        <p className="text-sm">
          <strong>보상한도:</strong> 2,000만원
        </p>
        <p className="text-sm">
          <strong>자기부담금:</strong> 50만원
        </p>
      </div>

      {/* 보상 항목 */}
      <h3 className="xx:text-base sm:text-lg font-semibold">보상 항목</h3>
      <ul className="space-y-1 text-sm list-disc list-inside">
        <li>대인: 자배법 시행령 기준</li>
        <li>대물: 3천만원</li>
        <li>자손 사망: 3천만원</li>
        <li>자손 부상: 1천5백만원</li>
        <li>자손 휴유장애: 3천만원</li>
      </ul>

      {/* 안내 문구 */}
      <p className="xx:text-xs sm:text-sm text-purple-600">
        계약서에 명시된 보험이 적용됩니다. 반드시 계약서 확인 후 작성해주세요.
      </p>
    </section>
  );
};

export default InsuranceInfoSection;

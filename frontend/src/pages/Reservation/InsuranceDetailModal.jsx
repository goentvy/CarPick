const InsuranceDetailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 z-1001 flex justify-center items-center w-full mx-auto">
      <div className="bg-white rounded-lg max-w-[520px] xx:p-3 sm:p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">보장내용을 알아볼까요?</h2>

        <p className="font-bold mb-1">Q. 자동차 보험 꼭 가입해야하나요?</p>
        <p className="mb-4 text-gray-700 text-sm">
          CarPick 모든 차량은 '자동차 종합보험'에 가입되어 있으니 보험 가입하고 든든하게 보장받으세요.
        </p>

        <p className="font-bold mb-1">Q. '일반자차'와 '완전자차' 차이점을 알고 싶어요.</p>
        <p className="text-sm">
          '고객부담금(자차 수리비)'을 제외한 나머지(대인, 대물, 자손) 보장내용은 같아요.<br />
          단, 자차 보험을 선택하지 않으면 사고 시 자차 수리비용 전액을 부담해야 해요.
        </p>

        <table className="w-full border text-center text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2">구분</th>
              <th className="border px-2 py-2">선택없음</th>
              <th className="border px-2 py-2">일반자차</th>
              <th className="border px-2 py-2"><span className="text-blue-700">완전자차</span></th>
            </tr>
          </thead>
          <tbody className="text-gray-500">
            <tr>
              <td className="border px-2 py-3">
                <p>고객부담금</p>
                <p>(자차수리비)</p>
              </td>
              <td className="border px-2">전액</td>
              <td className="border px-2">30만원</td>
              <td className="border px-2">면제</td>
            </tr>
            <tr>
              <td className="border px-2 py-2">대인</td>
              <td colSpan="3" className="border px-2 py-1">전액 보장</td>
            </tr>
            <tr>
              <td className="border px-2 py-2">대물</td>
              <td colSpan="3" className="border px-2 py-1">최대 2천만원</td>
            </tr>
            <tr>
              <td className="border px-2 py-2">자손</td>
              <td colSpan="3" className="border px-2 py-1">인당 최대 1,500만원</td>
            </tr>
          </tbody>
        </table>
        <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              * 자손: 나의 신체가 다친 경우
            </p>
            <p className="text-gray-600 text-sm">
              * 대물: 다른 사람의 물건(차량)에 손해를 입힌 경우
            </p>
            <p className="text-gray-600 text-sm">
              * 대인: 다른 사람의 신체를 다치게 한 경우
            </p>
        </div>

        <p className="font-bold mt-5 mb-1">Q. 휴차보상료가 뭔가요?</p>
        <p className="mb-4 text-gray-700 text-sm">
          차량 사고시 수리 기간 동안 할인이 적용되지 않은 표준 대여료(24시간 기준)의 50%를 고객(임차인)에게 청구하는데, 이 요금을 휴차보상료(또는 휴차료)라고 해요.
        </p>

        <div className="space-y-1">
            <p className="text-gray-600 text-sm">
              * '완전자차' 보험 가입 시 단순 사고일 경우 휴차보상료가 면제돼요.
            </p>
            <p className="text-gray-600 text-sm">
              * 단, '완전 자차' 보험을 가입했어도 전손 처리 혹은 폐차 시 휴차보상료가 부과 돼요.
            </p>
            <p className="text-gray-600 text-sm">! 임대차 계약서 보험 보상 관련 약관에서 확인 가능</p>
        </div>

        <p className="font-bold mt-5 mb-1">Q. 보험 가입 후 사고 났을 때 어떻게 처리되나요?</p>
        <p className="mb-4 text-gray-700 text-sm">
          한 번의 사고만 보장해요. 운전 중 사고가 났다면 CarPick 고객센터(1588-1588)로 전화주세요.
        </p>
      </div>
    </div>
  );
};

export default InsuranceDetailModal;

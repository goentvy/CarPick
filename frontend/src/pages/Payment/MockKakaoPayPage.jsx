const MockKakaoPayPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-black">카카오페이 결제</h1>
          <img
            src="https://developers.kakao.com/assets/img/about/logos/kakaopay_logo.png"
            alt="KakaoPay"
            className="h-6"
          />
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600">주문번호</p>
            <p className="font-semibold">ORDER123</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600">상품명</p>
            <p className="font-semibold">테스트 상품</p>
          </div>
          <div className="pb-4">
            <p className="text-gray-600">결제금액</p>
            <p className="text-2xl font-bold text-yellow-500">55,000원</p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => alert("결제가 완료되었습니다!")}
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            결제하기
          </button>
          <button
            onClick={() => alert("결제가 취소되었습니다.")}
            className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockKakaoPayPage;
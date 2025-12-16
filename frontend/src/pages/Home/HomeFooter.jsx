const HomeFooter = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-xs py-6 mb-5 rounded-t-4xl">
      <div className="max-w-[640px] mx-auto px-6">
        {/* 링크 */}
        <div className="flex gap-4 mb-2 text-[13px] font-medium">
          <a href="/terms" className="hover:underline">이용약관</a>
          <span className="text-gray-300">|</span>
          <a href="/privacy" className="hover:underline">개인정보취급방침</a>
        </div>

        {/* 회사 정보 */}
        <div className="my-6">
          <img src="./images/common/logo.svg" alt="logo" />
        </div>
        <p className="mb-1">주소 : 경기 안산시 단원구 적금로 93</p>
        <p className="mb-1">문의 : 031-410-0311</p>

        {/* 저작권 */}
        <p className="mt-2 text-gray-400">
          Copyright©2025 안산시 청년센터 상상스테이션. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;

import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
<<<<<<< HEAD
    <footer className="bg-gray-100 text-gray-600 text-xs py-6 mb-5 ">
=======
    <footer className="bg-gray-100 text-gray-600 text-xs py-6 rounded-t-4xl">
>>>>>>> origin/dev
      <div className="max-w-[640px] mx-auto px-6">
        {/* 링크 */}
        <div className="flex gap-4 mb-2 text-[13px] font-medium">
          <Link to="/terms" className="hover:underline">이용약관</Link>
          <span className="text-gray-300">|</span>
          <Link to="/privacy" className="hover:underline">개인정보취급방침</Link>
        </div>

        {/* 회사 정보 */}
        <div className="my-6">
          <img src="./images/common/logo.svg" alt="logo" />
        </div>
        <p className="mb-1">주소 : 경기도 수원시 팔달구 덕영대로 905, 2층</p>
        <p className="mb-1">문의 : 031-256-0011</p>

        {/* 저작권 */}
        <p className="mt-2 text-gray-400">
          © Carpick 2026. All right reserved.
        </p>
      </div>
    </footer>
  );
};

export default HomeFooter;

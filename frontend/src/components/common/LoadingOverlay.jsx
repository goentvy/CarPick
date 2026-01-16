import React from 'react';

const LoadingOverlay = ({ loading, text = "회원정보를 불러오는 중" }) => {
  // loading이 false면 화면에 아무것도 그리지 않음
  if (!loading) return null;

  return (
    // Home 화면 규격(640px)에 맞춰 중앙 정렬된 파란색 로딩 화면
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[640px] h-full z-[9999] flex flex-col items-center justify-center bg-blue-500">

      {/* 빙글빙글 도는 스피너 (흰색) */}
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>

      {/* 텍스트 (흰색) */}
      <p className="text-white text-lg font-bold">{text}</p>
    </div>
  );
};

export default LoadingOverlay;
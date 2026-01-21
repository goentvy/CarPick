import React from 'react';
import { useNavigate } from 'react-router-dom';
import RentHeader from "./RentHeader";

const YearPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-w-[640px] min-h-screen bg-[#F8F9FA] pb-20 mt-[59px] mx-auto font-sans text-left">
      {/* 공통 헤더 (날짜/장소 선택기) */}
      <RentHeader type="long" location="year" />

      <div className="px-5 pt-8">
        {/* 섹션 01: CarP!ck 장점 */}
        <section className="mb-10">
          <h2 className="text-[20px] font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1 h-6 bg-brand mr-3 rounded-full"></span>
            01. CarP!ck 장기렌트의 특별함
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Smart AI", desc: "라이프스타일 맞춤 추천" },
              { title: "Fast Pick", desc: "대기 없는 즉시 인도" },
              { title: "Simple UX", desc: "복잡한 서류 절차 생략" },
              { title: "Free Start", desc: "초기 비용 부담 제로" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-brand font-bold text-[15px] mb-1">{item.title}</p>
                <p className="text-gray-500 text-[12px] break-keep">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 섹션 02: 계약 조건 */}
        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">02. 유연한 계약 조건</h2>
          <ul className="space-y-3 text-[14px] text-gray-600">
            <li className="flex justify-between"><span>계약 기간</span><span className="font-semibold text-gray-800">12개월 ~ 60개월 선택 가능</span></li>
            <li className="flex justify-between"><span>주행 거리</span><span className="font-semibold text-gray-800">연 1만 ~ 3만km (조절 가능)</span></li>
            <li className="flex justify-between"><span>이용 대상</span><span className="font-semibold text-gray-800">만 21세 이상 운전면허 소지자</span></li>
          </ul>
        </section>

        {/* 섹션 03: 보험 보상 한도 */}
        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">03. 든든한 보험 보상 한도</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand flex-shrink-0">🛡️</div>
              <div>
                <p className="font-semibold text-[15px]">대인/대물/자손 완전 보장</p>
                <p className="text-[13px] text-gray-500 mt-1">대인 무한, 대물 1억 원, 자손 1.5억 원 한도의 안심 보험 서비스를 기본 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 섹션 04: 정비 서비스 */}
        <section className="mb-10 bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h2 className="text-[18px] font-bold text-blue-900 mb-2">04. 무상 정비 & 긴급 지원</h2>
          <p className="text-[14px] text-blue-700 mb-4 leading-relaxed">
            24시간 사고 접수 및 긴급 출동 서비스가 포함되어 있습니다. 소모품 교체부터 사고 수리까지 CarP!ck이 책임집니다.
          </p>
          <button 
            onClick={() => navigate('/emergency')}
            className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 text-[14px] hover:bg-blue-100 transition-colors"
          >
            긴급 지원 서비스 자세히 보기 ➔
          </button>
        </section>

        {/* 섹션 05: 차량 관리 서비스 */}
        <section className="mb-10">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">05. 투명한 차량 관리</h2>
          <div className="bg-gray-800 text-white p-5 rounded-2xl">
            <p className="text-[14px] leading-relaxed opacity-90">
              “CarP!ck은 엄격한 차량 관리 기준을 준수합니다.”<br/><br/>
              모든 장기렌트 차량은 출고 전 100여 가지 항목의 <span className="text-brand font-bold underline">Safety Inspection</span>을 통과하며, 이용 중에는 AI 모니터링을 통해 정비 주기를 미리 알려드립니다.
            </p>
          </div>
        </section>

        {/* 섹션 06: 이용 절차 */}
        <section className="mb-10">
          <h2 className="text-[18px] font-bold text-gray-900 mb-6">06. 이용 절차 (1-3분 픽업)</h2>
          <div className="relative border-l-2 border-dashed border-gray-200 ml-3 pl-8 space-y-8">
            {[
              { step: "01", title: "방문 예약", desc: "온라인 상담 신청 후 지점 방문 일정 확정" },
              { step: "02", title: "1:1 맞춤 컨설팅", desc: "AI 분석 데이터를 기반으로 최적 견적 설계" },
              { step: "03", title: "계약 및 인도", desc: "Carpick Zone에서 대기 없이 즉시 차량 픽업" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[45px] top-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-[12px] font-bold shadow-md">
                  {item.step}
                </span>
                <h4 className="font-bold text-[16px] text-gray-800">{item.title}</h4>
                <p className="text-[13px] text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 최종 상담 유도 버튼 */}
        <div className="mt-12 mb-10 text-center">
          <p className="text-gray-400 text-[13px] mb-4">상담 신청 시 전문 카매니저가 30분 이내에 연락드립니다.</p>
          <button 
            className="w-full py-4 bg-brand text-white font-bold rounded-2xl text-[17px] shadow-lg shadow-blue-100 active:scale-[0.98] transition-transform"
            onClick={() => alert('방문 상담 예약 페이지 준비 중입니다.')}
          >
            장기렌트 방문 상담 예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearPage;
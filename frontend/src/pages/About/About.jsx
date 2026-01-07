import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Smile, Brain, Zap, Shield, MapPin, ChevronRight } from 'lucide-react';

const iconMap = {
    Smile: <Smile size={32} />, // 모바일에 맞춰 아이콘 사이즈 살짝 조정
    Brain: <Brain size={32} />,
    Zap: <Zap size={32} />,
    Shield: <Shield size={32} />,
    MapPin: <MapPin size={32} />,
};

const About = () => {
    const [values, setValues] = useState([]);
    const navigate = useNavigate();

    // [수정 포인트 1] 환경 변수에서 URL을 가져옵니다.
    // .env.production에 설정한 VITE_API_URL 값을 읽어옵니다.
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        // [수정 포인트 2] 하드코딩된 주소 대신 환경 변수 주소를 사용합니다.
        // 백틱(`)을 사용한 템플릿 리터럴 문법입니다.
        axios.get(`${API_BASE_URL}/api/about/values`)
            .then(res => setValues(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, [API_BASE_URL]);

    return (
        <div className="w-full font-sans text-gray-900 overflow-x-hidden bg-white">

            {/* 01. Hero Section - 모바일 높이 및 폰트 최적화 */}
            <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center bg-slate-900 text-white">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000')] bg-cover bg-center"></div>
                <div className="relative z-10 text-center px-6">
                    <p className="text-blue-400 font-bold tracking-widest mb-3 uppercase text-xs sm:text-sm">Brand Message</p>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
                        도착하면 바로 <br className="sm:hidden" />
                        <span className="text-blue-500">카픽.</span>
                    </h1>
                    <p className="text-lg sm:text-2xl font-light text-gray-300 break-keep">
                        여행의 시작을 가장 가볍게 만드는 <br className="sm:hidden" /> AI 모빌리티
                    </p>
                </div>
            </section>

            {/* 02. Brand Introduction - 모바일 가독성(break-keep) */}
            <section className="py-16 sm:py-24 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-10 text-gray-800 break-keep leading-snug">
                    “차를 빌리는 순간을, <br className="sm:hidden" /> 더 빠르고 더 똑똑하게.”
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-light break-keep">
                    CarP!ck은 여행자가 목적지만 정하면 AI가 가장 적합한 차량을 대신 선택해주는 새로운 렌터카 경험을 제공합니다.
                    복잡한 절차와 불필요한 대기 시간을 최소화해 도착과 동시에 곧바로 이동할 수 있는 여정을 설계합니다.
                </p>
            </section>

            {/* 03. Our Values - 모바일 그리드 최적화 (1열 -> 2열) */}
            <section className="py-16 sm:py-24 bg-slate-50 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">Our Values</h2>
                        <div className="w-10 h-1 bg-blue-600 mx-auto"></div>
                    </div>
                    {/* 모바일에서 1줄에 1개씩 나오되, 카드가 너무 크지 않게 조정 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                        {values.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 text-center">
                                <div className="text-blue-500 mb-4 flex justify-center">
                                    {iconMap[item.iconName] || <Smile size={32} />}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed break-keep">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 04. What We Offer - 모바일 간격 조정 */}
            <section className="py-16 sm:py-24 px-6 max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-16 text-center">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
                    {[
                        { title: "AI 기반 차량 추천", desc: "수십 가지 조건을 분석해 가장 알맞은 차량을 즉시 추천합니다. 선택에 대한 고민 없이, 최적의 답만 제공합니다." },
                        { title: "CarP!ck Zone", desc: "공항, KTX역 거점에서 별도 방문 없이 바로 차량을 픽업할 수 있습니다. 도착부터 출발까지 단 1–3분." },
                        { title: "투명하고 간결한 과정", desc: "예약–픽업–반납 전 과정에서 불필요한 단계를 제거했습니다. 직관적인 UX로 누구나 쉽게 이용합니다." }
                    ].map((offer, i) => (
                        <div key={i} className="p-8 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                            <span className="text-blue-600 font-bold text-base sm:text-lg mb-2 block">0{i + 1}.</span>
                            <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{offer.title}</h4>
                            <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed break-keep">{offer.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 05. Call to Action - 푸터 높이를 고려한 하단 여백(pb-32) 추가 */}
            <section className="py-20 sm:py-24 bg-blue-600 text-white text-center px-6 relative z-10 mb-[-1px]">
                <div className="max-w-3xl mx-auto pb-16 sm:pb-0"> {/* 모바일에서 푸터에 가리지 않게 추가 패딩 */}
                    <h2 className="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 italic tracking-tighter">Why CarP!ck?</h2>
                    <p className="text-lg sm:text-2xl font-light mb-10 sm:mb-12 leading-relaxed opacity-90 break-keep">
                        기다림 없는 여행, 고민 없는 차량 선택, <br className="hidden sm:block" />
                        가볍게 시작하는 여정. <br />
                        CarP!ck은 렌터카의 기준을 다시 정의합니다.
                    </p>

                    <button
                        onClick={() => {
                            window.scrollTo(0, 0);
                            navigate('/home');
                        }}
                        className="relative z-20 bg-white text-blue-600 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer active:scale-95"
                    >
                        지금 시작하기 <ChevronRight size={18} />
                    </button>
                </div>
            </section>

        </div>
    );
};

export default About;
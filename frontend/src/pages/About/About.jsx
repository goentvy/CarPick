import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Smile, Brain, Zap, Shield, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
    Smile: <Smile size={32} />,
    Brain: <Brain size={32} />,
    Zap: <Zap size={32} />,
    Shield: <Shield size={32} />,
    MapPin: <MapPin size={32} />,
};

const sectionMotion = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6
    }
};

const About = () => {
    const [values, setValues] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        // [추가] 모바일 환경 체크 (640px 이하)
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const style = document.createElement('style');
        style.id = 'hide-layout-style';
        style.innerHTML = `
            header, nav, footer, [class*="Header"], [class*="Navbar"], [class*="Footer"], #footer, .common-footer { 
                display: none !important; 
            }
            body { padding: 0 !important; margin: 0; overflow: hidden; }
            .snap-container { -ms-overflow-style: none; scrollbar-width: none; }
            .snap-container::-webkit-scrollbar { display: none; }
            section { scroll-snap-stop: always; }
        `;
        document.head.appendChild(style);

        axios.get(`${API_BASE_URL}/api/about/values`)
            .then(res => setValues(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));

        return () => {
            const styleElement = document.getElementById('hide-layout-style');
            if (styleElement) styleElement.remove();
            document.body.style.overflow = 'auto';
        };
    }, [API_BASE_URL]);

    return (
        <div className="snap-container w-full h-screen overflow-y-auto snap-y snap-proximity scroll-smooth font-sans text-gray-900 bg-white">

            {/* 01. Hero Section */}
            <section className="relative h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden snap-start">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000')] bg-cover bg-center"
                />
                <div className="relative z-10 text-center px-6">
                    <motion.div {...sectionMotion}>
                        <p className="text-blue-400 font-bold tracking-[0.3em] mb-4 uppercase text-base">Brand Message</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6 leading-[1.1]">
                            도착하면 바로 <br /><span className="text-blue-500">카픽.</span>
                        </h1>
                        <p className="text-xl sm:text-2xl font-light text-gray-300 mb-10">여행의 시작을 가장 가볍게 만드는 AI 모빌리티</p>
                    </motion.div>
                </div>
            </section>

            {/* 02. Brand Introduction */}
            <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-gradient-to-b from-white to-slate-50 snap-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.2, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.5 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[15rem] font-black text-slate-200 select-none pointer-events-none -z-10"
                >CARP!CK</motion.div>
                <motion.div {...sectionMotion} className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-5xl font-bold mb-[30px] text-gray-800 break-keep leading-tight">
                        “차를 빌리는 순간을, <br />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">더 빠르고 더 똑똑하게.</span>”
                    </h2>
                    <p className="text-base text-gray-500 leading-relaxed font-light max-w-3xl mx-auto break-keep">
                        CarP!ck은 여행자가 목적지만 정하면 AI가 가장 적합한 차량을 대신 선택해주는 <br />새로운 렌터카 경험을 제공합니다.
                    </p>
                </motion.div>
            </section>
            
            {/* 03. Our Values (이 섹션만 수정됨) */}
            <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden snap-start bg-[#030712] bg-gradient-to-br from-[#0f172a] via-[#030712] to-black">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[0%] right-[0%] w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <motion.div {...sectionMotion} className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Our Values</h2>
                        <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {values.map((item, idx) => (
                            <motion.div
                                key={idx}
                                // 모바일 환경에서는 등장 애니메이션을 opacity 1, y 0으로 고정하여 제거
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: isMobile }}
                                // 모바일에서는 호버/플로팅 효과 제거
                                whileHover={isMobile ? {} : {
                                    y: -12,
                                    scale: 1.02,
                                    borderColor: "rgba(59, 130, 246, 0.5)",
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                }}
                                // 모바일일 때는 트랜지션 계산을 무시 (duration: 0)
                                transition={isMobile ? { duration: 0 } : {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                    delay: 0
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 text-center shadow-2xl cursor-pointer"
                            >
                                <div className="relative mb-8 flex justify-center">
                                    <div className={`absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform ${isMobile ? 'duration-0' : 'duration-200'} ease-out`}></div>
                                    <div className={`relative text-blue-500 transform group-hover:scale-110 transition-transform ${isMobile ? 'duration-0' : 'duration-200'} ease-out`}>
                                        {iconMap[item.iconName] || <Smile size={40} />}
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors ${isMobile ? 'duration-0' : 'duration-200'}`}>{item.title}</h3>
                                <p className={`text-gray-400 text-base leading-relaxed break-keep font-medium group-hover:text-gray-200 transition-colors ${isMobile ? 'duration-0' : 'duration-200'}`}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 04. What We Offer - 쏘카 스타일 마스킹 업 애니메이션 버전 */}
            <section className="relative bg-white">
                {/* 섹션 타이틀: 쏘카(Next Move) 스타일 적용 */}
                <div className="h-screen flex flex-col items-center justify-center snap-start">
                    <div className="text-center">
                        {/* 글자가 잘린 상태에서 올라오게 하기 위한 overflow-hidden 컨테이너 */}
                        <div className="overflow-hidden mb-6">
                            <motion.h2
                                initial={{ y: "100%" }} // 완전히 아래에 숨겨진 상태
                                whileInView={{ y: 0 }}   // 제자리로 올라옴
                                viewport={{ once: false }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.33, 1, 0.68, 1], // 쏘카 특유의 매끄러운 가속도(Cubic Bezier)
                                }}
                                className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none"
                            >
                                What We Offer
                            </motion.h2>
                        </div>

                        {/* 하단 파란색 바: 텍스트가 올라온 후 나타나도록 약간의 딜레이 추가 */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileInView={{ scaleX: 1, opacity: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="w-24 h-3 bg-blue-600 mx-auto rounded-full origin-center"
                        ></motion.div>
                    </div>
                </div>

                {/* 스텝 반복 렌더링 (기존 유지하되 타이밍 최적화) */}
                {[
                    {
                        title: "AI 기반 차량 추천",
                        desc: "단순한 필터링을 넘어 사용자의 이용 패턴, 선호 스타일, 목적지까지의 경로 등 수십 가지 데이터를 실시간으로 분석합니다. 당신에게 가장 최적화된 맞춤형 차량을 AI가 즉시 제안하여 선택의 고민을 덜어드립니다.",
                        imageSrc: "/images/sub/about/AirportCar.png",
                    },
                    {
                        title: "CarP!ck Zone",
                        desc: "여행의 시작과 끝이 더 자유로워집니다. 공항, KTX역 등 주요 거점에 위치한 전용 픽업 존에서 별도의 대기나 대면 절차 없이 스마트폰 하나로 바로 차량을 이용하세요. 당신의 소중한 시간을 1분 1초라도 아껴드립니다.",
                        imageSrc: "/images/sub/about/CarPark.png",
                    },
                    {
                        title: "투명한 프로세스",
                        desc: "복잡한 서류 작업과 숨겨진 비용은 이제 없습니다. 예약부터 보험 가입, 차량 상태 확인, 그리고 반납까지 모든 과정을 투명하게 디지털화했습니다. 오직 드라이빙의 즐거움에만 집중할 수 있는 혁신적인 렌터카 경험을 제공합니다.",
                        imageSrc: "/images/sub/about/Car360blue.png",
                    },
                ].map((offer, i) => (
                    <div
                        key={i}
                        className={`h-screen flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} 
            items-center justify-center gap-12 md:gap-20 px-6 md:px-12 max-w-[1400px] mx-auto snap-start`}
                    >
                        {/* 텍스트 영역 */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                            className={`flex-1 space-y-6 ${i % 2 === 1 ? "md:pl-16" : "md:pr-12"}`}
                        >
                            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm block">Step 0{i + 1}</span>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 break-keep leading-[1.2]">
                                {offer.title}
                            </h3>
                            <p className="text-lg text-gray-600 font-medium leading-relaxed break-keep max-w-lg">
                                {offer.desc}
                            </p>
                        </motion.div>

                        {/* 이미지 영역 */}
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="flex-1 w-full max-w-[500px] md:max-w-[600px]"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-full aspect-[16/10] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100"
                            >
                                <img
                                    src={offer.imageSrc}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </section>

            {/* 05. Call to Action */}
            <section className="relative h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center px-6 overflow-hidden snap-start">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full"></div>
                <motion.div {...sectionMotion} className="relative z-10 max-w-5xl mx-auto px-4">
                    <h2 className="text-4xl min-[526px]:text-6xl md:text-7xl lg:text-8xl font-black mb-10 italic tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent break-keep leading-tight px-6 w-full inline-block">
                        Why CarP!ck?
                    </h2>
                    <p className="text-[24px] font-light mb-10 leading-relaxed text-gray-300 break-keep">
                        기다림 없는 여행, 고민 없는 차량 선택, <br />
                        <span className="text-white font-medium">렌터카의 기준을 다시 정의합니다.</span>
                    </p>
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "#eff6ff",
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/home')}
                        className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl shadow-2xl flex items-center gap-3 mx-auto"
                    >
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            지금 시작하기
                        </span>
                        <ChevronRight size={24} />
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
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

// 기본 페이드인 업 애니메이션
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-150px" }, // 화면에 150px 이상 들어왔을 때 실행
    transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true, margin: "-100px" }
};

const About = () => {
    const [values, setValues] = useState([]);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    //  헤더 있는 버전
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/about/values`)
            .then(res => setValues(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, [API_BASE_URL]);

    //  헤더 없는 버전
    // useEffect(() => {
    //     // 1. 헤더를 찾아 숨기는 스타일 추가
    //     // 이미지 상의 파란색 헤더(nav/header) 요소들을 선택합니다.
    //     const style = document.createElement('style');
    //     style.id = 'hide-header-style';
    //     style.innerHTML = `
    //         header, nav, [class*="Header"], [class*="Navbar"] { 
    //             display: none !important; 
    //         }
    //         /* 회사소개 페이지 상단 여백 제거 */
    //         body { padding-top: 0 !important; }
    //     `;
    //     document.head.appendChild(style);

    //     // API 로딩
    //     axios.get(`${API_BASE_URL}/api/about/values`)
    //         .then(res => setValues(res.data))
    //         .catch(err => console.error("데이터 로딩 실패:", err));

    //     // 2. Cleanup: 컴포넌트를 나갈 때 헤더를 다시 보이게 함
    //     return () => {
    //         const styleElement = document.getElementById('hide-header-style');
    //         if (styleElement) styleElement.remove();
    //     };
    // }, [API_BASE_URL]);

    return (
        <div className="w-full font-sans text-gray-900 overflow-x-hidden bg-white">

            {/* 01. Hero Section (전체 화면 높이로 수정하여 다음 섹션이 바로 안 보이게 함) */}
            <section className="relative h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000')] bg-cover bg-center"
                ></motion.div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <p className="text-blue-400 font-bold tracking-[0.3em] mb-4 uppercase text-sm">Brand Message</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6 leading-[1.1]">
                            도착하면 바로 <br />
                            <span className="text-blue-500">카픽.</span>
                        </h1>
                        <p className="text-xl sm:text-2xl font-light text-gray-300 mb-10">
                            여행의 시작을 가장 가볍게 만드는 AI 모빌리티
                        </p>
                        {/* 아래로 유도하는 화살표 애니메이션 */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-gray-400 opacity-50"
                        >
                            ↓ Scroll Down
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 02. Brand Introduction - 소프트 그라데이션 & 배경 텍스트 */}
            <section className="relative py-32 sm:py-48 px-6 overflow-hidden bg-gradient-to-b from-white to-slate-50">
                {/* 배경에 흐릿하게 깔리는 브랜드 네임 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-slate-200/30 select-none pointer-events-none -z-10">
                    CARP!CK
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-200px" }}
                    className="max-w-5xl mx-auto text-center"
                >
                    <h2 className="text-3xl sm:text-5xl font-bold mb-10 text-gray-800 break-keep leading-tight">
                        “차를 빌리는 순간을, <br />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">더 빠르고 더 똑똑하게.</span>”
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-500 leading-relaxed font-light max-w-3xl mx-auto break-keep">
                        CarP!ck은 여행자가 목적지만 정하면 AI가 가장 적합한 차량을 대신 선택해주는
                        새로운 렌터카 경험을 제공합니다.
                    </p>
                </motion.div>
            </section>

            {/* 03. Our Values - 선명한 대비와 강조 레이아웃 */}
            <section className="py-24 bg-[#0a0f1a] px-6 relative overflow-hidden">
                {/* 배경에 강력한 블루 포인트를 주어 카드가 더 돋보이게 함 */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div {...fadeInUp} className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Our Values</h2>
                        <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    >
                        {values.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                whileHover={{
                                    y: -15,
                                    borderColor: "#3b82f6", // 호버 시 테두리 색상 강조
                                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                                }}
                                // 카드 배경을 더 밝고 선명하게(bg-white/10) 하고 보더를 뚜렷하게 수정
                                className="group relative bg-white/[0.07] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 text-center transition-all duration-500 shadow-2xl"
                            >
                                {/* 카드 내부 상단에 작은 포인트 도트 추가 */}
                                <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="text-blue-500 mb-8 flex justify-center transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500">
                                    {iconMap[item.iconName] || <Smile size={40} />}
                                </div>

                                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed break-keep font-medium group-hover:text-gray-200 transition-colors">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 04. What We Offer - 블루 틴트(Tint) & 입체감 */}
            <section className="py-24 px-6 bg-blue-50/50">
                <div className="max-w-6xl mx-auto">
                    <motion.h2 {...fadeInUp} className="text-3xl font-bold mb-20 text-center text-slate-800">What We Offer</motion.h2>
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    >
                        {[
                            { title: "AI 기반 차량 추천", desc: "수십 가지 조건을 분석해 가장 알맞은 차량을 즉시 추천합니다." },
                            { title: "CarP!ck Zone", desc: "공항, KTX역 거점에서 별도 방문 없이 바로 차량을 픽업할 수 있습니다." },
                            { title: "투명한 프로세스", desc: "예약부터 반납까지 불필요한 단계를 제거했습니다." }
                        ].map((offer, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="group p-10 rounded-[2.5rem] bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-blue-200/50 transition-all border border-transparent hover:border-blue-100"
                            >
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                                    {i + 1}
                                </div>
                                <h4 className="text-2xl font-bold mb-4 text-slate-800">{offer.title}</h4>
                                <p className="text-gray-500 font-light leading-relaxed">{offer.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 05. Call to Action - 텍스트 강조 업그레이드 */}
            <section className="py-32 sm:py-48 bg-slate-900 text-white text-center px-6 relative overflow-hidden">
                {/* 배경 장식 원 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full"></div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <motion.h2
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-5xl sm:text-8xl font-black mb-10 italic tracking-tighter bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                    >
                        Why CarP!ck?
                    </motion.h2>
                    <p className="text-xl sm:text-3xl font-light mb-16 leading-relaxed text-gray-300 break-keep">
                        기다림 없는 여행, 고민 없는 차량 선택, <br />
                        <span className="text-white font-medium">렌터카의 기준을 다시 정의합니다.</span>
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#eff6ff" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { window.scrollTo(0, 0); navigate('/home'); }}
                        className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl shadow-2xl flex items-center gap-3 mx-auto transition-all"
                    >
                        지금 시작하기 <ChevronRight size={24} />
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
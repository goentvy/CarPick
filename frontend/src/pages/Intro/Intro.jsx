import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Intro.module.css";

import { createGlobalStyle } from "styled-components";

const HideHeaderFooter = createGlobalStyle`
  #head, #footer {
    display: none !important;
  }
`;

const optionsList = [
  { id: "pick1", label: "🚗 도심운전", value: "도심운전" },
  { id: "pick2", label: "🛣️ 장거리여행", value: "장거리여행" },
  { id: "pick3", label: "👨‍👩‍👧‍👦 가족여행", value: "가족여행" },
  { id: "pick4", label: "🏕️ 레저 · 차박", value: "레저/차박" },
  { id: "pick5", label: "📦 짐이 많아요", value: "짐이 많아요" },
  { id: "pick6", label: "✨ 최신모델선호", value: "최신모델선호" },
  { id: "pick7", label: "💸 가성비 중요", value: "가성비 중요" },
  { id: "pick8", label: "⛽ 저렴한 기름값", value: "저렴한 기름값" },
  { id: "pick9", label: "🎨 예쁜 디자인", value: "예쁜 디자인" },
  { id: "pick10", label: "🔌 전기차(EV) 선호", value: "전기차(EV) 선호" },
  { id: "pick11", label: "🚘 세단 선호", value: "세단 선호" },
  { id: "pick12", label: "🚙 SUV가 좋아요", value: "SUV 선호" },
  { id: "pick13", label: "🚗 소형차", value: "소형차" },
  { id: "pick14", label: "🆕 초보운전", value: "초보운전" },
  { id: "pick15", label: "🛋️ 승차감 중시", value: "승차감 중시" },
  { id: "pick16", label: "❄️ 눈길 · 비길", value: "눈길/비길" },
  { id: "pick17", label: "🚀 고속도로", value: "고속도로" },
  { id: "pick18", label: "🎧 음악감상 중요", value: "음악감상 중요" },
  { id: "pick19", label: "⛰️ 경사/산길", value: "경사/산길" },
  { id: "pick20", label: "🅿️ 쉬운 주차", value: "쉬운 주차" },
  { id: "pick21", label: "🏢 출퇴근 목적", value: "출퇴근 목적" },
  { id: "pick22", label: "🚐 MVV/밴 스타일", value: "MVV/밴 스타일" },
  { id: "pick23", label: "🧭 주행보조기능(ADAS) 중요", value: "주행보조기능(ADAS) 중요" },
  { id: "pick24", label: "🧑‍🤝‍🧑 5인승 이상", value: "5인승 이상" },
];

export default function Intro() {
  const [selected, setSelected] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const toggleOption = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const goHome = () => {
    navigate("/home"); // 홈으로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected.length < 3) {
      alert("최소 3개 이상 선택해주세요!");
      return;
    }

    setIsSubmitting(true); // 🔥 로딩 시작

    try {
      // 서버 요청
      const res = await fetch("http://3.236.8.244:8080/api/recommend-cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options: selected }),
      });

      if (!res.ok) throw new Error("서버 요청 실패");

      const data = await res.json();
      const result = data.recommendedSegment;

      navigate("/home", {
        state: {
          segment: result.segment,
          reason: result.reason
        }
      });

    } catch (err) {
      console.error(err);
      alert("서버 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false); 
    }
  };


  return (
    
    <div id="wrap">
        <HideHeaderFooter />
        {isSubmitting && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.intro_form}>
            <div className={styles.intro_container}>
                <div className={styles.title}>
                <h2>
                    차에 대해 몰라도 괜찮아요.
                    <br />
                    AI가 추천해드릴게요.
                </h2>
                <h4>
                    <img src="./images/common/logo_w.svg" className={styles.logo_icon} alt="logo" />
                    AI가
                    <br />
                    당신에게 맞는 차량을 추천할 수 있도록
                    <br />
                    취향을 몇 가지 골라주세요.
                </h4>
                <p className={styles.green}>최소 3개 이상 선택해주세요.</p>
                </div>

                <div className={styles.checkbox_container}>
                <ul className={styles.checkbox_list}>
                    {optionsList.map((opt) => (
                    <li key={opt.id}>
                        <input
                        type="checkbox"
                        id={opt.id}
                        checked={selected.includes(opt.value)}
                        className={styles.opt_chk}
                        onChange={() => toggleOption(opt.value)}
                        />
                        <label htmlFor={opt.id} className={styles.opt_label}>{opt.label}</label>
                    </li>
                    ))}
                </ul>
                </div>

                <div className={styles.btn_container}>
                  <div className={`${styles.info} ${selected.length > 0 ? styles.active : ""}`}>
                    <p className={styles.selno}>
                      <span>{selected.length}</span>개 선택됨
                    </p>
                    <button type="button" onClick={goHome} className={styles.pass}>
                      건너뛰기
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`${styles.nextBtn} ${selected.length >= 3 ? styles.active : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "생각 중..." : <img src="./images/intro/intro_btn.svg" alt="next" />}
                  </button>
              </div>
            </div>
        </form>
    </div>
  );
}

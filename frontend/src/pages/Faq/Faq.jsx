import { useEffect, useState } from "react";
import axios from "axios";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/faq.css";
import { set } from "react-hook-form";

export default function Faq() {

    //전체 조회 기본값
    const [category, setCategory] = useState("");
    const [keyword, setKeyword] = useState("");
    const [faqs, setFaqs] = useState([]);
    const [openId, setOpenId] = useState(null);

    const fetchFaqs = async () => {
        try {
            const res = await axios.get("/api/faq", {
                params: {
                    category: category || null,
                    keyword: keyword || null
                },
            });
            setFaqs(res.data);
        } catch (err) {
            console.error("FAQ 조회 실패", err);
            setFaqs([]);
        }
    };

    //category, keyword 변경 시 자동 조회
    useEffect(() => {
        fetchFaqs();
        setOpenId(null); // 카테고리 변경 시 열림 초기화
    }, [category, keyword]);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="page-wrapper">
            <div className="faq-container">
                <ContentTopLogo title="자주 묻는 질문"
                    titleStyle={"text-center mb-6 text-xl font-bold"} />
                <div className="faq-search-wrapper">
                    <input
                        className="faq-search"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="faq-search-btn"
                        onClick={fetchFaqs}
                    >
                        🔍
                    </button>
                </div>

                {/* 카테고리 버튼 */}
                <div className="faq-categories">
                    <button
                        className={category === "" ? "active" : ""}
                        onClick={() => setCategory("")}
                    >
                        전체
                    </button>
                    <button
                        className={category === "reservation" ? "active" : ""}
                        onClick={() => setCategory("reservation")}
                    >
                        예약 · 결제
                    </button>
                    <button
                        className={category === "usage" ? "active" : ""}
                        onClick={() => setCategory("usage")}
                    >
                        대여 · 반납 · 이용
                    </button>
                    <button
                        className={category === "insurance" ? "active" : ""}
                        onClick={() => setCategory("insurance")}
                    >
                        보험 · 사고
                    </button>
                    <button
                        className={category === "short" ? "active" : ""}
                        onClick={() => setCategory("short")}
                    >
                        단기렌트
                    </button>
                    <button
                        className={category === "long" ? "active" : ""}
                        onClick={() => setCategory("long")}
                    >
                        장기렌트
                    </button>
                    <button
                        className={category === "etc" ? "active" : ""}
                        onClick={() => setCategory("etc")}
                    >
                        기타 서비스
                    </button>
                </div>

                {/* FAQ 리스트 */}
                <ul className="faq-list">
                    {faqs.length === 0 && (
                        <li className="no-faq">검색 결과가 없습니다.</li>
                    )}

                    {faqs.map((faq) => (
                        <li key={faq.id} className="faq-item">
                            <div
                                className="faq-question"
                                onClick={() => handleToggle(faq.id)}
                            >
                                Q. {faq.question}
                            </div>

                            {openId === faq.id && (
                                <div className="faq-answer">{faq.answer}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
}
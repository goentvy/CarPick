import { useEffect, useState } from "react";
import axios from "axios";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/faq.css";

export default function Faq() {
    const [category, setCategory] = useState("");
    const [keyword, setKeyword] = useState("");
    const [faqs, setFaqs] = useState([]);
    const [openId, setOpenId] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchFaqs = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/faq`,
                {
                    params: {
                        page,
                        category: category || null,
                        keyword: keyword || null,
                    },
                }
            );

            setFaqs(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (e) {
            if (e.response?.data?.message) {
                alert(e.response.data.message);
            } else {
                alert("서버 오류가 발생했습니다.");
            }
            setFaqs([]);
        }
    };

    useEffect(() => {
        setPage(0);
    }, [category, keyword]);

    useEffect(() => {
        fetchFaqs();
        setOpenId(null);
    }, [page, category, keyword]);

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="page-wrapper">
            <div className="faq-container">

                <ContentTopLogo
                    title="자주 묻는 질문"
                    titleStyle="text-center mb-6 text-xl font-bold"
                />

                {/* 검색 */}
                <div className="faq-search-wrapper">
                    <input
                        className="faq-search"
                        placeholder="검색어를 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button className="faq-search-btn">🔍</button>
                </div>

                {/* 카테고리 */}
                <div className="faq-categories">
                    {[
                        ["", "전체"],
                        ["reservation", "예약 · 결제"],
                        ["usage", "대여 · 반납 · 이용"],
                        ["insurance", "보험 · 사고"],
                        ["short", "단기렌트"],
                        ["long", "장기렌트"],
                        ["etc", "기타 서비스"],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            className={category === value ? "active" : ""}
                            onClick={() => setCategory(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* FAQ 리스트 */}
                <ul className="faq-list">
                    {faqs.length === 0 && (
                        <li className="no-faq">검색 결과가 없습니다.</li>
                    )}

                    {faqs.map((faq) => (
                        <li key={faq.id} className="faq-item">
                            <div
                                className={`faq-question ${openId === faq.id ? "open" : ""}`}
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

                {/* 페이징 (2페이지 이상일 때만) */}
                {totalPages > 1 && (
                    <div className="faq-pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={page === i ? "active" : ""}
                                onClick={() => setPage(i)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// src/pages/inquiry/Inquiry.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/inquiry.css";
import useUserStore from "../../store/useUserStore";
import axios from "axios";

export default function InquiryPage() {
    const navigate = useNavigate();

    // 로그인 정보
    const { user, isLoggedIn, accessToken } = useUserStore();
    const isLogin = isLoggedIn;

    // form state
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 비로그인 화면
    if (!isLogin) {
        return (
            <div className="page-wrapper">
                <div className="inquiry-container guest">

                    <section className="inquiry-header">
                        <h2 className="inquiry-title">일대일 문의하기</h2>
                    </section>

                    <p className="guest-desc">로그인 후 이용해주세요.</p>

                    <div className="guest-buttons">
                        <button className="btn-primary" onClick={() => navigate("/login")}>
                            로그인
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => navigate("/signup/agree")}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // inquiry api 호출
    const submitInquiry = async () => {
        const response = await axios.post(
            "/api/inquiry",
            {
                category,
                title,
                content
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        return response.data;
    };

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitInquiry();

            if (result.inquiryId) {
                navigate("/cs/inquiry/success");
            } else {
                alert("문의 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

    // cancel handler
    const handleCancel = () => {
        navigate("/home");
    };

    return (
        <div className="page-wrapper">
            <div className="inquiry-container">

                <section className="inquiry-header">
                    <h2 className="inquiry-title">일대일 문의하기</h2>
                </section>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>카테고리: </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="longterm">장기렌트</option>
                            <option value="reservation">예약문의</option>
                            <option value="payment">결제문의</option>
                            <option value="cancel">취소/환불</option>
                            <option value="etc">기타</option>
                        </select>
                    </div>

                    <div>
                        <label>문의 제목: </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <label>문의 내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    {category === "longterm" && (
                        <small style={{ display: "block", marginTop: "4px", color: "#6b7280", lineHeight: "1.4" }}>
                            예) 희망 차량 / 옵션 / 계약 기간 / 성함 / 연락처 / 기타 요청사항
                        </small>
                    )}

                    <button type="submit">제출</button>
                    <button type="button" onClick={handleCancel}>
                        취소
                    </button>
                </form>
                <p className="privacy-note">
                    문의 접수 시 개인정보는{" "}
                    <Link to="/cs/inquiry/privacy" className="link">
                        개인정보처리방침
                    </Link>
                    에 따라 처리됩니다.
                </p>
                <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "10px", lineHeight: "1.4", textAlign: "center" }}>
                    작성해주신 문의는 확인되는 대로 24시간 내에 안내드리며,
                    <br />문의 내용에 따라 조금 더 소요될 수 있는 점 양해 부탁드립니다.
                </p>
            </div>
        </div>
    );
}

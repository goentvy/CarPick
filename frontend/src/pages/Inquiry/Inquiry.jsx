// src/pages/inquiry/Inquiry.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/inquiry.css";
import useUserStore from "../../store/useUserStore";
import axios from "axios";

// ⭐ 임시 mock (QnAlist에서 사용 중)
export const mockInquiries = [];


export default function InquiryPage() {
    const navigate = useNavigate();

    // 로그인 정보
    const { user, isLoggedIn } = useUserStore();
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
                    <ContentTopLogo
                        title="일대일 문의하기"
                        titleStyle={"text-center mb-6 text-xl font-bold"}
                    />

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
        const response = await axios.post("/api/inquiry", {
            userId: user.id,
            category,
            title,
            content
        });

        return response.data;
    };

    // submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitInquiry();

            if (result.success) {
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
                <ContentTopLogo
                    title="일대일 문의하기"
                    titleStyle={"text-center mb-6 text-xl font-bold"}
                />

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>카테고리: </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">선택하세요</option>
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

                    <div>
                        <label>문의 내용: </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

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
            </div>
        </div>
    );
}

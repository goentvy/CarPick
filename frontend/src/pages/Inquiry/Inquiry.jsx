// src/pages/inquiry/Inquiry.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/inquiry.css";

// 🔹 파일 상단에 전역 Mock 배열 (나중에 API로 대체) 임승우 작업 지현님이 문의하기 작업하신거 프론트 메모리에 저장되서 Mock 볼수있게 수정 했습니다 
export const mockInquiries = [];

export default function InquiryPage() {
    const isLogin = true;
    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

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

    // 제출하기 (임시로 mockInquiries에 저장)
    const submitInquiry = async ({ category, title, content }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newItem = {
            id: Date.now(),
            category,
            title,
            content,
            createdAt: new Date().toISOString(),
            status: "PENDING",
        };

        mockInquiries.unshift(newItem); // 가장 최근 것이 위로 오게[web:1021]
        return {
            success: true,
            inquiryId: newItem.id,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitInquiry({ category, title, content });

            if (result.success) {
                navigate("/mypage/qna"); // 성공 후 내역 화면으로 바로 이동
            } else {
                alert("문의 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

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

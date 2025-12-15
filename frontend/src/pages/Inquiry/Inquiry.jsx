import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/inquiry.css";

export default function InquiryPage() {
    const isLogin = true;
    const navigate = useNavigate();

    // 문의 form state
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 비회원 화면
    if (!isLogin) {
        return (
            <div className="page-wrapper">
                <div className="inquiry-container guest">

                    <ContentTopLogo
                        title="일대일 문의하기"
                        //logoStyle={"h-10 sm:h-12"}
                        titleStyle={"text-center mb-6 text-xl font-bold"}
                    />

                    <p className="guest-desc">로그인 후 이용해주세요.</p>

                    <div className="guest-buttons">
                        <button className="btn-primary"
                            onClick={() => navigate("/login")}>
                            로그인
                        </button>
                        <button className="btn-secondary"
                            onClick={() => navigate("/signup/agree")}>
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 제출하기
    const submitInquiry = async ({ category, title, content }) => {
        // 🔥 지금은 가짜 응답
        await new Promise((resolve) => setTimeout(resolve, 500)); // 서버 느낌

        return {
            success: true,
            inquiryId: Date.now(),
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await submitInquiry({ category, title, content });

            if (result.success) {
                navigate("/inquiry/success", {
                    state: { inquiryId: result.inquiryId },
                });
            } else {
                alert("문의 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };


    // 취소하기
    const handleCancel = () => {
        navigate("/home");
    };

    //회원 화면
    return (
        <div className="page-wrapper">
            <div className="inquiry-container">
                <ContentTopLogo
                    title="일대일 문의하기"
                    //logoStyle={"h-10 sm:h-12"}
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

                    <button type="submit">
                        제출
                    </button>

                    <button type="button" onClick={handleCancel}>
                        취소
                    </button>
                </form>

                <p className="privacy-note">
                    문의 접수 시 개인정보는{" "}
                    <Link to="/inquiry/privacy" className="link">
                        개인정보처리방침
                    </Link>
                    에 따라 처리됩니다.
                </p>

            </div>
        </div>
    );
}   
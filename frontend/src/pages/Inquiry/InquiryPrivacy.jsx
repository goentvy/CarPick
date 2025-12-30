import { useNavigate } from "react-router-dom";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import "../../styles/inquiry.css";

export default function InquiryPrivacy() {
    const navigate = useNavigate();
    
    return (
    <div className="page-wrapper">
      <div className="inquiry-container privacy">

        <ContentTopLogo
          title="개인정보처리방침"
          titleStyle="text-center mb-6 text-xl font-bold"
        />

        <div className="privacy-content">
          <p>
            본 서비스는 고객 문의 처리를 위해 최소한의 개인정보만을 수집합니다.
          </p>

          <h4>1. 수집 항목</h4>
          <ul>
            <li>회원 고유 식별자 </li>
            <li>문의 카테고리</li>
            <li>문의 제목</li>
            <li>문의 내용</li>
          </ul>

          <h4>2. 수집 목적</h4>
          <p>
            고객 문의 응대 및 서비스 품질 개선을 위한 참고 자료로 활용됩니다.
          </p>

          <h4>3. 보유 및 이용 기간</h4>
          <p>
            문의 처리 완료 후 최대 1년간 보관되며, 이후 지체 없이 파기됩니다.
          </p>

          <h4>4. 제3자 제공</h4>
          <p>
            수집된 개인정보는 외부에 제공되지 않습니다.
          </p>

          <h4>5. 이용자 권리</h4>
          <p>
            이용자는 언제든지 문의 내역 삭제를 요청할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary back-btn"
          onClick={() => navigate("/cs/inquiry")}
        >
            돌아가기
        </button>

      </div>
    </div>
  );
}

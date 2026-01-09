import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Check, ChevronRight, X } from "lucide-react"; // X 아이콘 추가
import GuideStep from "./GuideStep";
import "../../styles/guide.css";

// 텍스트 파일 임포트
import agree1 from "../../components/txt/agree1.txt?raw";
import agree2 from "../../components/txt/agree2.txt?raw";
import csInfo from "../../components/txt/cs.txt?raw";

function Guide() {
  const [guideList, setGuideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // --- [상태 정의 추가] ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  // 모달 열기 함수
  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // 배경 스크롤 방지
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    fetch("/api/guide")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => setGuideList(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="guide-loading">이용가이드를 불러오는 중입니다...</p>;
  if (error) return <p className="guide-error">이용가이드를 불러올 수 없습니다.</p>;

  return (
    <div className="guide-page pb-24"> {/* 하단 탭 바 겹침 방지 */}
      <div className="guide-header-section">
        <h2>이용가이드</h2>
      </div>

      <div className="guide-content">
        {guideList.map((step, index) => (
          <GuideStep key={step.step || index} data={step} />
        ))}

        <section className="guide-finish-section">
          <div className="finish-card">
            <div className="carp-logo-icon">
              <div className="blue-circle">
                <Car size={28} className="car-icon" />
                <div className="check-badge">
                  <Check size={12} strokeWidth={4} />
                </div>
              </div>
            </div>

            <div className="finish-text">
              <h3>모든 가이드를 읽으셨습니다!</h3>
              <p>이제 카픽과 함께<br />가장 가벼운 여행을 시작해볼까요?</p>
            </div>

            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate('/home');
              }}
              className="booking-cta-button"
            >
              지금 차량 예약하기
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="guide-footer-info">
            <div className="footer-links">
              <span onClick={() => openModal("이용약관📄", agree1)}>이용약관</span>
              <span className="divider">|</span>
              <span className="bold" onClick={() => openModal("개인정보처리방침🛡️", agree2)}>
                개인정보처리방침
              </span>
              <span className="divider">|</span>
              <span onClick={() => openModal("고객센터📞", csInfo)}>고객센터</span>
            </div>
            <p className="copyright">© 2026 CarP!ck. All rights reserved.</p>
          </div>
        </section>
      </div>

      {/* 모달 영역 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button onClick={closeModal} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <pre>{modalContent}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guide;
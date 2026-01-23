import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import PickupLocationModal from '../../components/common/PickupLocationModal';
import agreeText from "../../components/txt/agree1.txt?raw";
import useUserStore from "../../store/useUserStore";
import "../../styles/lee.css";
import { createGlobalStyle } from "styled-components";

const HideHeaderFooter = createGlobalStyle`
  .fixedAI {
    display: none !important;
  }
`;

function Aipick() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();
  const [pickupLocation, setPickupLocation] = useState('서울역 KTX');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedlinkURL, setSelectedlinkURL] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: "q",
      className: "msg topm main",
      text: "차를 빌리는 순간을, 더 빠르고 더 똑똑하게! 카픽과 함께 가볍게 준비해볼까요?"
    },
    {
      type: "a",
      className: "main a1",
      text: "안녕하세요? 저는 카픽 AI 상담원 입니다. 렌트카, 이용 방법, 차량 추천까지 무엇이든 편하게 물어보세요."
    }
  ]);

  const toggleAgree = () => {
    setAgree(prev => !prev);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setAgree(false);
  };


  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if ((!agree && !isLoggedIn) || !message.trim()) return;

    const userMessage = message;

    // 사용자 메시지
    setChatHistory(prev => [
      ...prev,
      { type: "q", className: "msg main", text: userMessage }
    ]);

    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      setChatHistory(prev => [
        ...prev,
        {
          type: "a",
          className: "main a1",
          text: data.replyMessage,
          linkURL: data.linkURL ?? null
        }
      ]);

      if (data.linkURL) {
        setSelectedlinkURL(data.linkURL);
      }

    } catch {
      setChatHistory(prev => [
        ...prev,
        {
          type: "a",
          className: "main a1",
          text: "잠시 후 다시 시도해주세요."
        }
      ]);
    }
  };

  return (
    <>
      <HideHeaderFooter />
      <section id="chatAi">
        <div className="chatContent" id="chatHistory">
          {chatHistory.map((item, index) => (
            <div key={index} className={`${item.type} ${item.className}`}>
              {item.type === "a" && <span></span>}

              {/* 1️⃣ replyMessage만 출력 */}
              <p className="chatText">{item.text}</p>

              {/* 2️⃣ linkURL이 있을 때만 버튼 표시 */}
              {item.type === "a" && item.linkURL && (
                <button
                  className="btn btn-recommend"
                  onClick={() => navigate(item.linkURL)}
                >
                  바로가기
                </button>
              )}
            </div>
          ))}
        </div>


        <div className="chatQuestion">
          {!isLoggedIn && (
            <label className="agreeLabel">
              <input
                type="checkbox"
                className="agree"
                checked={agree}
                onChange={toggleAgree}
              />
              이용약관에 동의합니다.
            </label>
          )}

          <input
            type="text"
            id="que"
            className="que"
            placeholder="메세지를 입력하세요."
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            id="sendBtn"
            type="button"
            className="btn"
            onClick={sendMessage}
            disabled={!agree || !message.trim()}
          >
            전송
          </button>
        </div>
      </section>

      {!isLoggedIn && showPopup && (
        <section id="popup" style={{ display: "flex" }}>
          <div className="bg" onClick={closePopup}></div>

          <div className="inner">
            <button className="btn btn-close" onClick={closePopup}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="content">
              <h3>서비스 이용약관 동의 (필수)</h3>

              <div className="scroll">
                <pre>{agreeText}</pre>
              </div>

              <div className="btns">
                <button
                  type="button"
                  className="btn btn-agree"
                  onClick={() => {
                    setAgree(true);
                    setShowPopup(false);
                  }}
                >
                  동의
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>

  );
}

export default Aipick;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RentDateRangePicker from '../../components/common/RentDateRangePicker';
import PickupLocationModal from '../../components/common/PickupLocationModal';
import agreeText from "../../components/txt/agree1.txt?raw";
import useUserStore from "../../store/useUserStore";
import "../../styles/lee.css";

function Aipick() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();
  const [pickupLocation, setPickupLocation] = useState('서울역 KTX');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState(null);

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
      text: "원하는 렌트카를 찾기 어려우신가요? 조건만 말씀해주시면 딱 맞는 차량을 추천해드릴게요."
    },
    {
      type: "a",
      className: "main a1",
      text: "안녕하세요! 렌트카 선택을 도와주는 카픽 AI 입니다."
    },
    {
      type: "a",
      className: "main a2",
      text: "여행, 출퇴근, 가족 이동 등 어떤 상황인지 알려주시면 가장 적합한 차종을 추천해드릴게요."
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
          carType: data.carType ?? null
        }
      ]);

      if (data.carType) {
        setSelectedCarType(data.carType);
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
      <section id="chatAi">
        <div className="chatContent" id="chatHistory">
          {chatHistory.map((item, index) => (
            <div key={index} className={`${item.type} ${item.className}`}>
              {item.type === "a" && <span></span>}

              {/* 1️⃣ replyMessage만 출력 */}
              <p className="chatText">{item.text}</p>

              {/* 2️⃣ carType이 있을 때만 버튼 표시 */}
              {item.type === "a" && item.carType && (
                <button
                  className="btn btn-recommend"
                  onClick={() => setShowPickupModal((prev) => !prev)}
                >
                  추천차량 보러가기
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

      {/* 픽업 장소 모달 */}
      {showPickupModal && (
        <PickupLocationModal
          onClose={() => setShowPickupModal(false)}
          onSelect={(loc) => {
            setPickupLocation(loc);
            setShowPickupModal(false);
            setShowDatePicker(true); // 장소 선택 후 달력 모달 활성화
          }}
        />
      )}

      {/* 달력 모달 */}
      {showDatePicker && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg w-full">
          <RentDateRangePicker
            onChange={(selection) => {
              setDateRange({
                startDate: selection.startDate,
                endDate: selection.endDate,
              });
              setShowDatePicker(false); // 달력 모달 닫기

              const params = new URLSearchParams({
                pickupLocation,
                startDate: selection.startDate.toISOString(),
                endDate: selection.endDate.toISOString(),
                CarType: selectedCarType
              });
              navigate(`/day?${params.toString()}`);
            }}
            type="short"
            location="aipick"
            onClose={() => setShowDatePicker(false)}
          />
        </div>
      )}
    </>

  );
}

export default Aipick;

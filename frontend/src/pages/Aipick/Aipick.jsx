import { useNavigate } from "react-router-dom";
import { useState } from "react";
import agreeText from "../../components/txt/agree1.txt?raw";
import "../../styles/lee.css";

function Aipick() {
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

  const sendMessage = () => {
    if (!agree || !message.trim()) return;

    setChatHistory(prev => [
      ...prev,
      {
        type: "q",
        className: "msg main",
        text: message
      }
    ]);

    setMessage("");
  };

  return (
    <>
        <section id="chatAi">
        <div className="chatContent" id="chatHistory">
            {chatHistory.map((item, index) => (
                <div key={index} className={`${item.type} ${item.className}`}>
                {item.type === "a" && <span></span>}
                <p className="chatText">{item.text}</p>
                </div>
            ))}
        </div>

        <div className="chatQuestion">
            <label className="agreeLabel">
            <input
                type="checkbox"
                className="agree"
                checked={agree}
                onChange={toggleAgree}
            />
            이용약관에 동의합니다.
            </label>

            <input
            type="text"
            id="que"
            className="que"
            placeholder="메세지를 입력하세요."
            value={message}
            onChange={handleInputChange}
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

        {showPopup && (
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

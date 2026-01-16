import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import agreeTextFile from '../../components/txt/agree2.txt?raw';
import "../../styles/lee.css";

function AgreeRow() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = () => {
    navigate(-1); // 한 단계 뒤로 이동
  };

  return (
    <div id="content">
      <div className="agree-row">
        <h2>개인정보처리방침</h2>
        <p>{agreeTextFile}</p>
        <button className="btn" onClick={goBack}>돌아가기</button>
      </div>
    </div>
  );
}

export default AgreeRow;

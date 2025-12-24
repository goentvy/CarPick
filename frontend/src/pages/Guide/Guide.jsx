import { useEffect, useState } from "react";
import GuideStep from "./GuideStep"; // 외부 파일 임포트
import "../../styles/guide.css";

function Guide() {
  const [guideList, setGuideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/guide")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        setGuideList(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="guide-loading">이용가이드를 불러오는 중입니다...</p>;
  if (error) return <p className="guide-error">이용가이드를 불러올 수 없습니다.</p>;

  return (
    <div className="guide-page">
      <div className="guide-header-section">
        <h2>이용가이드</h2>
      </div>

      <div className="guide-content">
        {guideList.map((step, index) => (
          // key값으로 step 번호가 중복될 가능성이 있다면 index를 함께 사용하세요.
          <GuideStep key={step.step || index} data={step} />
        ))}
      </div>
    </div>
  );
}

export default Guide;
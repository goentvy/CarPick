import { useEffect, useState } from "react";
import GuideStep from "./GuideStep";

function Guide() {
  const [guideList, setGuideList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/guide")
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

  if (loading) {
    return <p>이용가이드를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>이용가이드를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="guide-page">
      <h2>이용가이드</h2>

      {guideList.map((step) => (
        <GuideStep key={step.step} data={step} />
      ))}
    </div>
  );
}

export default Guide;

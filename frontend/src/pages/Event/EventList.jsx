import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventSection() {
  const [showEnded, setShowEnded] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;


  // 이벤트 리스트 불러오기
  const fetchEvents = () => {
    setLoading(true);
    const url = showEnded ? "https://admin.carpick.p-e.kr/api/event/ended" : "https://admin.carpick.p-e.kr/api/event"; // 스위치 상태에 따라 URL 변경
    axios
      .get(url)
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchEvents();
  }, [showEnded]);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = events.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );



  return (
    <div id="content">
      <div className="event-row">
        <div className="title">
          <h2>이벤트</h2>
        </div>

        <div className="eventWrap">
          <div className="endEvent mt-4 mb-4">
            <label className="flex items-center cursor-pointer">
              <span className="text flex items-center justify-between w-full select-none">
                종료된 이벤트 보기
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showEnded}
                  onChange={() => setShowEnded(!showEnded)}
                  className="sr-only"
                />
                <div
                  className={`block w-10 h-6 rounded-full transition-colors ${showEnded ? "bg-blue-600" : "bg-gray-300"
                    }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showEnded ? "translate-x-4" : "translate-x-0"
                    }`}
                ></div>
              </div>
            </label>
          </div>

          {/* 이벤트 리스트 */}
          <div className="eventList">
            <ul>
              {currentEvents.length > 0 ? (
                currentEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="pb-5 mb-5 flex flex-col"
                    onClick={() => navigate(`/event/view/${ev.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="thumb w-full h-full overflow-hidden rounded-md">
                      <img
                        src={`/upload/event/${ev.thumbnail}`}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="txtbox mt-5">
                      <h3 className="font-semibold text-lg mb-2">
                        {ev.title}
                      </h3>
                      <span className="date text-gray-400 text-sm font-light">
                        {ev.startDate} ~ {ev.endDate}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
              )}

            </ul>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-page ${currentPage === page ? "active" : ""}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

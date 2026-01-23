import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function EventView() {
    const { id } = useParams();       // URL에서 :id 가져오기
    const [event, setEvent] = useState(null);

    useEffect(() => {
        // /api/event/{id} 호출
        axios
            .get(`https://admin.carpick.p-e.kr/api/event/${id}`)
            .then((res) => {
                setEvent(res.data);   // 받아온 데이터 저장
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    if (!event) {
        return <p className="text-red-500"></p>;
    }

    return (
        <div id="content">
            <div className="event-row">
                <div className="title event-view-top">
                    <h2 className="flex">이벤트</h2>
                    <div className="btns flex justify-end">
                        <div className="flex items-center cursor-pointer mt-4 mb-4">
                            <Link
                                to="/event/list"
                                className="btn-list"
                            >
                                목록으로
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="eventWrap">
                    <div className="eventInfo p-3 mt-3 mb-3">
                        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                        <p className="date text-gray-400 text-sm font-light">
                            {event.startDate} ~ {event.endDate}
                        </p>
                    </div>
                    <div
                        className="eventContent w-full h-full overflow-hidden rounded-md"
                        dangerouslySetInnerHTML={{ __html: event.content }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

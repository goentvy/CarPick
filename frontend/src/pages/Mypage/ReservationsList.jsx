// src/pages/Mypage/ReservationsList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const STATUS_MAP = {
  PENDING: { label: "결제 대기", color: "text-yellow-600" },
  CONFIRMED: { label: "예약 확정", color: "text-blue-600" },
  ACTIVE: { label: "이용 중", color: "text-green-600" },
  COMPLETED: { label: "이용 완료", color: "text-gray-500" },
  CANCELED: { label: "예약 취소", color: "text-red-500" },
  CHANGED: { label: "예약 변경", color: "text-purple-600" },
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  return `${year}. ${month}. ${day} (${weekday})`;
};

const formatPrice = (price) => {
  if (!price) return "0";
  return Number(price).toLocaleString();
};

function ReservationsList() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/mypage/reservations-list");
        setReservations(res.data);
      } catch (err) {
        console.error("예약 목록 조회 실패:", err);
        setError("예약 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

    const handleCancel = async (e, reservationId) => {
        e.stopPropagation();
        if (!window.confirm("예약을 취소하시겠습니까?")) return;

        const reservation = reservations.find(r => r.reservationId === reservationId);

        try {
            await api.post(`/mypage/reservations/${reservationId}/cancel`, {
                action_type: 'CANCEL',
                old_start_date: reservation.startDate,
                old_end_date: reservation.endDate,
                old_car_name: `${reservation.brand} ${reservation.displayNameShort}`,
                reason: '사용자 취소 요청'
            });

            // UI 즉시 업데이트
            setReservations(prev =>
                prev.map(r => r.reservationId === reservationId
                    ? { ...r, reservationStatus: 'CANCELED' }
                    : r
                )
            );
            alert("예약이 취소되었습니다.");
        } catch (err) {
            console.error("취소 실패:", err);
            alert("취소에 실패했습니다. 다시 시도해주세요.");
        }
    };

  const handleChange = (e, reservationId) => {
    e.stopPropagation();
    // TODO: 변경 페이지로 이동
    console.log("변경:", reservationId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">예약 내역을 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">예약 내역</h2>

      {reservations.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((item) => {
            const status = STATUS_MAP[item.reservationStatus] || {
              label: item.reservationStatus,
              color: "text-gray-600",
            };

            const isCancelable = ["PENDING", "CONFIRMED"].includes(item.reservationStatus);
            const isChangeable = ["PENDING", "CONFIRMED"].includes(item.reservationStatus);

            return (
              <div key={item.reservationId} className="bg-white rounded-lg shadow-sm">
                {/* 상단: 날짜 + 상세보기 링크 */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <span className="font-bold text-[15px]">
                    {formatDate(item.startDate)} 예약
                  </span>
                  <button
                    onClick={() => navigate(`/Mypage/Reservations/${item.reservationId}`)}
                    className="text-sm text-[#1D6BF3] hover:underline"
                  >
                    예약 상세보기 &gt;
                  </button>
                </div>

                {/* 본문: 차량 정보 + 버튼들 */}
                <div className="p-4 flex">
                  {/* 왼쪽: 차량 정보 */}
                  <div className="flex-1">
                    {/* 상태 + 대여기간 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-600">
                        {formatDate(item.endDate)} 반납 예정
                      </span>
                    </div>

                    {/* 차량명 */}
                    <p className="text-[14px] text-gray-800 mb-1">
                      {item.brand} {item.displayNameShort}
                    </p>

                    {/* 금액 */}
                    <p className="text-[14px] text-gray-800">
                      <span className="font-bold">{formatPrice(item.totalAmountSnapshot)}</span>
                      <span className="text-gray-500"> 원</span>
                    </p>
                  </div>

                  {/* 오른쪽: 버튼들 */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/Mypage/ReservationsList/${item.reservationId}`)}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      상세보기
                    </button>

                    {isCancelable && (
                      <button
                        onClick={(e) => handleCancel(e, item.reservationId)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        취소하기
                      </button>
                    )}

                    {isChangeable && (
                      <button
                        onClick={(e) => handleChange(e, item.reservationId)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        변경하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReservationsList;
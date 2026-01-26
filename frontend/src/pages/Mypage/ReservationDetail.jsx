// src/pages/Mypage/ReservationDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const STATUS_MAP = {
  PENDING: "결제 대기",
  CONFIRMED: "예약 확정",
  ACTIVE: "이용 중",
  COMPLETED: "이용 완료",
  CANCELED: "예약 취소",
  CHANGED: "예약 변경",
};

const formatDateTime = (s) => {
  if (!s) return "-";
  const d = new Date(s);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatPrice = (n) => Number(n || 0).toLocaleString();

export default function ReservationDetail() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        //  여기 경로가 핵심
        const res = await api.get(`/mypage/reservations-list/${reservationId}`);
        setDetail(res.data);
      } catch (err) {
        console.error("예약 상세 조회 실패:", err);
        setError("예약 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-gray-600">상세 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[640px] mx-auto p-4">
        <button
          className="text-sm text-blue-600 hover:underline mb-3"
          onClick={() => navigate("/mypage/reservations")}
        >
          ← 목록으로
        </button>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="max-w-[640px] mx-auto p-4">
      <button
        className="text-sm text-blue-600 hover:underline mb-3"
        onClick={() => navigate("/mypage/reservations")}
      >
        ← 목록으로
      </button>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[13px] text-gray-500">예약번호</p>
            <p className="font-semibold">{detail.reservationNo}</p>
          </div>
          <span className="text-sm font-bold text-blue-600">
            {STATUS_MAP[detail.reservationStatus] || detail.reservationStatus}
          </span>
        </div>

        <div>
          <p className="text-[13px] text-gray-500 mb-1">차량</p>
          <p className="font-semibold">
            {detail.brand} {detail.displayNameShort}
          </p>
          <p className="text-sm text-gray-600">
            {detail.carClass} · {detail.modelName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[12px] text-gray-500">대여 시작</p>
            <p className="text-sm font-medium">{formatDateTime(detail.startDate)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[12px] text-gray-500">반납 예정</p>
            <p className="text-sm font-medium">{formatDateTime(detail.endDate)}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[12px] text-gray-500">총 결제금액</p>
          <p className="text-lg font-bold">
            {formatPrice(detail.totalAmountSnapshot)}원
          </p>
        </div>

        {/* MVP용으로 요금 breakdown은 “접었다 펼치기”로 나중에 확장 가능 */}
        <details className="bg-white rounded-lg">
          <summary className="cursor-pointer text-sm text-gray-700">
            요금 상세 보기
          </summary>
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>기본 대여료</span>
              <span>{formatPrice(detail.baseRentFeeSnapshot)}원</span>
            </div>
            {/*  악성재고 할인할때 적용 */}
            {/* <div className="flex justify-between">
              <span>기본 할인</span>
              <span>-{formatPrice(detail.rentDiscountAmountSnapshot)}원</span>
            </div> */}
            <div className="flex justify-between">
              <span>보험료</span>
              <span>{formatPrice(detail.baseInsuranceFeeSnapshot)}원</span>
            </div>
            <div className="flex justify-between">
              <span>옵션</span>
              <span>{formatPrice(detail.optionFeeSnapshot)}원</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>총액</span>
              <span>{formatPrice(detail.totalAmountSnapshot)}원</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

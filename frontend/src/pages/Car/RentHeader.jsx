import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RentDateRangePicker from "../../components/common/RentDateRangePicker";
import PickupLocationModal from "../../components/common/PickupLocationModal";

function calculateMonths(start, end) {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months || 1;
}

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

const DEFAULT_BRANCH_NAME = "픽업 장소 선택";

const RentHeader = ({ type }) => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const query = useMemo(() => new URLSearchParams(locationObj.search), [locationObj.search]);

  // ✅ URL 기반 초기값
  const initialRentType = query.get("rentType") || type || "short";

  const queryStartDate = safeDate(query.get("startDate"));
  const queryEndDate = safeDate(query.get("endDate"));

  const initialDateRange =
    queryStartDate && queryEndDate
      ? {
        startDate: queryStartDate,
        endDate: queryEndDate,
        months: calculateMonths(queryStartDate, queryEndDate),
      }
      : (() => {
        const today = new Date();
        const end =
          initialRentType === "long"
            ? new Date(new Date(today).setMonth(today.getMonth() + 1))
            : new Date(today.getTime() + 24 * 60 * 60 * 1000);

        return {
          startDate: today,
          endDate: end,
          months: initialRentType === "long" ? calculateMonths(today, end) : 1,
        };
      })();

  const [rentType, setRentType] = useState(initialRentType);
  const [pickupBranchName, setPickupBranchName] = useState(
    query.get("pickupBranchName") || DEFAULT_BRANCH_NAME
  );
  const [pickupBranchId, setPickupBranchId] = useState(query.get("pickupBranchId") || "");

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);

  // ✅ type prop이 바뀌면 rentType도 같이 맞춰서 “기준 1개”로 유지
  const prevType = useRef(type);
  useEffect(() => {
    if (!type) return;
    if (prevType.current === type) return;

    const today = new Date();
    if (type === "short") {
      setRentType("short");
      setDateRange({
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        months: 1,
      });
    } else if (type === "long") {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      setRentType("long");
      setDateRange({
        startDate: today,
        endDate: nextMonth,
        months: calculateMonths(today, nextMonth),
      });
    }

    prevType.current = type;
  }, [type]);

  useEffect(() => {
    document.body.style.overflow = showLocationPicker || showDatePicker ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLocationPicker, showDatePicker]);

  const formatDate = (date) =>
    date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getDurationText = () => {
    if (!dateRange.startDate || !dateRange.endDate) return "";
    const diffMs = dateRange.endDate - dateRange.startDate;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `총 ${days}일 ${hours}시간 이용`;
  };

  const getLongTermText = () => {
    if (!dateRange.startDate || !dateRange.endDate) return "";
    const months = dateRange.months || 1;
    const diffMs = dateRange.endDate - dateRange.startDate;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${months}개월 (${days}일)`;
  };

  const buildParams = ({ activeType, startDate, endDate, months }) => {
    const params = new URLSearchParams();

    // ✅ null/빈값 안전 처리
    if (pickupBranchName) params.set("pickupBranchName", pickupBranchName);
    if (pickupBranchId) params.set("pickupBranchId", String(pickupBranchId));

    params.set("rentType", activeType);
    params.set("startDate", startDate.toISOString());
    params.set("endDate", endDate.toISOString());
    params.set("months", String(months || 1));
    return params;
  };

  const go = (activeType, nextRange) => {
    const targetPath = activeType === "long" ? "/year" : "/day";
    const params = buildParams({
      activeType,
      startDate: nextRange.startDate,
      endDate: nextRange.endDate,
      months: nextRange.months,
    });
    navigate(`${targetPath}?${params.toString()}`);
  };

  const handleSearch = () => {
    go(rentType, dateRange);
  };

  return (
    <section className="bg-brand text-center pt-7 pb-9 sm:pb-[37px] px-6 sm:px-[41px] rounded-b-[40px] sm:rounded-b-[60px] relative z-[999]">
      <div className="bg-gray-50 rounded-[28px] relative z-0">
        <div className="relative p-2">
          <div className="flex items-center rounded-[20px] p-1.5 cursor-pointer bg-gray-100">
            <i className="fa-solid fa-magnifying-glass text-[20px] mr-3 self-center max-[500px]:self-start max-[500px]:mt-0.5 "></i>
            <div className="flex flex-col w-full break-keep relative">
              <p
                className="text-left text-gray-800 tracking-tighter text-[16px] font-semibold"
                onClick={() => setShowLocationPicker((prev) => !prev)}
              >
                {pickupBranchName}
              </p>

              <p
                className="flex items-end justify-between text-gray-400 text-[16px] text-left"
                onClick={() => setShowDatePicker((prev) => !prev)}
              >
                <span className="min-w-0 flex-1 max-[500px]:text-[14px]">
                  {/* startDate */}
                  <span className="whitespace-nowrap">
                    {formatDate(dateRange.startDate)}
                  </span>

                  {/* > + endDate 묶음 */}
                  <span className="inline max-[500px]:block">

                    <span className="mx-1 whitespace-nowrap max-[500px]:hidden">
                      &gt;
                    </span>

                    {/* endDate는 내려감 */}
                    <span className="whitespace-nowrap">
                      {formatDate(dateRange.endDate)}
                    </span>
                  </span>
                </span>

                {/* 총 이용시간은 항상 아래 맞춤 */}
                <span className="shrink-0 whitespace-nowrap text-[12px] text-gray-500 h-5">
                  {rentType === "short" ? getDurationText() : getLongTermText()}
                </span>
              </p>
            </div>
          </div>

          {showLocationPicker && (
            <PickupLocationModal
              onClose={() => setShowLocationPicker(false)}
              onSelect={(branchId, branchName) => {
                setPickupBranchName(branchName || DEFAULT_BRANCH_NAME);
                setPickupBranchId(branchId ? String(branchId) : "");
                setShowLocationPicker(false);
                setShowDatePicker(true);
              }}
            />
          )}

          {showDatePicker && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg w-full">
              <RentDateRangePicker
                initialRange={dateRange}
                type={rentType}
                onChange={(selection) => {
                  const nextRange = {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    months: selection.months || 1,
                  };
                  setDateRange(nextRange);
                  setRentType(selection.activeType);
                  setShowDatePicker(false);

                  // ✅ 날짜 선택 즉시 이동
                  go(selection.activeType, nextRange);
                }}
                onClose={() => setShowDatePicker(false)}
                onTabChange={(tab) => setRentType(tab)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RentHeader;

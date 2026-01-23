import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RentDateRangePicker from "../../components/common/RentDateRangePicker";
import PickupLocationModal from "../../components/common/PickupLocationModal";

function calculateMonths(start, end) {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months || 1;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toLocalDateTimeString(d) {
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  );
}

function safeDate(v) {
  if (!v) return null;

  // ✅ "YYYY-MM-DD HH:mm:ss" 파싱 보정
  // Safari/일부 환경에서 " " 파싱이 불안정할 수 있어서 "T"로 치환
  const normalized = String(v).includes(" ") ? String(v).replace(" ", "T") : v;

  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeRentType(v, fallback = "SHORT") {
  const t = String(v || "").toUpperCase();
  if (t === "SHORT" || t === "LONG") return t;
  if (t === "SHORT" || t === "DAY") return "SHORT";
  if (t === "LONG" || t === "MONTH" || t === "YEAR") return "LONG";
  // short/long 같은 소문자도 보정
  if (String(v || "") === "short") return "SHORT";
  if (String(v || "") === "long") return "LONG";
  return fallback;
}

const UNSELECTED_BRANCH_LABEL = "픽업 장소를 선택";

const RentHeader = ({ type, branches = [] }) => {
  const navigate = useNavigate();
  const locationObj = useLocation();
  const query = useMemo(() => new URLSearchParams(locationObj.search), [locationObj.search]);

  // ✅ URL 기반 초기값
  const initialRentType = normalizeRentType(query.get("rentType") || type, "SHORT");

  const queryStartDate = safeDate(query.get("startDateTime") || query.get("startDate"));
  const queryEndDate = safeDate(query.get("endDateTime") || query.get("endDate"));

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
          initialRentType === "LONG"
            ? new Date(new Date(today).setMonth(today.getMonth() + 1))
            : new Date(today.getTime() + 24 * 60 * 60 * 1000);

        return {
          startDate: today,
          endDate: end,
          months: initialRentType === "LONG" ? calculateMonths(today, end) : 1,
        };
      })();

  const [rentType, setRentType] = useState(initialRentType); // SHORT/LONG
  const [pickupBranchName, setPickupBranchName] = useState(query.get("pickupBranchName") || "");
  const [pickupBranchId, setPickupBranchId] = useState(query.get("pickupBranchId") || "");

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);

  // ✅ pickupBranchId 있는데 name 비었으면 branches에서 찾아 채움
  useEffect(() => {
    if (!pickupBranchId) return;
    if (pickupBranchName) return;
    if (!branches?.length) return;

    const found = branches.find((b) => String(b.branchId) === String(pickupBranchId));
    if (!found) return;

    setPickupBranchName(found.branchName || "");
  }, [branches, pickupBranchId, pickupBranchName]);

  // ✅ type prop 변화 대응 (SHORT/LONG으로 맞춤)
  const prevType = useRef(type);
  useEffect(() => {
    if (!type) return;
    if (prevType.current === type) return;

    const mapped = normalizeRentType(type, "SHORT");
    const today = new Date();

    if (mapped === "SHORT") {
      setRentType("SHORT");
      setDateRange({
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        months: 1,
      });
    } else {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      setRentType("LONG");
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

    if (pickupBranchId) params.set("pickupBranchId", String(pickupBranchId));
    params.set("returnBranchId", String(pickupBranchId || "1")); // ✅ 필요하면 따로 상태로 분리
    if (pickupBranchName) params.set("pickupBranchName", pickupBranchName);

    params.set("rentType", activeType); // SHORT/LONG
    params.set("startDateTime", toLocalDateTimeString(startDate));
    params.set("endDateTime", toLocalDateTimeString(endDate));
    params.set("months", String(months || 1));

    return params;
  };

  const go = (activeType, nextRange) => {
    const targetPath = activeType === "LONG" ? "/year" : "/day";
    const params = buildParams({
      activeType,
      startDate: nextRange.startDate,
      endDate: nextRange.endDate,
      months: nextRange.months,
    });
    navigate(`${targetPath}?${params.toString()}`);
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
                {pickupBranchName || UNSELECTED_BRANCH_LABEL}
              </p>

              <p
                className="flex items-end justify-between text-gray-400 text-[16px] text-left"
                onClick={() => setShowDatePicker((prev) => !prev)}
              >
                <span className="min-w-0 flex-1 max-[500px]:text-[14px]">
                  <span className="whitespace-nowrap">{formatDate(dateRange.startDate)}</span>

                  <span className="inline max-[500px]:block">
                    <span className="mx-1 whitespace-nowrap max-[500px]:hidden">&gt;</span>
                    <span className="whitespace-nowrap">{formatDate(dateRange.endDate)}</span>
                  </span>
                </span>

                <span className="shrink-0 whitespace-nowrap text-[12px] text-gray-500 h-5">
                  {rentType === "SHORT" ? getDurationText() : getLongTermText()}
                </span>
              </p>
            </div>
          </div>

          {showLocationPicker && (
            <PickupLocationModal
              onClose={() => setShowLocationPicker(false)}
              onSelect={(branchId, branchName) => {
                const id = branchId ? String(branchId) : "";
                setPickupBranchId(id);
                setPickupBranchName(branchName || "");
                setShowLocationPicker(false);
                if (id) setShowDatePicker(true);
              }}
            />
          )}

          {showDatePicker && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg w-full">
              <RentDateRangePicker
                initialRange={dateRange}
                // ✅ picker가 short/long을 쓰면 여기에서만 매핑해주면 됨
                type={rentType === "SHORT" ? "short" : "long"}
                onChange={(selection) => {
                  // selection.activeType이 short/long이면 변환
                  const activeType = String(selection.activeType).toLowerCase() === "long" ? "LONG" : "SHORT";

                  const nextRange = {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    months: selection.months || 1,
                  };
                  setDateRange(nextRange);
                  setRentType(activeType);
                  setShowDatePicker(false);

                  go(activeType, nextRange);
                }}
                onClose={() => setShowDatePicker(false)}
                onTabChange={(tab) => setRentType(String(tab).toLowerCase() === "long" ? "LONG" : "SHORT")}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RentHeader;

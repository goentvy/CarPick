import { useState, useEffect } from "react";
import RentDateRangePicker from "../../components/common/RentDateRangePicker";
import { useNavigate } from "react-router-dom";
import PickupLocationModal from "../../components/common/PickupLocationModal";

/**
 * ✅ 정책 정리
 * - 기본 픽업 지점: branch_id = 1
 * - 명시적 미선택: branch_id = 0
 * - 지점명은 하드코딩하지 않고(가능하면) branches에서 찾아서 세팅
 */
const HomeRentHeader = ({
  showPickupModal,
  setShowPickupModal,
  selectedCar,
  branches, // ✅ 상위에서 이미 가지고 있는 지점 목록(있으면 가장 좋음)
}) => {
  const navigate = useNavigate();

  const [rentType, setRentType] = useState("short");

  // ✅ 기본값: 1 (김포공항점)
  // ✅ 명시적 미선택: 0
  const [pickupBranchId, setPickupBranchId] = useState(1);
  const [pickupBranchName, setPickupBranchName] = useState(""); // 표시용

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

  // ✅ body 스크롤 락
  useEffect(() => {
    if (showPickupModal || showDatePicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPickupModal, showDatePicker]);

  /**
   * ✅ 지점명 하드코딩 방지
   * - branches가 이미 로드되어 있다면, 기본 id=1의 이름을 여기서 찾아서 채움
   */
  useEffect(() => {
    if (!branches?.length) return;

    // 이름이 이미 있으면 건드리지 않음
    if (pickupBranchName) return;

    // pickupBranchId가 0(미선택)이면 이름 채우지 않음
    if (pickupBranchId === 0) return;

    const found = branches.find((b) => Number(b.branchId) === Number(pickupBranchId));
    if (!found) return;

    setPickupBranchName(found.branchName || "");
  }, [branches, pickupBranchId, pickupBranchName]);

  const formatKST = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    if (!date) return "";
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  };

  const formatDate = (date) =>
    date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });

  const getDurationText = () => {
    const diffMs = dateRange.endDate - dateRange.startDate;
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return `${days}일 ${hours}시간`;
  };

  const handleSearch = (type) => {
    // ✅ "명시적 미선택"일 때만 막기
    if (pickupBranchId === 0) {
      alert("픽업 장소를 선택해주세요.");
      return;
    }

    const isLong = type === "long";
    const m = isLong ? dateRange.months ?? 1 : undefined;

    const params = new URLSearchParams({
      pickupBranchId: String(pickupBranchId),
      returnBranchId: String(pickupBranchId),
      rentType: type,
      startDate: formatKST(dateRange.startDate),
      endDate: formatKST(dateRange.endDate),
      ...(isLong ? { months: String(m) } : {}),
      pickupBranchName: pickupBranchName || "",
      returnBranchName: pickupBranchName || "",
    });

    navigate(`/day?${params.toString()}`);
  };

  const handleRentTypeChange = (type) => {
    const now = new Date();

    if (type === "short") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      setDateRange({
        startDate: now,
        endDate: tomorrow,
        type: "short",
      });
    }

    if (type === "long") {
      const nextMonth = new Date(now);
      nextMonth.setMonth(now.getMonth() + 1);
      setDateRange({
        startDate: now,
        endDate: nextMonth,
        months: 1,
        type: "long",
      });
    }

    setShowDatePicker(false);
    setRentType(type);
  };

  const handleSearchWithDates = (type, startDate, endDate, months) => {
    if (pickupBranchId === 0) return alert("픽업 장소를 선택해주세요.");

    const isLong = type === "long";
    const m = isLong ? Number(months ?? 1) : 0;

    const params = new URLSearchParams({
      pickupBranchId: String(pickupBranchId),
      returnBranchId: String(pickupBranchId),
      rentType: type,
      startDate: formatKST(startDate),
      endDate: formatKST(endDate),
      ...(isLong ? { months: String(m) } : {}),
      pickupBranchName: pickupBranchName || "",
      returnBranchName: pickupBranchName || "",
    });

    navigate(`/day?${params.toString()}`);
  };

  // ✅ 선택 처리 (primitive로만 관리)
  const handleSelectBranch = (branchId, branchName) => {
    const idNum = Number(branchId);

    // 만약 모달에서 "선택 해제" 같은 UX를 넣을 거면 0을 내려주게 하면 됨
    setPickupBranchId(Number.isFinite(idNum) ? idNum : 0);
    setPickupBranchName(branchName || "");
  };

  return (
    <section className="bg-brand text-center xx:pb-[22px] xs:pb-7 sm:pb-[37px] xx:px-6 sm:px-[41px] xx:rounded-b-[40px] xs:rounded-b-[50px] sm:rounded-b-[60px] relative z-999">
      {/* 프로모션 문구 */}
      <button className="xx:hidden sm:inline border border-lime-300 rounded-4xl bg-sky-700 px-3 xx:my-1 sm:my-3">
        <span className="text-xs text-lime-300">✧ AI 기반 즉시 픽업</span>
      </button>

      <p className="xx:text-[28px] sm:text-4xl font-bold text-white xx:mb-0 sm:mb-2">
        도착하면 바로 카픽!
      </p>

      <p className="xx:text-lime-300 sm:text-white text-sm sm:text-base xx:mb-3 sm:mb-6">
        여행의 시작을 가장 가볍게 만드는 AI 모빌리티
      </p>

      {/* 렌트 타입 선택 */}
      <div className="bg-gray-50 rounded-[30px] xx:px-2.5 sm:px-3 pt-3 relative z-0">
        <div className="flex p-[5px] justify-center gap-1 bg-gray-100 rounded-4xl">
          {["short", "long"].map((type) => (
            <button
              key={type}
              onClick={() => handleRentTypeChange(type)}
              className={`flex-1 px-6 py-2 rounded-full font-semibold transition text-sm cursor-pointer ${rentType === type
                ? "bg-brand text-white shadow-md"
                : "text-gray-400 hover:bg-blue-400 hover:text-gray-700"
                }`}
            >
              {type === "short" ? "단기 렌트" : "월 렌트"}
            </button>
          ))}
        </div>

        {/* 픽업 장소 */}
        <div className="pt-2 relative">
          <div
            className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm cursor-pointer"
            onClick={() => setShowPickupModal((prev) => !prev)}
          >
            <img src="./images/common/location.svg" alt="location" className="w-6 h-6 mr-3" />
            <div className="flex flex-col">
              <p className="text-left text-xs text-gray-500">픽업 장소</p>

              <p className="text-gray-800 text-left">
                {pickupBranchId === 0
                  ? "픽업 장소를 선택해주세요"
                  : pickupBranchName || "지점 정보를 불러오는 중..."}
              </p>
            </div>
          </div>

          {/* 픽업 장소 모달 */}
          {showPickupModal && (
            <PickupLocationModal
              onClose={() => setShowPickupModal(false)}
              onSelect={(branchId, branchName) => {
                handleSelectBranch(branchId, branchName);
                setShowPickupModal(false);
                setShowDatePicker(true);
              }}
            />
          )}
        </div>

        {/* 이용 일시: 단기 */}
        {rentType === "short" && (
          <div className="pt-2 relative">
            <div
              className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm cursor-pointer"
              onClick={() => setShowDatePicker((prev) => !prev)}
            >
              <img src="./images/common/calendar.svg" alt="calendar" className="w-6 h-6 mr-3" />
              <div className="flex flex-col w-full">
                <p className="flex justify-between text-xs text-gray-500">
                  <span>이용 일시</span>
                  <span>{getDurationText()}</span>
                </p>
                <p className="text-left text-gray-800 tracking-tighter">
                  {formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}
                </p>
              </div>
            </div>

            {showDatePicker && (
              <div className="absolute left-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg w-full">
                <RentDateRangePicker
                  onChange={(selection) => {
                    setDateRange({
                      startDate: selection.startDate,
                      endDate: selection.endDate,
                    });
                    setShowDatePicker(false);
                    handleSearchWithDates("short", selection.startDate, selection.endDate);
                  }}
                  onClose={() => setShowDatePicker(false)}
                  type="short"
                  location="main"
                  onTabChange={(tab) => setRentType(tab)}
                />
              </div>
            )}
          </div>
        )}

        {/* 이용 일시: 장기 */}
        {rentType === "long" && (
          <div className="pt-2 relative">
            <div
              className="flex items-center bg-gray-100 rounded-lg p-3 shadow-sm cursor-pointer"
              onClick={() => setShowDatePicker((prev) => !prev)}
            >
              <img src="./images/common/calendar.svg" alt="calendar" className="w-6 h-6 mr-3" />
              <div className="flex flex-col w-full">
                <p className="flex justify-between text-xs text-gray-500">
                  <span>이용 일시</span>
                  <span>{dateRange.months}개월</span>
                </p>
                <p className="text-left text-gray-800 tracking-tighter">
                  {formatDate(dateRange.startDate)} &gt; {formatDate(dateRange.endDate)}
                </p>
              </div>
            </div>

            {showDatePicker && (
              <div className="absolute left-0 top-full mt-2 z-50 bg-white border rounded-xl shadow-lg w-full">
                <RentDateRangePicker
                  onChange={(selection) => {
                    const m = selection.months ?? 1;
                    setDateRange({
                      startDate: selection.startDate,
                      endDate: selection.endDate,
                      months: m,
                    });
                    setShowDatePicker(false);
                    handleSearchWithDates("long", selection.startDate, selection.endDate, m);
                  }}
                  onClose={() => setShowDatePicker(false)}
                  type="long"
                  location="main"
                  onTabChange={(tab) => setRentType(tab)}
                />
              </div>
            )}
          </div>
        )}

        {/* 차량 찾기 버튼 */}
        <div className="py-3">
          <button
            className="w-full bg-brand text-white font-bold py-2.5 hover:bg-blue-600 rounded-[50px] cursor-pointer"
            onClick={() => handleSearch(rentType)}
          >
            차량 찾기
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeRentHeader;

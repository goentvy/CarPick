// src/pages/mypage/MyLicense.jsx
import { useState } from "react";

function MyLicense() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState("form"); // form | done
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [licenseData, setLicenseData] = useState(null); // Mock 저장용

    const validateInputs = () => {
        const newErrors = {};
        const name = document.getElementById("driverName").value.trim();
        const birthday = document.getElementById("driverBirthday").value;
        const licenseRaw = document.getElementById("licenseNumber").value;
        const license = licenseRaw.replace(/-/g, "");
        const serial = document.getElementById("serialNumber").value.trim();

        if (!name || name.length < 2) {
            newErrors.name = "성명은 2자 이상 입력하세요";
        }

        if (!birthday) {
            newErrors.birthday = "생년월일을 선택하세요";
        } else {
            const today = new Date();
            const selected = new Date(birthday);
            if (selected >= today) {
                newErrors.birthday = "생년월일을 다시 확인해주세요";
            }
        }

        if (!license || !/^\d{12}$/.test(license)) {
            newErrors.license =
                "면허번호는 하이픈 제외 12자리 숫자여야 합니다 (예: 119012345600)";
        }

        if (!serial || !/^[A-Za-z0-9]{6}$/.test(serial)) {
            newErrors.serial =
                "일련번호는 숫자/영문 6자리입니다 (뒷면 작은 사진 아래)";
        }

        setErrors(newErrors);
        return {
            ok: Object.keys(newErrors).length === 0,
            data: { name, birthday, licenseNumber: licenseRaw, serialNumber: serial },
        };
    };

    const registerLicense = async () => {
        const { ok, data } = validateInputs();
        if (!ok) return;

        setLoading(true);
        setResult("");

        // 실제로는 여기서 백엔드 호출 후 성공 시 setLicenseData 호출
        setTimeout(() => {
            setLicenseData(data);
            setResult(
                "입력하신 정보 형식이 유효합니다.\n\n" +
                "실제 운전 가능 여부는 차량 수령 시 실물 운전면허증으로 최종 확인합니다.\n" +
                "입력 정보와 실물 면허증이 일치하지 않을 경우 예약이 취소되거나 이용이 제한될 수 있습니다."
            );
            setModalStep("done");
            setLoading(false);
        }, 500);
    };

    const openModal = () => {
        setIsModalOpen(true);
        setModalStep("form");
        setResult("");
        setErrors({});
        setLoading(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setResult("");
        setErrors({});
        setLoading(false);
    };

    return (
        <div
            id="content"
            className="font-pretendard"
            style={{
                minHeight: "calc(100vh - 80px - 72px)",
                backgroundColor: "#E7EEFF",
            }}
        >
            {/* 상단 영역 */}
            <div className="px-4 py-4" style={{ backgroundColor: "#2C7FFF" }}>
                <p className="text-sm text-white font-semibold">면허 정보 관리</p>
            </div>

            {/* 본문 영역 */}
            <div className="px-4 py-6 space-y-4">

                {licenseData ? (
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex flex-col">
    <span className="mb-2 text-base font-semibold text-[#1A1A1A]">
      {licenseData.name}
    </span>
                        <div className="text-sm text-[#333333] space-y-1.5 leading-snug">
                            <p className="flex items-center">
                                <span className="w-16 text-[#666666]">생년월일</span>
                                <span>{licenseData.birthday}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="w-16 text-[#666666]">면허번호</span>
                                <span>{licenseData.licenseNumber}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="w-16 text-[#666666]">일련번호</span>
                                <span className="tracking-[0.15em] font-medium">
          {licenseData.serialNumber}
        </span>
                            </p>
                        </div>

                        {/* 카드 우측 하단 작은 버튼들 */}
                        <div className="mt-3 flex justify-end gap-2 text-xs">
                            <button
                                onClick={openModal}
                                className="px-3 py-1.5 rounded-full border border-[#2C7FFF] text-[#2C7FFF] font-medium"
                            >
                                수정하기
                            </button>
                            <button
                                onClick={() => setLicenseData(null)}
                                className="px-3 py-1.5 rounded-full border border-[#FF4B4B] text-[#FF4B4B] font-medium"
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-10 flex items-center justify-center">
                        <p className="text-sm text-[#666666] text-center leading-relaxed">
                            등록된 운전면허 정보가 없습니다.
                            <br />
                            운전면허 등록 시 보다 신속한 렌트가 가능합니다.
                        </p>
                    </div>
                )}

                {/* 카드 밑 배경 영역: 추가하기는 항상 노출 */}
                <button
                    onClick={openModal}
                    className="w-full h-11 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm hover:bg-[#215FCC]"
                >
                    운전 면허 추가하기
                </button>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
                    <div className="w-[90%] max-w-md rounded-2xl bg-white px-5 py-6">
                        {modalStep === "form" && (
                            <>
                                <h3 className="text-base font-semibold text-[#1A1A1A]">
                                    운전면허 정보 입력
                                </h3>
                                <p className="mt-2 text-xs text-[#666666]">
                                    입력하신 운전면허 정보는 형식만 확인하며, 실제 진위 여부는 차량
                                    수령 시 실물 운전면허증으로 최종 확인합니다.
                                </p>

                                <div className="mt-5 space-y-3">
                                    <div>
                                        <input
                                            id="driverName"
                                            placeholder="성명 (2자 이상)"
                                            maxLength={10}
                                            defaultValue={licenseData?.name || ""}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                                errors.name ? "border-[#dc3545]" : "border-[#dddddd]"
                                            }`}
                                        />
                                        {errors.name && (
                                            <small className="mt-1 block text-xs text-[#dc3545]">
                                                {errors.name}
                                            </small>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            id="driverBirthday"
                                            type="date"
                                            max="2010-12-31"
                                            defaultValue={licenseData?.birthday || ""}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                                errors.birthday
                                                    ? "border-[#dc3545]"
                                                    : "border-[#dddddd]"
                                            }`}
                                        />
                                        {errors.birthday && (
                                            <small className="mt-1 block text-xs text-[#dc3545]">
                                                {errors.birthday}
                                            </small>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            id="licenseNumber"
                                            placeholder="면허번호 (예: 11-90-123456-00)"
                                            maxLength={14}
                                            defaultValue={licenseData?.licenseNumber || ""}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                                errors.license
                                                    ? "border-[#dc3545]"
                                                    : "border-[#dddddd]"
                                            }`}
                                        />
                                        {errors.license && (
                                            <small className="mt-1 block text-xs text-[#dc3545]">
                                                {errors.license}
                                            </small>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            id="serialNumber"
                                            placeholder="일련번호 (6자리, 사진 아래)"
                                            maxLength={6}
                                            defaultValue={licenseData?.serialNumber || ""}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm text-center tracking-[0.2em] font-semibold ${
                                                errors.serial
                                                    ? "border-[#dc3545]"
                                                    : "border-[#dddddd]"
                                            }`}
                                        />
                                        {errors.serial && (
                                            <small className="mt-1 block text-xs text-[#dc3545]">
                                                {errors.serial}
                                            </small>
                                        )}
                                        <small className="mt-1 block text-[11px] text-[#666666]">
                                            면허증 뒷면 작은 사진 오른쪽 아래 숫자/영문 6자리입니다.
                                        </small>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    <button
                                        onClick={registerLicense}
                                        disabled={loading}
                                        className={`flex-1 h-11 rounded-xl text-sm font-medium text-white ${
                                            loading
                                                ? "bg-[#6c757d] cursor-not-allowed"
                                                : "bg-[#2C7FFF]"
                                        }`}
                                    >
                                        {loading ? "등록 처리 중..." : "등록하기"}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 h-11 rounded-xl bg-[#e5e5e5] text-sm font-medium text-[#333333]"
                                    >
                                        취소
                                    </button>
                                </div>
                            </>
                        )}

                        {modalStep === "done" && (
                            <>
                                <h3 className="text-base font-semibold text-[#1A1A1A]">
                                    운전면허 정보 등록 완료
                                </h3>
                                <div className="mt-3 rounded-lg border border-[#C8FF48] bg-[#F5FFE0] px-3 py-3 text-xs text-[#2F3B13] whitespace-pre-line">
                                    {result}
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="mt-5 w-full h-11 rounded-xl bg-[#2C7FFF] text-sm font-medium text-white"
                                >
                                    닫기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyLicense;

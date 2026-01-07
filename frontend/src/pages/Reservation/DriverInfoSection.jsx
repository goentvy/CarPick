import { useFormContext } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import useUserStore from "../../store/useUserStore";

const DriverInfoSection = () => {
    const {
        register,
        setValue,
        getValues,
        formState: { errors },
        clearErrors,
        trigger
    } = useFormContext();
    const { accessToken } = useUserStore();

    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState("form");
    const [modalLoading, setModalLoading] = useState(false);

    const hasLicense = licenses.length > 0;

    // 면허 목록 불러오기 + 자동 선택
    useEffect(() => {
        const fetchLicenses = async () => {
            if (!accessToken) {
                setLicenses([]);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/licenses/me", {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-User-Id': useUserStore.getState().user?.id?.toString()
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const licenseList = data?.data?.map((item) => ({
                        id: item.id,
                        name: item.driverName,
                        birthday: item.birthday,
                        licenseNumber: item.licenseNumber,
                        serialNumber: item.serialNumber,
                    })) || [];
                    setLicenses(licenseList);

                    // 첫 번째 면허 자동 선택
                    if (licenseList.length > 0) {
                        handleLicenseSelect(licenseList[0]);
                    }
                }
            } catch (error) {
                console.error("면허 조회 실패:", error);
                setLicenses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLicenses();
    }, [accessToken]);

    // 면허 선택 + 폼 채우기
    const handleLicenseSelect = useCallback((license) => {
        const [lastName, ...firstNameParts] = license.name.trim().split(' ');
        setValue("lastName", lastName || '');
        setValue("firstName", firstNameParts.join(' ') || '');
        setValue("birth", license.birthday.replace(/-/g, ''));
        setValue("phone", "");
        setValue("email", "");
        clearErrors(["lastName", "firstName", "birth", "phone", "email"]);
    }, [setValue, clearErrors]);

    // 모달 제어
    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setModalStep("form");
        ["modal-driverName", "modal-driverBirthday", "modal-licenseNumber", "modal-serialNumber"].forEach(field => {
            setValue(field, "");
        });
        clearErrors(["modal-driverName", "modal-driverBirthday", "modal-licenseNumber", "modal-serialNumber"]);
    }, [setValue, clearErrors]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        clearErrors(["modal-driverName", "modal-driverBirthday", "modal-licenseNumber", "modal-serialNumber"]);
    }, [clearErrors]);

    // 면허 등록 (1개 제한)
    const registerLicense = useCallback(async () => {
        const fields = [
            "modal-driverName",
            "modal-driverBirthday",
            "modal-licenseNumber",
            "modal-serialNumber"
        ];

        const isValid = await trigger(fields);
        if (!isValid) return;

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        setModalLoading(true);
        try {
            const values = getValues();
            const response = await fetch("/api/licenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    driverName: values["modal-driverName"],
                    birthday: values["modal-driverBirthday"],
                    licenseNumber: values["modal-licenseNumber"],
                    serialNumber: values["modal-serialNumber"],
                }),
            });

            const resultData = await response.json();

            if (response.ok && resultData.success) {
                const newLicense = {
                    id: resultData.data.id,
                    name: resultData.data.driverName,
                    birthday: resultData.data.birthday,
                    licenseNumber: resultData.data.licenseNumber,
                    serialNumber: resultData.data.serialNumber,
                };
                setLicenses([newLicense]);
                handleLicenseSelect(newLicense);
                setModalStep("done");
            } else {
                alert(resultData.message || "등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("API 오류:", error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setModalLoading(false);
        }
    }, [accessToken, trigger, getValues, handleLicenseSelect]);

    // 면허 삭제
    const deleteLicense = useCallback(async (licenseId) => {
        if (!window.confirm("이 면허 정보를 삭제하시겠습니까?\n삭제 후 다시 등록해야 합니다.")) {
            return;
        }

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch(`/api/licenses/${licenseId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                setLicenses([]);
                setValue("lastName", "");
                setValue("firstName", "");
                setValue("birth", "");
                setValue("phone", "");
                setValue("email", "");
                alert("면허 정보가 삭제되었습니다.");
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 오류:", error);
            alert("네트워크 오류");
        }
    }, [accessToken, setValue]);

    return (
        <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
            <h2 className="xx:text-base sm:text-lg font-semibold mb-4">면허 선택</h2>

            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm px-5 py-6 flex items-center justify-center h-32">
                    <p className="text-sm text-[#666666]">면허 정보 불러오는 중...</p>
                </div>
            ) : hasLicense ? (
                // ✅ 면허 있음: 선택 표시 + 삭제 버튼
                <>
                    <div className="space-y-3 mb-4">
                        {licenses.map((license) => (
                            <div
                                key={license.id}
                                className="bg-white rounded-2xl shadow-sm px-5 py-4 flex flex-col border-2 border-[#2C7FFF] bg-gradient-to-r from-white to-[#F0F7FF]"
                            >
                                <span className="mb-3 text-base font-semibold text-[#1A1A1A] flex items-center">
                                    {license.name}
                                </span>
                                <div className="text-sm text-[#333333] space-y-1.5 leading-snug mb-4">
                                    <p className="flex items-center">
                                        <span className="w-16 text-[#666666]">생년월일</span>
                                        <span>{license.birthday}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="w-16 text-[#666666]">면허번호</span>
                                        <span className="truncate">{license.licenseNumber}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="w-16 text-[#666666]">일련번호</span>
                                        <span className="tracking-[0.15em] font-medium">{license.serialNumber}</span>
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => deleteLicense(license.id)}
                                        className="px-4 py-2 rounded-full border border-[#FF4B4B] text-[#FF4B4B] text-xs font-medium hover:bg-[#FFF5F5] transition-colors"
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                // ❌ 면허 없음: + 버튼만 표시
                <>
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-8 flex flex-col items-center justify-center mb-6 text-center">
                        <p className="text-sm text-[#666666] mb-4 leading-relaxed">
                            등록된 운전면허 정보가 없습니다.
                        </p>
                        <button
                            onClick={openModal}
                            className="w-20 h-20 rounded-2xl bg-[#2C7FFF] text-white text-3xl font-bold shadow-lg hover:bg-[#215FCC] hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto mb-3"
                        >
                            +
                        </button>
                        <p className="text-xs text-[#999999]">운전면허를 추가하세요</p>
                    </div>
                </>
            )}

            {/* 면허 추가 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
                    <div
                        className="w-[90%] max-w-md rounded-2xl bg-white px-5 py-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalStep === "form" && (
                            <>
                                <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">운전면허 정보 입력</h3>
                                <p className="text-xs text-[#666666] mb-5">차량 수령 시 실물/전자 운전면허증과 확인합니다.</p>

                                <div className="space-y-3">
                                    {/* 성명 */}
                                    <div>
                                        <input
                                            {...register("modal-driverName")}
                                            placeholder="성명 (2자 이상)"
                                            maxLength={10}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none ${
                                                errors["modal-driverName"]
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                    : "border-[#dddddd] focus:border-[#2C7FFF] focus:ring-1 focus:ring-blue-100"
                                            }`}
                                        />
                                        {errors["modal-driverName"] && (
                                            <small className="mt-1 block text-xs text-red-500">
                                                {errors["modal-driverName"].message}
                                            </small>
                                        )}
                                    </div>

                                    {/* 생년월일 */}
                                    <div>
                                        <input
                                            {...register("modal-driverBirthday")}
                                            type="date"
                                            max="2010-12-31"
                                            className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none ${
                                                errors["modal-driverBirthday"]
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                    : "border-[#dddddd] focus:border-[#2C7FFF] focus:ring-1 focus:ring-blue-100"
                                            }`}
                                        />
                                        {errors["modal-driverBirthday"] && (
                                            <small className="mt-1 block text-xs text-red-500">
                                                {errors["modal-driverBirthday"].message}
                                            </small>
                                        )}
                                    </div>

                                    {/* 면허번호 */}
                                    <div>
                                        <input
                                            {...register("modal-licenseNumber")}
                                            placeholder="면허번호 (예: 11-90-123456-00)"
                                            maxLength={14}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none ${
                                                errors["modal-licenseNumber"]
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                    : "border-[#dddddd] focus:border-[#2C7FFF] focus:ring-1 focus:ring-blue-100"
                                            }`}
                                        />
                                        {errors["modal-licenseNumber"] && (
                                            <small className="mt-1 block text-xs text-red-500">
                                                {errors["modal-licenseNumber"].message}
                                            </small>
                                        )}
                                    </div>

                                    {/* 일련번호 */}
                                    <div>
                                        <input
                                            {...register("modal-serialNumber")}
                                            placeholder="일련번호 (6자리)"
                                            maxLength={6}
                                            className={`w-full rounded-lg border px-3 py-2 text-sm text-center tracking-[0.2em] font-semibold transition-colors focus:outline-none ${
                                                errors["modal-serialNumber"]
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                                    : "border-[#dddddd] focus:border-[#2C7FFF] focus:ring-1 focus:ring-blue-100"
                                            }`}
                                        />
                                        {errors["modal-serialNumber"] && (
                                            <small className="mt-1 block text-xs text-red-500">
                                                {errors["modal-serialNumber"].message}
                                            </small>
                                        )}
                                        <small className="mt-1 block text-[11px] text-[#666666]">면허증 뒷면 작은 사진 오른쪽 아래</small>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button
                                        onClick={registerLicense}
                                        disabled={modalLoading}
                                        className={`flex-1 h-11 rounded-xl text-sm font-medium text-white transition-colors ${
                                            modalLoading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-[#2C7FFF] hover:bg-[#215FCC]"
                                        }`}
                                    >
                                        {modalLoading ? "등록 중..." : "등록하기"}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 h-11 rounded-xl bg-gray-100 text-sm font-medium text-[#333] hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                </div>
                            </>
                        )}

                        {modalStep === "done" && (
                            <>
                                <h3 className="text-base font-semibold text-[#1A1A1A]">운전면허 등록 완료</h3>
                                <div className="mt-4 rounded-lg border border-[#C8FF48] bg-[#F5FFE0] px-3 py-3 text-xs text-[#2F3B13] leading-relaxed">
                                    차량 수령시 입력 정보와 실물/전자 면허증이 일치하지 않을 경우 예약이 취소되거나 이용이 제한될 수 있습니다.
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="mt-6 w-full h-11 rounded-xl bg-[#2C7FFF] text-sm font-medium text-white hover:bg-[#215FCC] transition-colors"
                                >
                                    확인
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <p className="mt-4 xx:text-xs sm:text-xs text-purple-600 leading-relaxed">
                차량 수령 시,등록된 면허와 확인 절차가 있습니다 . <br />
                반드시 수령 및 운전할 운전자의 면허를 등록해주세요.
            </p>
        </section>
    );
};

export default DriverInfoSection;

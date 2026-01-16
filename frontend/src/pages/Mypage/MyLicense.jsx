// src/pages/mypage/MyLicense.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

function MyLicense() {
    const navigate = useNavigate();
    const { accessToken } = useUserStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState("form");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [licenses, setLicenses] = useState([]);
    const [hasLicense, setHasLicense] = useState(false);

    // 면허번호 자동 하이픈 함수 (입력 시: 12자리 + 3하이픈 = 15자리)
    const handleLicenseNumberInput = (e) => {
        const value = e.target.value.replace(/-/g, "");
        const onlyNumbers = value.replace(/\D/g, "");
        const limited = onlyNumbers.slice(0, 12);

        let formatted = "";
        if (limited.length > 0) formatted += limited.slice(0, 2);
        if (limited.length > 2) formatted += "-" + limited.slice(2, 4);
        if (limited.length > 4) formatted += "-" + limited.slice(4, 10);
        if (limited.length > 10) formatted += "-" + limited.slice(10, 12);

        e.target.value = formatted;
    };

    useEffect(() => {
        fetchLicenses();
    }, [accessToken]);

    const fetchLicenses = async () => {
        try {
            if (!accessToken) {
                setLicenses([]);
                setHasLicense(false);
                return;
            }

            const response = await fetch("/api/licenses/me", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-User-Id': useUserStore.getState().user?.id?.toString()
                }
            });

            if (!response.ok) {
                setLicenses([]);
                setHasLicense(false);
                return;
            }

            const data = await response.json();
            if (data?.data && Array.isArray(data.data)) {
                // 목록에서도 하이픈 표시
                const licenseList = data.data.map((item) => {
                    const licenseNumberRaw = item.licenseNumber;
                    // 12자리 숫자면 자동 하이픈 추가
                    if (/^\d{12}$/.test(licenseNumberRaw)) {
                        const formatted = [
                            licenseNumberRaw.slice(0, 2),
                            licenseNumberRaw.slice(2, 4),
                            licenseNumberRaw.slice(4, 10),
                            licenseNumberRaw.slice(10, 12)
                        ].join('-');
                        return {
                            id: item.id,
                            name: item.driverName,
                            birthday: item.birthday,
                            licenseNumber: formatted, //  하이픈 포함
                            serialNumber: item.serialNumber,
                        };
                    }
                    return {
                        id: item.id,
                        name: item.driverName,
                        birthday: item.birthday,
                        licenseNumber: licenseNumberRaw, // 이미 포맷된 경우
                        serialNumber: item.serialNumber,
                    };
                });
                setLicenses(licenseList);
                setHasLicense(licenseList.length > 0);
            } else {
                setLicenses([]);
                setHasLicense(false);
            }
        } catch (error) {
            console.error("면허 조회 실패:", error);
            setLicenses([]);
            setHasLicense(false);
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        const name = document.getElementById("driverName").value.trim();
        const birthday = document.getElementById("driverBirthday").value;
        const licenseRaw = document.getElementById("licenseNumber").value.replace(/-/g, "");
        const serial = document.getElementById("serialNumber").value.trim();

        if (!name || name.length < 2) newErrors.name = "성명은 2자 이상 입력하세요";
        if (!birthday) {
            newErrors.birthday = "생년월일을 선택하세요";
        } else {
            const today = new Date();
            const selected = new Date(birthday);
            if (selected >= today) newErrors.birthday = "생년월일을 다시 확인해주세요";
        }
        if (!licenseRaw || !/^\d{12}$/.test(licenseRaw)) {
            newErrors.license = "면허번호는 하이픈 제외 12자리 숫자여야 합니다 (예: 119012345600)";
        }
        if (!serial || !/^[A-Za-z0-9]{6}$/.test(serial)) {
            newErrors.serial = "일련번호는 숫자/영문 6자리입니다 (뒷면 작은 사진 아래)";
        }

        setErrors(newErrors);
        return {
            ok: Object.keys(newErrors).length === 0,
            data: {
                name,
                birthday,
                licenseNumber: licenseRaw, // API에는 하이픈 제거
                serialNumber: serial,
                driverName: name,
            },
        };
    };

    const registerLicense = async () => {
        const { ok, data } = validateInputs();
        if (!ok) return;
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        setLoading(true);
        setResult("");

        try {
            const response = await fetch("/api/licenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    driverName: data.driverName,
                    birthday: data.birthday,
                    licenseNumber: data.licenseNumber, // 하이픈 제거된 값
                    serialNumber: data.serialNumber,
                }),
            });

            const resultData = await response.json();

            if (response.ok && resultData.success) {
                //  새로 등록된 면허도 하이픈 포맷으로 표시
                const formattedLicenseNumber = [
                    data.licenseNumber.slice(0, 2),
                    data.licenseNumber.slice(2, 4),
                    data.licenseNumber.slice(4, 10),
                    data.licenseNumber.slice(10, 12)
                ].join('-');

                const newLicense = {
                    id: resultData.data.id,
                    name: resultData.data.driverName,
                    birthday: resultData.data.birthday,
                    licenseNumber: formattedLicenseNumber, //  하이픈 포함
                    serialNumber: resultData.data.serialNumber,
                };
                setLicenses((prev) => [newLicense, ...prev]);
                setHasLicense(true);

                setResult(
                    "차량 수령시 입력 정보와 실물/전자 면허증이 일치하지 않을 경우 \n 예약이 취소되거나 이용이 제한될 수 있습니다."
                );
                setModalStep("done");
            } else {
                alert(resultData.message || "등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("API 오류:", error);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const deleteLicense = async (licenseId) => {
        if (!confirm("이 면허 정보를 삭제하시겠습니까?")) return;
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
                setLicenses((prev) => {
                    const newLicenses = prev.filter((l) => l.id !== licenseId);
                    setHasLicense(newLicenses.length > 0);
                    return newLicenses;
                });
                alert("면허 정보가 삭제되었습니다.");
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 오류:", error);
            alert("네트워크 오류");
        }
    };

    const openModal = () => {
        setTimeout(() => {
            ["driverName", "driverBirthday", "licenseNumber", "serialNumber"].forEach(
                (id) => {
                    const el = document.getElementById(id);
                    if (el) el.value = "";
                }
            );
        }, 0);

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
                minHeight: "calc(100vh - 60px)",
                backgroundColor: "#E7EEFF",
            }}
        >
            <div className="px-4 py-6 space-y-4">
                {licenses.length > 0 ? (
                    licenses.map((license, index) => (
                        <div
                            key={license.id || index}
                            className="bg-white rounded-2xl shadow-sm px-5 py-4 flex flex-col"
                        >
                            <span className="mb-2 text-base font-semibold text-[#1A1A1A]">
                                {license.name}
                            </span>
                            <div className="text-sm text-[#333333] space-y-1.5 leading-snug">
                                <p className="flex items-center">
                                    <span className="w-16 text-[#666666]">생년월일</span>
                                    <span>{license.birthday}</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-16 text-[#666666]">면허번호</span>
                                    <span>{license.licenseNumber}</span> {/*  하이픈 표시 */}
                                </p>
                                <p className="flex items-center">
                                    <span className="w-16 text-[#666666]">일련번호</span>
                                    <span className="tracking-[0.15em] font-medium">
                                        {license.serialNumber}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-3 flex justify-end gap-2 text-xs">
                                <button
                                    onClick={() => deleteLicense(license.id)}
                                    className="px-3 py-1.5 rounded-full border border-[#FF4B4B] text-[#FF4B4B] font-medium"
                                >
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm px-5 py-6 flex items-center justify-center">
                        <p className="text-sm text-[#666666] text-center leading-relaxed">
                            등록된 운전면허 정보가 없습니다.
                            <br />
                            운전면허등록으로 보다 신속한 예약이 가능합니다.
                        </p>
                    </div>
                )}

                {!hasLicense && (
                    <button
                        onClick={openModal}
                        className="w-full h-11 rounded-xl bg-[#2C7FFF] text-white text-sm font-medium shadow-sm hover:bg-[#215FCC]"
                    >
                        운전 면허 추가하기
                    </button>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
                    <div className="w-[90%] max-w-md rounded-2xl bg-white px-5 py-6">
                        {modalStep === "form" && (
                            <>
                                <h3 className="text-base font-semibold text-[#1A1A1A]">
                                    운전면허 정보 입력
                                </h3>
                                <p className="mt-2 text-xs text-[#666666]">
                                    차량 수령 시 실물/전자 운전면허증과 확인합니다.
                                </p>

                                <div className="mt-5 space-y-3">
                                    <div>
                                        <input
                                            id="driverName"
                                            placeholder="성명 (2자 이상)"
                                            maxLength={10}
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
                                            maxLength={15} // 12자리 + 3하이픈
                                            className={`w-full rounded-lg border px-3 py-2 text-sm font-mono tracking-wider ${
                                                errors.license ? "border-[#dc3545]" : "border-[#dddddd]"
                                            }`}
                                            onInput={handleLicenseNumberInput}
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
                                    운전면허 등록 완료
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

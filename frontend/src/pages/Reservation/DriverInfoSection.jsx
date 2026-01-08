import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import useReservationStore from "../../store/useReservationStore";

const DriverInfoSection = () => {
    const { register, setValue, reset, formState: { errors }, watch } = useFormContext();
    const driverInfo = useReservationStore((state) => state.driverInfo);
    const [drivers, setDrivers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tempDriver, setTempDriver] = useState({
        lastName: "", firstName: "", birth: "", phone: "", email: "", licenseNo: "", serialNo: ""
    });
    const [editingIndex, setEditingIndex] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // 대표 연락처 폼 값들 watch
    const watchedValues = watch();

    // 자동 포맷
    const formatPhone = (value) => {
        if (!value) return "";
        const onlyNum = value.replace(/[^0-9]/g, "");
        if (onlyNum.length < 4) return onlyNum;
        if (onlyNum.length < 8) return `${onlyNum.slice(0,3)}-${onlyNum.slice(3)}`;
        return `${onlyNum.slice(0,3)}-${onlyNum.slice(3,7)}-${onlyNum.slice(7,11)}`;
    };

    const formatLicenseNo = (value) => {
        if (!value) return "";
        const onlyNum = value.replace(/[^A-Z0-9]/g, "").toUpperCase();
        if (onlyNum.length < 3) return onlyNum;
        if (onlyNum.length < 5) return `${onlyNum.slice(0,2)}-${onlyNum.slice(2)}`;
        if (onlyNum.length < 11) return `${onlyNum.slice(0,2)}-${onlyNum.slice(2,4)}-${onlyNum.slice(4)}`;
        return `${onlyNum.slice(0,2)}-${onlyNum.slice(2,4)}-${onlyNum.slice(4,10)}-${onlyNum.slice(10,12)}`;
    };

    // Zustand 동기화 + 대표 폼 설정
    useEffect(() => {
        if (driverInfo && Array.isArray(driverInfo)) {
            setDrivers(driverInfo);
            if (driverInfo.length > 0) {
                const firstDriver = driverInfo[0];
                reset({
                    lastName: firstDriver.lastName || "",
                    firstName: firstDriver.firstName || "",
                    birth: firstDriver.birth || "",
                    phone: formatPhone(firstDriver.phone || ""),
                    email: firstDriver.email || "",
                    licenseNo: formatLicenseNo(firstDriver.licenseNo || ""),
                    serialNo: firstDriver.serialNo || ""
                });
            }
        }
    }, [driverInfo, reset]);

    // 대표 폼 변경 핸들러 (확장됨)
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "phone") formattedValue = formatPhone(value);
        else if (name === "licenseNo") formattedValue = formatLicenseNo(value);

        setValue(name, formattedValue, { shouldValidate: true });

        if (drivers.length > 0) {
            const updatedDrivers = drivers.map((driver, index) =>
                index === 0 ? { ...driver, [name]: formattedValue } : driver
            );
            setDrivers(updatedDrivers);
            useReservationStore.getState().setDriverInfo(updatedDrivers);
        }
    };

    const handleEditDriver = (driver, index) => {
        setTempDriver({
            ...driver,
            phone: formatPhone(driver.phone || ""),
            licenseNo: formatLicenseNo(driver.licenseNo || "")
        });
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleTempChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "phone") formattedValue = formatPhone(value);
        else if (name === "licenseNo") formattedValue = formatLicenseNo(value);
        setTempDriver(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmitTemp = () => {
        if (!tempDriver.lastName?.trim() || !tempDriver.phone || !tempDriver.licenseNo) {
            alert("성, 휴대폰번호, 면허번호는 필수입니다");
            return;
        }
        let newDrivers;
        if (editingIndex >= 0) {
            newDrivers = drivers.map((d, i) => i === editingIndex ? tempDriver : d);
        } else {
            // 추가할 때 대표 폼 값으로 초기화
            const representativeDriver = {
                lastName: watchedValues.lastName || "",
                firstName: watchedValues.firstName || "",
                birth: watchedValues.birth || "",
                phone: formatPhone(watchedValues.phone || ""),
                email: watchedValues.email || "",
                licenseNo: formatLicenseNo(watchedValues.licenseNo || ""),
                serialNo: watchedValues.serialNo || ""
            };
            newDrivers = [...drivers, representativeDriver];
        }
        setDrivers(newDrivers);
        useReservationStore.getState().setDriverInfo(newDrivers);
        setIsFormOpen(false);
        setEditingIndex(-1);
        // tempDriver 초기화
        setTempDriver({
            lastName: "", firstName: "", birth: "", phone: "", email: "", licenseNo: "", serialNo: ""
        });

        // 첫번째 운전자 대표 폼 업데이트
        if (newDrivers.length > 0) {
            const firstDriver = newDrivers[0];
            reset({
                lastName: firstDriver.lastName || "",
                firstName: firstDriver.firstName || "",
                birth: firstDriver.birth || "",
                phone: formatPhone(firstDriver.phone || ""),
                email: firstDriver.email || "",
                licenseNo: formatLicenseNo(firstDriver.licenseNo || ""),
                serialNo: firstDriver.serialNo || ""
            });
        }
    };

    const handleCancelTemp = () => {
        setIsFormOpen(false);
        setEditingIndex(-1);
        setTempDriver({
            lastName: "", firstName: "", birth: "", phone: "", email: "", licenseNo: "", serialNo: ""
        });
    };

    const handleDeleteDriver = (index) => {
        // 1개일때도 삭제 허용 (어차피 폼 검증에서 막힘)
        const newDrivers = drivers.filter((_, i) => i !== index);
        setDrivers(newDrivers);
        useReservationStore.getState().setDriverInfo(newDrivers);

        // 삭제 후 대표 폼 초기화 (운전자가 없으면 빈 상태)
        if (newDrivers.length === 0) {
            reset({
                lastName: "",
                firstName: "",
                birth: "",
                phone: "",
                email: "",
                licenseNo: "",
                serialNo: ""
            });
        } else {
            // 남은 첫번째 운전자가 대표가 됨
            const firstDriver = newDrivers[0];
            reset({
                lastName: firstDriver.lastName || "",
                firstName: firstDriver.firstName || "",
                birth: firstDriver.birth || "",
                phone: formatPhone(firstDriver.phone || ""),
                email: firstDriver.email || "",
                licenseNo: formatLicenseNo(firstDriver.licenseNo || ""),
                serialNo: firstDriver.serialNo || ""
            });
        }
    };

    return (
        <section className="max-w-[640px] w-full overflow-hidden">
            {/* 대표 연락처 폼 */}
            <div className="px-4 py-4 space-y-3 border-b border-gray-100">
                <div className="flex items-center gap-2 pb-2">
                    <span className="text-sm font-bold">대표 연락처</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="성"
                            {...register("lastName")}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 text-sm transition-all shadow-sm"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs pl-1">{errors.lastName.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="이름"
                            {...register("firstName")}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 text-sm transition-all shadow-sm"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs pl-1">{errors.firstName.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="생년월일 YYYYMMDD"
                        {...register("birth")}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 text-sm font-mono transition-all shadow-sm"
                    />
                    {errors.birth && <p className="text-red-500 text-xs pl-1">{errors.birth.message}</p>}

                    {/* 전화번호와 이메일 세로 배치 */}
                    <div className="space-y-2">
                        <input
                            type="tel"
                            placeholder="010-1234-5678"
                            {...register("phone")}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 text-sm font-mono transition-all shadow-sm"
                        />
                        {errors.phone && <p className="text-red-500 text-xs pl-1">{errors.phone.message}</p>}

                        <input
                            type="email"
                            placeholder="이메일"
                            {...register("email")}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 text-sm transition-all shadow-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs pl-1">{errors.email.message}</p>}
                    </div>

                </div>
            </div>

            {/* 모든 운전자 카드 목록 (대표 포함) */}
            <div className="px-4 py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
                    <h3 className="text-sm font-semibold text-gray-800">운전자 목록 (최대 3명)</h3>
                    <p className="text-xs text-red-500">
                        *입력된 운전자만 보험적용
                    </p>
                </div>

                <div className="space-y-2">
                    {drivers.map((driver, index) => (
                        <div key={index} className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                            {index + 1}
                                        </span>
                                        <span className="font-semibold text-sm truncate">{driver.lastName}{driver.firstName}</span>
                                    </div>
                                    <div className="space-y-0.5 text-xs text-gray-600">
                                        <p className="truncate">{driver.phone}</p>
                                        {driver.email && <p className="truncate">{driver.email}</p>}
                                        <p className="font-mono truncate">{driver.licenseNo}</p>
                                        {driver.serialNo && <p className="truncate">일련번호: {driver.serialNo}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditDriver(driver, index); }}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteDriver(index); }}
                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 whitespace-nowrap"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {drivers.length === 0 && (
                        <div className="w-full p-6 text-center border-2 border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500 text-sm mb-4">운전자를 추가하세요</p>
                            {!isFormOpen && drivers.length < 3 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTempDriver({
                                            lastName: watchedValues.lastName || "",
                                            firstName: watchedValues.firstName || "",
                                            birth: watchedValues.birth || "",
                                            phone: formatPhone(watchedValues.phone || ""),
                                            email: watchedValues.email || "",
                                            licenseNo: formatLicenseNo(watchedValues.licenseNo || ""),
                                            serialNo: watchedValues.serialNo || ""
                                        });
                                        setEditingIndex(-1);
                                        setIsFormOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition-all shadow-sm"
                                >
                                    + 추가
                                </button>
                            )}
                        </div>
                    )}

                    {drivers.length > 0 && drivers.length < 3 && !isFormOpen && (
                        <button
                            type="button"
                            onClick={() => {
                                setTempDriver({
                                    lastName: watchedValues.lastName || "",
                                    firstName: watchedValues.firstName || "",
                                    birth: watchedValues.birth || "",
                                    phone: formatPhone(watchedValues.phone || ""),
                                    email: watchedValues.email || "",
                                    licenseNo: formatLicenseNo(watchedValues.licenseNo || ""),
                                    serialNo: watchedValues.serialNo || ""
                                });
                                setEditingIndex(-1);
                                setIsFormOpen(true);
                            }}
                            className="w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition-all shadow-sm"
                        >
                            + 추가
                        </button>
                    )}
                </div>

                {/* 추가/수정 폼 */}
                {isFormOpen && (
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm text-gray-800">
                                {editingIndex >= 0 ? `운전자 ${editingIndex + 1} 수정` : "운전자 추가"}
                            </h4>
                            <button onClick={handleCancelTemp} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <input name="lastName" placeholder="성" value={tempDriver.lastName} onChange={handleTempChange} className="p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm" />
                            <input name="firstName" placeholder="이름" value={tempDriver.firstName} onChange={handleTempChange} className="p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm" />
                        </div>
                        <input name="phone" placeholder="010-1234-5678" value={tempDriver.phone} onChange={handleTempChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 font-mono bg-white shadow-sm" />
                        <input name="email" type="email" placeholder="example@carpick.com" value={tempDriver.email} onChange={handleTempChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm" />
                        <input name="licenseNo" placeholder="AA-BB-CCCCCC-DE" value={tempDriver.licenseNo} onChange={handleTempChange} className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 font-mono uppercase bg-white shadow-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input name="birth" placeholder="YYYYMMDD" value={tempDriver.birth} onChange={handleTempChange} className="p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm" />
                            <input name="serialNo" placeholder="일련번호" value={tempDriver.serialNo} onChange={handleTempChange} className="p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 bg-white shadow-sm" />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSubmitTemp} className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 shadow-md transition-all">
                                {editingIndex >= 0 ? "수정완료" : "추가하기"}
                            </button>
                            <button onClick={handleCancelTemp} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden">
                <input {...register("lastName")} />
                <input {...register("firstName")} />
                <input {...register("birth")} />
                <input {...register("phone")} />
                <input {...register("email")} />
                <input {...register("licenseNo")} />
                <input {...register("serialNo")} />
            </div>
        </section>
    );
};

export default DriverInfoSection;

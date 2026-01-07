import { useEffect, useState } from "react";
import api from "../../services/api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../components/common/AlertModal.jsx";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [form, setForm] = useState({ phone: "", password: "", confirmPassword: "" });
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });
    const { logout } = useUserStore();

    useEffect(() => {
        api
            .get("/users/me")
            .then((res) => {
                setUserInfo(res.data);
                setForm((prev) => ({
                    ...prev,
                    phone: res.data.phone ?? ""
                }));
            })
            .catch((err) => console.error("회원정보 불러오기 실패:", err));
    }, []);

    // 모달 오픈 함수
    const openModal = (title, message, type = "info", onConfirm = null) => {
        setModal({ isOpen: true, title, message, type, onConfirm });
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setModal({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });
    };

    // 공통 로그아웃 처리
    const performLogout = () => {
        logout();
        localStorage.removeItem("user-storage");
        navigate("/");
    };

    // 공통 업데이트 함수
    const updateUserInfo = async (payload, successMsg, failMsg) => {
        try {
            await api.put("/users/me", payload);
            openModal(null, successMsg, "success");
        } catch (err) {
            openModal(null, err.response?.data?.message || failMsg, "error");
            console.error(err);
        }
    };

    // 휴대폰 번호 포맷팅
    const formatPhoneNumber = (value) => {
        if (!value) return '';
        const numbers = value.replace(/[^0-9]/g, '');
        if (numbers.length < 4) return numbers;
        if (numbers.length < 8) return `${numbers.slice(0,3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0,3)}-${numbers.slice(3,7)}-${numbers.slice(7,11)}`;
    };

    // 휴대폰 번호 변경 핸들러
    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setForm({ ...form, phone: formatted });
    };

    // 휴대폰 번호 변경
    const handleUpdatePhone = () => {
        // 휴대폰 번호 형식 검증
        const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
        if (!phoneRegex.test(form.phone)) {
            openModal(null, "휴대폰 번호 형식이 올바르지 않습니다.\n(예: 010-0000-0000)", "error");
            return;
        }

        updateUserInfo(
            { name: userInfo.name, phone: form.phone, birth: userInfo.birth, marketingAgree: userInfo.marketingAgree },
            "휴대폰 번호가 변경되었습니다.",
            "휴대폰 번호 변경 실패"
        );
    };

    // 비밀번호 변경
    const handleUpdatePassword = () => {
        if (form.password !== form.confirmPassword) {
            openModal(null, "비밀번호가 일치하지 않습니다.", "error");
            return;
        }
        if (form.password.length < 6) {
            openModal(null, "비밀번호는 최소 6자리 이상이어야 합니다.", "error");
            return;
        }
        updateUserInfo(
            { name: userInfo.name, phone: form.phone, birth: userInfo.birth, password: form.password, marketingAgree: userInfo.marketingAgree },
            "비밀번호 수정 완료",
            "비밀번호 변경 실패"
        );
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    };

    // 회원탈퇴
    const deleteAccount = async () => {
        openModal(
            "회원탈퇴",
            "정말 회원탈퇴 하시겠습니까?\n탈퇴 후 복구할 수 없습니다.",
            "confirm",
            async () => {
                try {
                    await api.delete("/users/me");
                    openModal(null, "회원탈퇴가 완료되었습니다.", "success", () => performLogout());
                } catch (err) {
                    openModal(null, err.response?.data?.message || "회원탈퇴 실패", "error");
                    console.error(err);
                }
            }
        );
    };

    // 소셜 연동 해제
    const unlinkSocial = async (provider) => {
        openModal(
            "연동 해제",
            `${provider} 연동을 해제하시겠습니까?`,
            "confirm",
            async () => {
                try {
                    await api.post(`/auth/unlink/${provider.toLowerCase()}`);
                    openModal(null, `${provider} 연동이 해제되었습니다.`, "success", () => performLogout());
                } catch (err) {
                    openModal(null, `${provider} 연동 해제 실패`, "error");
                    console.error(err);
                }
            }
        );
    };

    // 성별 표시 함수
    const renderGender = (gender) => {
        switch (gender) {
            case "M":
                return "남성";
            case "F":
                return "여성";
            default:
                return "미지정";
        }
    };

    if (!userInfo) {
        return (
            <div
                id="content"
                className="font-pretendard min-h-screen bg-[#E7EEFF] flex items-center justify-center py-20"
            >
                <div className="flex items-center">
                    <div className="w-8 h-8 border-4 border-[#1D6BF3] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">회원정보를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            id="content"
            className="font-pretendard min-h-screen bg-[#E7EEFF] flex flex-col"
        >
            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                onClose={closeModal}
            />

            <div>
                <div style={{ border: "none" }}>
                    <div className="shadow-sm overflow-hidden space-y-6 px-6 pt-6 pb-6">

                        {/* 제목 영역 */}
                        <div className="flex items-center justify-between ml-2 mb-3">
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">회원 정보 수정</h2>
                        </div>

                        {/* 기본 회원 정보 */}
                        <div className="border border-gray-200 p-5 rounded-xl bg-white/80 shadow-sm space-y-2">
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">이름</span>
                                <span>{userInfo.name}</span>
                            </p>
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">이메일</span>
                                <span>{userInfo.email}</span>
                            </p>
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">생년월일</span>
                                <span>{userInfo.birth}</span>
                            </p>
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">성별</span>
                                <span>{renderGender(userInfo.gender)}</span>
                            </p>
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">회원등급</span>
                                <span>{userInfo.membershipGrade}</span>
                            </p>
                            <p className="text-sm text-[#1A1A1A]">
                                <span className="mr-2 text-gray-500">마케팅 수신 동의</span>
                                <span>{userInfo.marketingAgree ? "동의" : "거부"}</span>
                            </p>
                        </div>

                        {/* 휴대폰 번호 변경 */}
                        <div className="border border-gray-200 rounded-xl bg-white/80 shadow-sm p-5">
                            <label className="block text-s mb-1 ml-1">휴대폰 번호</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={handlePhoneChange}
                                maxLength="13"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6BF3] focus:border-transparent bg-gray-50"
                                placeholder="010-0000-0000"
                            />
                            <button
                                onClick={handleUpdatePhone}
                                className="mt-3 w-full sm:w-auto px-4 py-2 bg-[#1D6BF3] text-white text-sm rounded-xl shadow-sm hover:bg-[#1A5BCF] hover:shadow-md transition-all"
                            >
                                휴대폰 번호 변경
                            </button>
                        </div>

                        {/* 비밀번호 변경 */}
                        <div className="border border-gray-200 rounded-xl bg-white/80 shadow-sm p-5 space-y-3">
                            <div>
                                <label className="block text-xs mb-1 text-gray-600">새 비밀번호</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6BF3] focus:border-transparent bg-gray-50"
                                    placeholder="새 비밀번호를 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1 text-gray-600">비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6BF3] focus:border-transparent bg-gray-50"
                                    placeholder="비밀번호를 다시 입력하세요"
                                />
                            </div>
                            <button
                                onClick={handleUpdatePassword}
                                className="w-full sm:w-auto mt-1 px-4 py-2 bg-[#1D6BF3] text-white text-sm rounded-xl shadow-sm hover:bg-[#1A5BCF] hover:shadow-md transition-all"
                            >
                                비밀번호 변경
                            </button>
                        </div>

                        {/* 회원탈퇴 / 소셜 연동 해제 */}
                        <div className="flex gap-3 -mx-6 px-6 py-8">
                            {/* 회원탈퇴는 LOCAL만 보이도록 */}
                            {userInfo.provider === "LOCAL" && (
                                <button
                                    onClick={deleteAccount}
                                    className="flex-1 px-4 py-3 bg-[#FF5151] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:bg-[#E94A4A] hover:shadow-md transition-all"
                                >
                                    회원탈퇴
                                </button>
                            )}
                            {/* 소셜 연동 해제는 LOCAL이 아닌경우만 */}
                            {userInfo.provider !== "LOCAL" && (
                                <button
                                    onClick={() => unlinkSocial(userInfo.provider.toUpperCase())}
                                    className="flex-1 px-4 py-2 bg-amber-50 text-xs sm:text-sm font-semibold text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
                                >
                                    {userInfo.provider === "KAKAO" ? "카카오 연동 해제" : "네이버 연동 해제"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

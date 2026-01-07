import { useEffect, useState } from "react";
import api from "../../services/api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [form, setForm] = useState({ phone: "", password: "", confirmPassword: "" });
  const { logout } = useUserStore();

  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        setUserInfo(res.data);
        setForm({
          phone: res.data.phone ?? "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((err) => console.error("회원정보 불러오기 실패:", err));
  }, []);

  // 공통 로그아웃 처리
  const performLogout = () => {
    logout();
    localStorage.removeItem("user-storage");
    navigate("/");
  };

  // 폰번호 하이픈 함수 추가
  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const numbers = value.replace(/[^0-9]/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateForm = () => {
    // 휴대폰 번호 검사
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("휴대폰 번호 형식이 올바르지 않습니다.");
      return false;
    }

    // 비밀번호는 입력했을 때만 검사
    if (form.password) {
      const pwRegex = /^.{6,}$/;
      if (!pwRegex.test(form.password)) {
        alert("비밀번호는 6자리 이상이어야 합니다.");
        return false;
      }

      if (form.password !== form.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
      }
    }

    return true;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 일괄 개인정보 수정 버튼
  const handleSave = async () => {
    if (!validateForm()) return;

    // 항상 "최종값"을 payload로 만든다
    const payload = {
      name: userInfo.name,
      phone: form.phone,              // ✅ 항상 값 있음
      birth: userInfo.birth,
      marketingAgree: userInfo.marketingAgree,
    };

    // 비밀번호는 입력했을 때만 포함
    if (form.password) {
      payload.password = form.password;
    }

    try {
      await api.put("/users/me", payload);
      alert("개인정보 수정이 완료되었습니다.");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "개인정보 수정 실패");
    }
  };
  // 회원탈퇴
  const deleteAccount = async () => {
    if (window.confirm("정말 회원탈퇴 하시겠습니까?")) {
      try {
        await api.delete("/users/me");
        alert("회원탈퇴가 완료되었습니다.");
        performLogout();
      } catch (err) {
        alert(err.response?.data?.message || "회원탈퇴 실패");
        console.error(err);
      }
    }
  };

  // 소셜 연동 해제
  const unlinkSocial = async (provider) => {
    if (window.confirm(`${provider} 연동을 해제하시겠습니까?`)) {
      try {
        await api.post(`/auth/unlink/${provider.toLowerCase()}`);
        alert(`${provider} 연동이 해제되었습니다.`);
        performLogout();
      } catch (err) {
        alert(`${provider} 연동 해제 실패`);
        console.error(err);
      }
    }
  };

  // 성별 표시 함수
  const renderGender = (gender) => {
    switch (gender) {
      case "M": return "남성";
      case "F": return "여성";
      default: return "미지정";
    }

    return (
      <div className="flex justify-center items-center mt-[70px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">회원정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">회원 정보 수정</h2>

      {/* 기본 회원 정보 */}
      <div className="border p-4 rounded bg-gray-50 space-y-2">
        <p><strong>이름:</strong> {userInfo.name}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>생년월일:</strong> {userInfo.birth}</p>
        <p><strong>성별:</strong> {renderGender(userInfo.gender)}</p>
        <p><strong>회원등급:</strong> {userInfo.membershipGrade}</p>
        <p><strong>마케팅 수신 동의:</strong> {userInfo.marketingAgree ? "동의" : "거부"}</p>
      </div>

      {/* 입력 정보 수정 영역 */}
      <div className="space-y-6">

        {/* 휴대폰 번호 변경 */}
        <div className="space-y-2">
          <label className="block text-sm leading-tight">
            휴대폰 번호
          </label>
          <input
            type="tel"
            value={formatPhoneNumber(form.phone)}
            onChange={(e) =>
              setForm({ ...form, phone: formatPhoneNumber(e.target.value) })
            }
            maxLength={13}
            className="w-full h-11 border rounded px-3"
          />
        </div>

        {/* 비밀번호 변경 */}
        <div className="space-y-4">

          {/* 새 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-sm leading-tight">
              새 비밀번호
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full h-11 border rounded px-3 pr-10"
              />

              {form.password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="비밀번호 보기 토글"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label className="block text-sm leading-tight">
              비밀번호 확인
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full h-11 border rounded px-3 pr-10"
              />

              {form.confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="비밀번호 확인 보기 토글"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 회원탈퇴 / 소셜 연동 해제 */}

      {/* 하단 액션 영역 */}
      <div className="pt-6 space-y-4">

        {/* 주요 액션 */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="w-full max-w-[240px] px-4 py-2 bg-brand text-white rounded font-medium"
          >
            회원정보 수정
          </button>
        </div>

        {/* 위험 액션 */}
        <div className="flex justify-center gap-3 text-sm">
          {userInfo.provider === "LOCAL" && (
            <button
              onClick={deleteAccount}
              className="text-red-500 underline"
            >
              회원탈퇴
            </button>
          )}

          {userInfo.provider !== "LOCAL" && (
            <button
              onClick={() => unlinkSocial(userInfo.provider.toUpperCase())}
              className="text-yellow-600 underline"
            >
              {userInfo.provider === "KAKAO"
                ? "카카오 연동 해제"
                : "네이버 연동 해제"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

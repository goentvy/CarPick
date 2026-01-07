import { useEffect, useState } from "react";
import api from "../../services/api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [form, setForm] = useState({ phone: "", password: "", confirmPassword: "" });
  const { logout } = useUserStore();

  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        setUserInfo(res.data);
        setForm((prev) => ({ ...prev, phone: res.data.phone ?? "" }));
      })
      .catch((err) => console.error("회원정보 불러오기 실패:", err));
  }, []);

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
      alert(successMsg);
    } catch (err) {
      alert(err.response?.data?.message || failMsg);
      console.error(err);
    }
  };

  // 휴대폰 번호 변경
  const handleUpdatePhone = () => {
    updateUserInfo(
      { name: userInfo.name, phone: form.phone, birth: userInfo.birth, marketingAgree: userInfo.marketingAgree },
      "휴대폰 번호가 변경되었습니다.",
      "휴대폰 번호 변경 실패"
    );
  };

  // 비밀번호 변경
  const handleUpdatePassword = () => {
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
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
  };

  if (!userInfo) {
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

      {/* 휴대폰 번호 변경 */}
      <div>
        <label className="block text-sm mb-1">휴대폰 번호</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={handleUpdatePhone}
          className="mt-2 px-4 py-2 bg-brand text-white rounded"
        >
          휴대폰 번호 변경
        </button>
      </div>

      {/* 비밀번호 변경 */}
      <div>
        <label className="block text-sm mb-1">새 비밀번호</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <label className="block text-sm mt-2 mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={handleUpdatePassword}
          className="mt-2 px-4 py-2 bg-brand text-white rounded"
        >
          비밀번호 변경
        </button>
      </div>

      {/* 회원탈퇴 / 소셜 연동 해제 */}
      <div className="pt-4 border-t flex gap-2">
        {/* 회원탈퇴는 LOCAL만 보이도록 */}
        {userInfo.provider === "LOCAL" && (
          <button
            onClick={deleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            회원탈퇴
          </button>
        )}
        {/* 소셜 연동 해제는 LOCAL이 아닌경우만 */}
        {userInfo.provider !== "LOCAL" && (
          <button
            onClick={() => unlinkSocial(userInfo.provider.toUpperCase())}
            className="px-4 py-2 bg-yellow-500 text-black rounded"
          >
            {userInfo.provider === "KAKAO" ? "카카오 연동 해제" : "네이버 연동 해제"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

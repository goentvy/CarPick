import { useEffect, useState } from "react";
import api from "../../services/api";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // 회원정보 불러오기
    api.get("/users/me")
      .then((res) => {
        setUserInfo(res.data);
        setPhone(res.data.phone); // 초기값 세팅
      })
      .catch((err) => console.error("회원정보 불러오기 실패:", err));
  }, []);

  const handleUpdatePhone = async (phone) => {
    try {
      await api.put("/users/me", {
        name: userInfo.name,
        phone,
        birth: userInfo.birth,
        marketingAgree: userInfo.marketingAgree,
      });
      alert("휴대폰 번호가 변경되었습니다.");
    } catch (err) {
      alert("휴대폰 번호 변경 실패");
      console.error(err);
    }
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await api.put("/users/me", {
        name: userInfo.name,
        phone: phone,
        birth: userInfo.birth,
        password: password,    //나유진이 추가함.
        marketingAgree: userInfo.marketingAgree,
      });
      alert("비밀번호 수정 완료");
    } catch (err) {
      alert("비밀번호 변경 실패");
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말 회원탈퇴 하시겠습니까?")) {
      try {
        await api.delete("/users/me");
        alert("회원탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } catch (err) {
        alert("회원탈퇴 실패");
        console.error(err);
      }
    }
  };

  if (!userInfo) return <p>회원정보를 불러오는 중...</p>;

  return (
    <div className="max-w-[640px] mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">회원 정보 수정</h2>

      {/* 기본 회원 정보 미리보기 */}
      <div className="border p-4 rounded bg-gray-50 space-y-2">
        <p>
          <strong>이름:</strong> {userInfo.name}
        </p>
        <p>
          <strong>이메일:</strong> {userInfo.email}
        </p>
        <p>
          <strong>생년월일:</strong> {userInfo.birth}
        </p>
        <p>
          <strong>성별:</strong> {userInfo.gender === "M" ? "남성" : "여성"}
        </p>
        <p>
          <strong>회원등급:</strong> {userInfo.membershipGrade}
        </p>
        <p>
          <strong>마케팅 수신 동의:</strong>{" "}
          {userInfo.marketingAgree ? "동의" : "거부"}
        </p>
      </div>

      {/* 휴대폰 번호 변경 */}
      <div>
        <label className="block text-sm mb-1">휴대폰 번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={() => handleUpdatePhone(phone)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <label className="block text-sm mt-2 mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          onClick={handleUpdatePassword}
          className="mt-2 px-4 py-2 bg-brand text-white rounded"
        >
          비밀번호 변경
        </button>
      </div>

      {/* 회원탈퇴 */}
      <div className="pt-4 border-t">
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

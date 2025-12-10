import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../../components/common/StepProgress';

const SignupJoinus = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birth: '',
    gender: '',
    consent: 'agree',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // 간단한 유효성 검사
    // if (
    //   !formData.email ||
    //   !formData.password ||
    //   formData.password !== formData.confirmPassword ||
    //   !formData.name ||
    //   !formData.phone ||
    //   !formData.birth ||
    //   !formData.gender
    // ) {
    //   alert('모든 필수 정보를 정확히 입력해주세요.');
    //   return;
    // }
    alert('가입 정보가 제출되었습니다.');
    navigate("/signupcomplete")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-2">CarPick</h2>
        <p className="text-center text-gray-600 mb-6">회원가입</p>

        <StepProgress step={2} />

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">이메일 주소 *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일 주소"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">비밀번호 *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="비밀번호"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">비밀번호 확인 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="비밀번호 확인"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">이름 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">휴대폰 번호 *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">생년월일 *</label>
            <input
              type="date"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">성별 *</label>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                />
                <span>남성</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <span>여성</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">정보제공 수신 *</label>
            <div className="flex space-x-4 mt-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="consent"
                  value="agree"
                  checked={formData.consent === 'agree'}
                  onChange={handleChange}
                />
                <span>수신동의</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="consent"
                  value="disagree"
                  checked={formData.consent === 'disagree'}
                  onChange={handleChange}
                />
                <span>수신거부</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="min-w-1/3 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="min-w-1/3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            입력완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupJoinus;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckboxToggle from '../../components/common/CheckboxToggle';
import StepProgress from '../../components/common/StepProgress';
import Logo from '/src/assets/logo.svg';

const SignupAgree = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();

  const handleAgreeAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setTerms(newValue);
    setPrivacy(newValue);
  };

  const handleSubmit = () => {
    if (terms && privacy) {
      alert('본인인증 단계로 이동합니다.');
      navigate("/signup/joinus");
    } else {
      alert('필수 약관에 모두 동의해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8">
        <div className="flex justify-center my-3">
          <img src={Logo} alt="logo" className="h-10 sm:h-12" />
        </div>
        <p className="text-2xl text-center font-semibold my-6">회원가입</p>

        <StepProgress step={1} />

        {/* 전체동의 */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <CheckboxToggle checked={agreeAll} onClick={handleAgreeAll} />
            <span className="font-semibold text-sm sm:text-base break-keep">
              전체동의
            </span>
          </label>
        </div>

        {/* 이용약관 */}
        <div className="mb-4 rounded">
          <label className="flex items-center gap-2 mb-2">
            <CheckboxToggle checked={terms} onClick={() => setTerms(!terms)} />
            <p className="text-sm sm:text-base break-keep">
              <span className="text-blue-600">(필수)</span> 이용약관
            </p>
          </label>
          <div className="h-24 overflow-y-scroll border p-2 text-sm text-gray-600 rounded">
            Contents of Terms of Service<br />Contents of Terms of Service<br />Contents of Terms of Service<br />Contents of Terms of Service
          </div>
        </div>

        {/* 개인정보 */}
        <div className="mb-4 rounded">
          <label className="flex items-center gap-2 mb-2">
            <CheckboxToggle checked={privacy} onClick={() => setPrivacy(!privacy)} />
            <p className="text-sm sm:text-base break-keep">
              <span className="text-blue-600">(필수)</span> 개인정보 수집이용 내역
            </p>
          </label>
          <div className="h-24 overflow-y-scroll border p-2 text-sm text-gray-600 rounded">
            Contents of Privacy Policy<br />Contents of Privacy Policy<br />Contents of Privacy Policy<br />Contents of Privacy Policy
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between gap-4 mt-6">
          <button className="w-1/2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            본인인증
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupAgree;

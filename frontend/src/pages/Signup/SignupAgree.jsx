import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckboxToggle from '../../components/common/CheckboxToggle';
import StepProgress from '../../components/common/StepProgress';

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
      navigate("/signupjoinus");
    } else {
      alert('필수 약관에 모두 동의해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-2">CarPick</h2>
        <p className="text-center text-gray-600 mb-6">회원가입</p>

        <StepProgress step={1} />

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <CheckboxToggle checked={agreeAll} onClick={handleAgreeAll} />
            <span className="font-semibold">전체동의 (모든 사항을 확인하고 전체 동의합니다.)</span>
          </label>
        </div>

        <div className="mb-4 rounded">
          <label className="flex items-center space-x-2 mb-2">
            <CheckboxToggle checked={terms} onClick={() => setTerms(!terms)} />
            <p><span className="text-blue-600">(필수)</span> 이용약관</p>
          </label>
          <div className="h-24 overflow-y-scroll border p-2 text-sm text-gray-600">
            Contents of Terms of Service<br />Contents of Terms of Service<br />Contents of Terms of Service<br />Contents of Terms of Service
          </div>
        </div>

        <div className="mb-4 rounded">
          <label className="flex items-center space-x-2 mb-2">
            <CheckboxToggle checked={privacy} onClick={() => setPrivacy(!privacy)} />
            <p><span className="text-blue-600">(필수)</span> 개인정보 수집이용 내역</p>
          </label>
          <div className="h-24 overflow-y-scroll border p-2 text-sm text-gray-600">
            Contents of Privacy Policy<br />Contents of Privacy Policy<br />Contents of Privacy Policy<br />Contents of Privacy Policy
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
            본인인증
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupAgree;

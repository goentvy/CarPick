import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/common/StepProgress";

const SignupComplete = ({ userName = '홍길동' }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-2">CarPick</h2>
        <p className="text-center text-gray-600 mb-6">가입완료</p>

        <StepProgress step={3} />

        <div className="text-center mb-8">
          <p className="text-xl font-semibold mb-2">{userName}님</p>
          <p className="text-gray-700">카픽에 오신 걸 환영합니다!</p>
        </div>

        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={() => navigate("/")}>
            메인으로
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate("/login")}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete;

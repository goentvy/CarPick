import { useNavigate } from "react-router-dom";
import StepProgress from "../../components/common/StepProgress";
import ContentTopLogo from "../../components/common/ContentTopLogo";

const SignupComplete = ({ userName = '홍길동' }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex justify-center mt-[67px]">
      <div className="w-full max-w-2xl bg-white p-8">
        <ContentTopLogo 
          title="가입완료"
          titleStyle={"text-2xl text-center font-bold my-6"}
        />

        <StepProgress step={3} />

        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-2">
            <span className="text-blue-500 text-2xl">{userName}</span>님
            </p>
          <p className="text-lg text-gray-700">카픽에 오신 걸 환영합니다!</p>
        </div>

        <div className="flex justify-center space-x-4">
          <button 
            className="px-12 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white" 
            onClick={() => navigate("/home")}>
            메인으로
          </button>
          <button 
            className="px-12 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" 
            onClick={() => navigate("/login")}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupComplete;

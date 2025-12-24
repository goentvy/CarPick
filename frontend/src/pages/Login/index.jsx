import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import ContentTopLogo from '../../components/common/ContentTopLogo';
import { login } from '../../services/auth';
import useUserStore from '../../store/useUserStore';


// Yup 스키마 정의
const schema = yup.object().shape({
  email: yup.string().email("올바른 이메일 주소를 입력해주세요").required("이메일은 필수입니다"),
  password: yup.string().required("비밀번호를 입력해주세요"),
});

const Login = () => {
  const navigate = useNavigate();

  // React Hook Form 초기화
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 에러 발생 시 자동 포커스 이동
  useEffect(() => {
    if (errors.email) {
      setFocus("email");
    } else if (errors.password) {
      setFocus("password");
    }
  }, [errors, setFocus]);

  // 로그인 핸들러
  const onSubmit = async (formData) => {
    try {
      const data = await login(formData.email, formData.password);

      if (data.success) {
        useUserStore.getState().login({ 
          user: { 
            email: data.email,
            name: data.name,
            membershipGrade: data.membershipGrade,
          },
          accessToken: data.accessToken,
        });
        
        navigate("/home");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  // ✅ 카카오 로그인 핸들러
  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.KAKAO_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };
  // ✅ 네이버 로그인 핸들러
  const handleNaverLogin = () => {
    const CLIENT_ID = import.meta.env.NAVER_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:3000/oauth/naver/callback";
    const STATE = "RANDOM_STATE"; // CSRF 방지용 난수
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
    window.location.href = naverAuthUrl;
  };

  return (
      <div className="flex justify-center min-h-[calc(100vh-67px)] w-full mt-[67px] pb-20">
          <div className="w-full max-w-md bg-white p-8">
        <ContentTopLogo 
          title="로그인 하세요" 
          titleStyle={"text-center mb-4 text-xl font-bold"}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="이메일을 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* 로그인 버튼 */}
          <button 
            type="submit"
            className="w-full bg-brand text-white py-2 rounded-xl hover:bg-blue-600 transition">
            로그인
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">or</div>

        {/* 소셜 로그인 */}
        <button 
          onClick={handleNaverLogin}
          className="w-full bg-green-500 text-white py-2 rounded-xl mb-2 hover:bg-green-600 transition">
          네이버로 로그인하기
        </button>

        <button 
          onClick={handleKakaoLogin}
          className="w-full bg-yellow-300 text-black py-2 rounded-xl hover:bg-yellow-400 transition">
          카카오로 로그인하기
        </button>

        <p 
          className="text-base text-center font-medium mt-6 cursor-pointer"
          onClick={() => navigate('/signup/agree')}>
          need help for signing in ?
        </p>
        <p className="text-xs text-center text-gray-400 my-3">
          By signing up you are creating an account and
        </p>
        <p className="text-xs text-center text-gray-400 my-3">
          agree to our Term’s and Privacy policy
        </p>

        {/* 아이디/비밀번호 찾기 */}
        <div className="flex flex-row mt-8 gap-4">
          <button 
            className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition"
            onClick={() => navigate('/findid')}>
            아이디 찾기
          </button>

          <button 
            className="w-full bg-indigo-400 text-white py-2 rounded-xl hover:bg-indigo-500 transition"
            onClick={() => navigate('/resetpassword')}>
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
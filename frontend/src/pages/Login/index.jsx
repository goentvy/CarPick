import Logo from '/src/assets/logo.svg';

const Login = () => {
  return (
    <div className="flex justify-center min-h-screen w-full mt-20">
      <div className="w-full max-w-md bg-white p-8">
        <div className="flex justify-center my-3">
          <img src={Logo} alt="logo" className=""/>
        </div>
        <p className="text-center mb-4 text-xl font-bold">로그인하세요</p>

        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">
          로그인
        </button>

        <div className="text-center my-4 text-gray-500">or</div>

        <button className="w-full bg-green-500 text-white py-2 rounded-xl mb-2 hover:bg-green-600 transition">
          네이버로 로그인하기
        </button>

        <button className="w-full bg-yellow-300 text-black py-2 rounded-xl hover:bg-yellow-400 transition">
          카카오로 로그인하기
        </button>

        <p className="text-base text-center font-medium mt-6">
          need help for signing in ?
        </p>
        <p className="text-xs text-center text-gray-400 mt-1">
          By signing up you are creating an account and
        </p>
      </div>
    </div>
  );
};

export default Login;

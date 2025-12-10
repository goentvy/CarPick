const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">CarPick</h2>
        <p className="text-center text-gray-600 mb-4">로그인하세요</p>

        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          로그인
        </button>

        <div className="text-center my-4 text-gray-500">or</div>

        <button className="w-full bg-green-500 text-white py-2 rounded mb-2 hover:bg-green-600 transition">
          네이버로 로그인하기
        </button>

        <button className="w-full bg-yellow-300 text-black py-2 rounded hover:bg-yellow-400 transition">
          카카오로 로그인하기
        </button>

        <p className="text-sm text-center text-gray-500 mt-6">
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

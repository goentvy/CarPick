import { useState } from "react";
import userService from "../../services/userService";
import ContentTopLogo from "../../components/common/ContentTopLogo";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleResetPassword = async () => {
        try {
            await userService.resetPassword({ email });
            setMessage("임시 비밀번호가 이메일로 발송되었습니다.");
        } catch (err) {
            setMessage("등록된 이메일이 없습니다.");
            console.error(err);
        }
    };

    return (
    <div className="flex flex-col items-center p-6 mt-20">
        <ContentTopLogo title="비밀번호 찾기"/>
        <input
            type="email"
            placeholder="가입 이메일"
            className="w-64 px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <button
            onClick={handleResetPassword}
            className="bg-green-500 text-white px-4 py-2 rounded"
        >
            임시 비밀번호 발급
        </button>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
    );
};

export default ResetPasswordPage;
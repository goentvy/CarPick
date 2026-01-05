import { useState } from "react";
import userService from "../../services/userService";
import ContentTopLogo from "../../components/common/ContentTopLogo";

const FindIdPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);

    const handleFindId = async () => {
        try {
            const res = await userService.findId({ name, email });
            setResult(res.data.message); // 백엔드 메시지 로 변경 한 부분(아이디찾기존재여부성공 렌더링)
        } catch (err) {
            setResult("등록된 정보가 없습니다.");
            console.error(err);
        }
    };

    return (
    <div className="flex flex-col items-center p-6 mt-[67px]">
        <ContentTopLogo 
            title="아이디 찾기"
            titleStyle="text-center mb-4 text-xl font-bold"/>
        <input
            type="text"
            placeholder="이름"
            className="w-64 px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        <input
            type="email"
            placeholder="가입 이메일"
            className="w-64 px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <button
            onClick={handleFindId}
            className="bg-brand text-white px-4 py-2 rounded"
        >
            아이디 찾기
        </button>
        {result && <p className="mt-4 text-gray-700">{result}</p>}
    </div>
    );
};

export default FindIdPage;
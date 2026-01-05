import { useState } from "react";
import userService from "../../services/userService";
import ContentTopLogo from "../../components/common/ContentTopLogo";
import { Phone } from "lucide-react";

const FindIdPage = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [result, setResult] = useState(null);

    const handleFindId = async () => {
        // 👉 "아이디 찾기" 버튼을 눌렀을 때 실행되는 함수
        // 👉 비동기(async) 함수이므로 await를 사용할 수 있다

        // 백엔드에서 이미 마스킹된 이메일 사용
        try {
            const res = await userService.findId({ name, phone });
            
            const masked = res.data.maskedEmail;
            
            setResult(masked); 
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
            type="text"
            placeholder="휴대폰 번호 (예: 010-1234-5678)"
            className="w-64 px-4 py-2 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
        />
        <button
            onClick={handleFindId}
            className="bg-brand text-white px-4 py-2 rounded"
        >
            아이디 찾기
        </button>
        {result && (<p className="mt-4 text-gray-700">
            가입된 이메일: <strong>{result}</strong>
            </p>)}
    </div>
    );
};

export default FindIdPage;
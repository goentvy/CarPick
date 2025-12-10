import { useNavigate } from 'react-router-dom';
import Logo from '/src/assets/logo.svg';

const GuestCancelComplete = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center min-h-screen w-full mt-20">
            <div className="w-full max-w-md p-8">
                <div className="flex justify-center my-3">
                    <img src={Logo} alt="logo" className=""/>
                </div>
                <h2 className="text-xl font-bold mb-4">예약이 성공적으로 취소되었습니다.</h2>
                <p className="text-gray-700 mb-2">
                    다시 예약하시려면 아래 버튼을 눌러주세요.
                </p>

                <div className="bg-gray-100 p-4 rounded-xl mb-4">
                    <p><strong>이메일:</strong> {}</p>
                    <p><strong>예약번호:</strong> {}</p>
                    <p><strong>차량:</strong> {}</p>
                    <p><strong>날짜:</strong> {}</p>
                </div>
                
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                        onClick={() => navigate('/reservation')}
                    >
                        다시 예약하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestCancelComplete;
import { useState } from "react";

const DriverInfoSection = () => {
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        birth: "",
        phone: "",
        email: "",
    });

    return (
    <section className="w-full max-w-[640px] mt-6">
        <h2 className="text-lg font-semibold mb-4">운전자 정보</h2>
        <div className="space-y-4">
        {/* 성 / 이름 */}
        <div className="flex space-x-4">
            <input
                type="text"
                placeholder="성"
                value={formData.lastName}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="이름"
                value={formData.firstName}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>

        {/* 생년월일 */}
        <input
            type="text"
            placeholder="생년월일 (YYYYMMDD)"
            value={formData.birth}
            onChange={(e) =>
            setFormData((prev) => ({ ...prev, birth: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 휴대폰 번호 + 인증요청 */}
        <div className="flex space-x-2">
            <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="+82">+82 (Korea)</option>
            </select>
            <input
                type="tel"
                placeholder="휴대폰 번호"
                value={formData.phone}
                onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                type="button"
                className="px-4 py-2 rounded-lg border-2 font-medium transition-colors duration-200 bg-white text-blue-500 border-gray-300 hover:bg-blue-100"
                >
                인증요청
            </button>
        </div>

        {/* 이메일 */}
        <input
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        </div>

        {/* 안내 문구 */}
        <p className="mt-3 text-sm text-purple-600">
            차량 대여 시, 운전자는 유효한 운전면허증을 꼭 지참해주세요. <br />
            면허증 확인과 계약서 작성 시 필요합니다.
        </p>
    </section>
    );
}

export default DriverInfoSection;
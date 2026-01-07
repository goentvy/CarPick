// src/components/common/AlertModal.jsx
const AlertModal = ({ isOpen, title, message, type = "info", onConfirm, onClose }) => {
    if (!isOpen) return null;

    const isConfirm = type === "confirm";
    const isSuccess = type === "success";
    const isError = type === "error";
    const hasTitle = title && title.trim() !== "";

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <>
            {/* 오버레이 */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />
            {/* 모달 박스 */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full">
                    {/* 헤더 - title이 있을 때만 표시 */}
                    {hasTitle && (
                        <div className={`px-6 py-4 border-b border-gray-200 rounded-t-2xl ${
                            isSuccess ? "bg-[#2ECC71]/10" :
                                isError ? "bg-[#FF5151]/10" :
                                    "bg-blue-50"
                        }`}>
                            <h3 className={`text-lg font-semibold ${
                                isSuccess ? "text-[#2ECC71]" :
                                    isError ? "text-[#FF5151]" :
                                        "text-blue-900"
                            }`}>
                                {title}
                            </h3>
                        </div>
                    )}

                    {/* 메시지 */}
                    <div className={`px-6 py-6 ${hasTitle ? "" : "pt-8"}`}>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* 버튼 */}
                    <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                        {isConfirm && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                        )}
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors ${
                                isSuccess ? "bg-[#2ECC71] hover:bg-[#27AE60]" :
                                    isError ? "bg-[#FF5151] hover:bg-[#E94A4A]" :
                                        isConfirm ? "bg-[#1D6BF3] hover:bg-[#1A5BCF]" :
                                            "bg-[#1D6BF3] hover:bg-[#1A5BCF]"
                            }`}
                        >
                            {isConfirm ? "확인" : "닫기"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlertModal;

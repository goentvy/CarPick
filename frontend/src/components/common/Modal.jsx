import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div
      className="fixed inset-0 xx:bg-white xs:bg-black/15 flex justify-center z-9999"
      onClick={onClose} // ✅ 바깥 클릭 시 닫기
    >
      <div
        className="bg-white shadow-lg xs:p-4 w-full mx-auto xx:max-w-full xx:max-h-full xx:p-4 xs:max-w-[640px] xx:shadow-none max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭은 유지
      >
        {children}
      </div>
    </div>,
    document.body // ✅ body 기준으로 렌더링
  );
};

export default Modal;

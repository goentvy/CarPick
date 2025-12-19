import { createPortal } from "react-dom";

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/15 flex justify-center items-center z-9999"
      onClick={onClose} // ✅ 바깥 클릭 시 닫기
    >
      <div
        className="bg-white rounded-xl shadow-lg p-4 w-[360px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭은 유지
      >
        {children}
      </div>
    </div>,
    document.body // ✅ body 기준으로 렌더링
  );
};

export default Modal;

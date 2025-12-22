import { createPortal } from "react-dom";

const FilterModal = ({ children, onClose }) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/15 flex justify-center items-center z-9999"
      onClick={onClose} // ✅ 바깥 클릭 시 닫기
    >
      <div
        className="bg-white shadow-lg w-[640px] h-[100vh] overflow-y-auto mr-[-14px]"
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭은 유지
      >
        {children}
      </div>
    </div>,
    document.body // ✅ body 기준으로 렌더링
  );
};

export default FilterModal;

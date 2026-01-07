import { createPortal } from "react-dom";
import { useEffect } from "react";

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

const FilterModal = ({ children, onClose }) => {
  useEffect(() => {
    const scrollbarWidth = getScrollbarWidth();

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/15 flex justify-center items-center z-9999"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-lg overflow-x-hidden overflow-y-auto 
                   max-w-[640px] w-full h-screen bg-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FilterModal;

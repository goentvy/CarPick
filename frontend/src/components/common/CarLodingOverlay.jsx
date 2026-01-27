const CarLoadingOverlay = ({ show, label = "로딩 중..." }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/15 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-lg">
        <div className="h-10 w-10 rounded-full border-[3px] border-gray-200 border-t-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default CarLoadingOverlay;
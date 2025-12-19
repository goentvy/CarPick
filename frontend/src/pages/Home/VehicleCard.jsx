const VehicleCard = ({ discount, imageSrc, title, features, price, selected }) => {
  return (
    <div
      className={`relative bg-white rounded-[18px] shadow-md mb-4 w-full sm:w-[48%] ${
        selected ? "border-[3px] border-lime-300" : ""
      }`}
    >
      {/* 할인 라벨 */}
      {discount && (
        <div className="absolute top-3 right-2 bg-lime-300 text-xs font-bold px-2 py-1 rounded-lg">
          30% 할인가
        </div>
      )}

      {/* 차량 이미지 */}
      <img src={imageSrc} alt={title} className="w-full h-auto object-cover" />

      {/* 차량 정보 */}
      <div className="p-3">
        <h3 className="text-base font-semibold mb-1">{title}</h3>

        {/* 타이틀/설명 */}
        <p className="mb-3 text-sm text-gray-700">{features?.title}</p>

        {/* 옵션 칩 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {features?.option?.map((item, idx) => (
            <span
              key={idx}
              className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700"
            >
              {item}
            </span>
          ))}
        </div>

        <hr className="border-t-2 border-gray-200 mb-3" />

        {/* 가격 + 버튼 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">총 이용 금액</p>
            <p className="font-bold text-blue-500 text-2xl">
              {Number(price).toLocaleString()} 원
            </p>
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;

const VehicleCard = ({ discount, imageSrc, info, title, features, price, onClick }) => {
  const safePrice = Number(price ?? 0) || 0;
  const safeDiscount = Number(discount ?? 0) || 0;
  const discountedPrice = Math.floor(safePrice * (1 - safeDiscount / 100));

  const tags =
    typeof features === "string"
      ? features.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(features)
        ? features
        : Array.isArray(features?.option)
          ? features.option
          : [];

  return (
    <div
      className="
        relative bg-white w-full h-[330px] rounded-[18px] mb-4
        shadow-md overflow-hidden cursor-pointer transition-all duration-200
        outline outline-transparent hover:outline-[#C8FF48] hover:outline-[3px]
        flex flex-col
      "
      onClick={onClick}
    >
      {/* AI PICK 배지 */}
      <div className="absolute top-3 left-3 z-10">
        <span className="bg-[#C8FF48] text-white text-[12px] font-bold px-2 py-1 rounded-full">
          AI PICK
        </span>
      </div>

      {/* 할인 라벨 */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded-4xl">
          {safeDiscount}% 할인가
        </span>
      </div>

      {/* 이미지: 높이 고정 */}
      <div className="w-full h-[170px] bg-gray-100">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/common/car.png";
          }}
        />
      </div>

      {/* 정보 영역: 남는 공간 채우기 */}
      <div className="h-[160px] flex flex-col p-3 flex-1">
        <div>
          <h3 className="text-base font-bold">{title}</h3>

          {info && (
            <p className="text-[12px] text-gray-400 mt-0">
              {Object.values(info).join(" · ")}
            </p>
          )}
        </div>

        <div className="mt-6 text-right flex flex-wrap gap-2 justify-end">
          {tags.slice(0, 6).map((item, idx) => (
            <span
              key={idx}
              className="text-[12px] rounded-full bg-gray-100 px-3 py-1 text-gray-600"
            >
              {item}
            </span>
          ))}
        </div>


        {/* 가격 영역: 바닥에 고정 */}
        <div className="mt-auto">
          <hr className="border-t border-gray-200 my-2" />
          <div className="flex justify-end items-baseline gap-2">
            <div className="text-sm text-gray-400 line-through">
              {safePrice.toLocaleString("ko-KR")}원
            </div>
            <div className="text-2xl font-bold text-brand">
              {discountedPrice.toLocaleString("ko-KR")}원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
const CarCard = ({
  id,
  discount,
  discountRate,
  imageSrc,
  title,
  features,
  info,
  cost,
  price,
  day,
  onClick,
}) => {
  const tags =
    typeof features === "string"
      ? features.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(features)
        ? features
        : [];

  return (
    <div
      className="
  relative bg-white w-full h-[330px] rounded-[18px] mb-4
  shadow-md overflow-hidden cursor-pointer transition-all duration-200
  outline outline-transparent
  hover:outline-[#C8FF48] hover:outline-[3px]
"
      onClick={() => onClick?.(id)}
    >
      {/* 이미지 */}
      <div className="relative w-full h-[170px] bg-gray-100">
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png";
          }}
        />

        {discount && (
          <div className="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discountRate}% 할인가
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="h-[160px] p-3 flex flex-col">
        {/* TOP */}
        <div className="min-w-0">
          <h3 className="text-3 font-bold leading-tight truncate">
            {title}
          </h3>

          <p className="mt-5px text-[12px] text-gray-400 leading-tight">
            {Object.values(info).join(" · ")}
          </p>
        </div>

        {/* BOTTOM */}
        <div className="mt-auto">
          {/* 태그 */}
          <div className="flex flex-wrap justify-end gap-1 max-h-[44px] overflow-hidden">
            {tags.map((t) => (
              <span
                key={t}
                className="
                  text-[12px] bg-gray-100 text-gray-600
                  px-2.5 py-1 rounded-full
                "
              >
                {t}
              </span>
            ))}
          </div>

          <hr className="border-t border-gray-200 my-2" />

          {/* 가격 */}
          <div className="flex justify-end items-baseline gap-2">
            <span className="text-3 text-gray-400 line-through">
              {Number(cost ?? 0).toLocaleString()}원
            </span>

            <span className="text-2xl font-bold text-brand">
              {!day && <span className="text-3 mr-1">월</span>}
              {Number(price ?? 0).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

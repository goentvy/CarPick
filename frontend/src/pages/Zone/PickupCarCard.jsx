/**
 * ✅ BranchDetailPage 전용: "바로 픽업 차량" 카드
 * - 정보 밀도 낮고, 높이 짧게(리스트/그리드 최적)
 * - CarCard와 분리해서 이 섹션 요구사항에 맞게 사용
 */
export default function PickupCarCard({
  id,
  imageSrc,
  title,
  subtitle,        // 예: "2023년식 · 5인승"
  price,
  cost,
  discountRate,    // 있으면 배지
  onClick,
}) {
  const showDiscount = Number(discountRate ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="
        w-full text-left
        rounded-[18px] bg-white shadow-md overflow-hidden
        transition-all duration-200 outline outline-transparent
        hover:outline-[3px] hover:outline-[#C8FF48]
      "
    >
      {/* 이미지 */}
      <div className="relative w-full h-[120px] bg-gray-100">
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "http://carpicka.mycafe24.com/car_thumbnail/default_car_thumb.png";
          }}
        />

        {/* 할인 배지(선택) */}
        {showDiscount && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {discountRate}% 할인
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="p-3">
        <div className="font-semibold text-sm truncate text-[#111]">{title}</div>
        <div className="mt-1 text-xs text-black/50 truncate">{subtitle}</div>

        {/* 가격 */}
        <div className="mt-2 flex items-baseline justify-end gap-2">
          <span className="text-xs text-gray-400 line-through">
            {Number(cost ?? 0).toLocaleString()}원
          </span>
          <span className="text-base font-bold text-[#0A56FF]">
            {Number(price ?? 0).toLocaleString()}원
          </span>
        </div>
      </div>
    </button>
  );
}

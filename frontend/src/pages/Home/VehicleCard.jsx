const VehicleCard = ({ discount, imageSrc, title, features, price }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 mb-4 w-full sm:w-[48%]">
      {/* 할인 라벨 */}
      {discount && (
        <div className="absolute top-3 right-2 bg-lime-300 text-xs! font-bold px-2 py-1 rounded">
          30% 할인가
        </div>
      )}

      {/* 차량 이미지 */}
      <img src={imageSrc} alt={title} className="w-full h-32 object-cover rounded mb-3" />

      {/* 차량 정보 */}
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="mb-8">{features.title}</p>
      <p className="text-sm text-gray-600 mb-2 space-y-1 space-x-2">
        {features.option.map((item, idx) => (
            <button key={idx} className="rounded-4xl bg-gray-200 px-3 py-1">{item}</button>
        ))}
      </p>

      <hr className="border-t-2 border-gray-200 mb-2" />

      {/* 가격 */}
      <div className="flex flex-row justify-between">
        <div>
            <p className="text-sm text-gray-500">총 이용 금액</p>
            <p className="font-bold text-blue-500 text-2xl!">{price.toLocaleString()} 원</p>
        </div>

        {/* 버튼 */}
        <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 text-sm font-semibold">
            선택하기
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;

const CarCard = ({ discount, imageSrc, title, features, info, price }) => {
  return (
    <div className="relative bg-white rounded-[18px] shadow-md mb-4 w-full sm:w-[48%] outline outline-transparent hover:outline-[3px] hover:outline-lime-300 transition-all duration-200">
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
        <p className="xx:mb-4 sm:mb-8 xx:text-sm sm:text-base"></p>
        

        <hr className="border-t-2 border-gray-200 mb-2" />

        {/* 가격 */}
        <div className="flex flex-row justify-between">
          <div className="xx:text-xs sm:text-sm text-gray-600 mb-2 space-y-1 space-x-2">
            {features.option.map((item, idx) => (
                <button key={idx} className="rounded-4xl bg-gray-200 px-3 py-1">{item}</button>
            ))}
          </div>
          <div>
              <p className="text-sm text-gray-500">총 이용 금액</p>
              <p className="font-bold text-blue-500 text-2xl">{price.toLocaleString()} 원</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

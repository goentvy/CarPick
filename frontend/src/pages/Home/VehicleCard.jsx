const VehicleCard = ({ discount, imageSrc, title, features, price, onClick }) => {
  // 할인된 가격 계산
  const discountedPrice = Math.floor(price * (1 - discount / 100));
  return (
    <div 
      className="relative bg-white rounded-[18px] shadow-md mb-4 w-full sm:w-[48%] outline outline-transparent hover:outline-[3px] hover:outline-lime-300 transition-all duration-200"
      onClick={onClick}
    >
      {/* 할인 라벨 */}
      <div className="absolute top-3 right-3">
        <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded-4xl">{discount}% 할인가</span>
      </div>
      {/* 차량 이미지 */}
      <img src={imageSrc} alt={title} className="w-full h-auto object-cover" />

      {/* 차량 정보 */}
      <div className="flex flex-col p-3">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="xx:text-sm text-gray-400">
          {features.year} · {features.seat}
        </p>
        <div className="text-right xx:text-xs sm:text-sm text-gray-400 space-y-1 space-x-2 mt-3">
          {features.option.map((item, idx) => (
              <button key={idx} className="xx:text-xs rounded-4xl bg-gray-100 px-3 py-1">{item}</button>
          ))}
        </div>
        
        {/* 경계 라인 */}
        <hr className="border-t-2 border-gray-200 mb-2" />

        {/* 가격 */}
        <p className="text-right">
          <span className="line-through text-gray-400 mr-2">{price.toLocaleString()}원</span>
          <span className="font-bold text-brand xx:text-2xl xs:text-xl ">{discountedPrice.toLocaleString()} 원</span>
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;

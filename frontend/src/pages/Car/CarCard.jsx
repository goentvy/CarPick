import { useNavigate } from "react-router-dom";

const CarCard = ({ id, discount, discountRate, imageSrc, title, features, info, cost, price, day }) => {
  const navigate = useNavigate();
  const handleClickCar = (id) => {
        navigate(`/car/detail/${id}`);
    };

  return (
    <div className="relative bg-white rounded-[18px] shadow-md mb-4 w-full sm:w-[98%] outline outline-transparent hover:outline-[3px] hover:outline-lime-300 transition-all duration-200 shadow-lg overflow-hidden" onClick={() => handleClickCar(id)}>
      {/* 차량 이미지 */}
      <img src={imageSrc} alt={title} className="w-full h-auto object-cover" />

      {/* 차량 정보 */}
      <div className="p-3">
        <div className="flex flex-row justify-between items-start">
            <div>
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="xx:mb-4 sm:mb-8 xx:text-sm sm:text-base flex flex-wrap gap-2 text-gray-400">
                {Object.values(info).map((item, idx) => (
                    <span
                    key={idx}
                    className="py-1 text-[14px]"
                    >
                    {item}
                    </span>
                ))}
                </p>
            </div>
            {/* 할인 라벨 */}
            {discount && (
              <div className="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-lg">
                {discountRate}% 할인가
              </div>
            )}
        </div>
        <div className="xx:text-xs sm:text-sm text-gray-600 mb-2 space-y-1 space-x-2 text-right">
            {features.option.map((item, idx) => (
                <button key={idx} className="rounded-4xl bg-gray-100 px-3 py-1">{item}</button>
            ))}
        </div>
        

        <hr className="border-t-2 border-gray-200 mb-2" />

        {/* 가격 */}
        <div className="flex flex-row justify-end items-center">
          <p className="text-gray-400 text-[14px] line-through pr-2">{cost.toLocaleString()} 원</p>
          <p className="font-bold text-brand text-2xl text-right">{!day && <span className="text-[16px] mr-2">월</span>}{price.toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

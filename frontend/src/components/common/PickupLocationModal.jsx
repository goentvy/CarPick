import Modal from "./Modal";

const PickupLocationModal = ({ onClose, onSelect }) => {
  const domestic = [
    "강남점", "강서점", "김포공항점", "여수엑스포역점",
    "용산점", "인천공항점", "전라광주점"
  ];

  return (
    <Modal onClose={onClose}>
      {/* 모달 헤더 */}
      <div className="flex flex-row justify-between">
        <div className="font-lg font-bold p-3">대여장소</div>
        <div className="p-3 text-right">
          <img 
            src="./images/common/close.svg" 
            alt="close"
            onClick={() => onClose()}/>
        </div>
      </div>
      <div className="flex flex-row justify-between w-full border-t border-gray-300">
        <div className="flex-1 border-r border-r-gray-300 bg-gray-100">
          <ul>
            <li className="p-4 bg-brand text-white text-sm">
              CarPick 지점
            </li>
          </ul>
        </div>
        <div className="flex-1/4">
          <p className="px-4 py-2 text-xs font-semibold bg-gray-100">국내지점</p>
          <ul>
            { domestic.map((loc) => (
              <li 
                key={loc}
                onClick={() => {
                  onSelect(loc);
                  onClose();
                }}
                className="px-4 py-2 text-sm font-bold border-t border-gray-300 text-gray-800 cursor-pointer"
              >
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PickupLocationModal;

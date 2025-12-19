import Modal from "./Modal";

const PickupLocationModal = ({ onClose, onSelect }) => {
  const domestic = [
    "강남점", "강서점", "김포공항점", "여수엑스포역점",
    "용산점", "인천공항점", "전라광주점"
  ];

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold mb-2">CarPick 지정 지점</h3>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-600 mb-1">국내지점</p>
        {domestic.map((loc) => (
          <div
            key={loc}
            onClick={() => {
              onSelect(loc);
              onClose();
            }}
            className="px-3 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded cursor-pointer"
          >
            {loc}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PickupLocationModal;

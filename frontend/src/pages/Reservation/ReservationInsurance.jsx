import { useState } from "react";
import InsuranceDetailModal from "./InsuranceDetailModal";

const insuranceOptions = [
  {
    id: "none",
    label: "선택안함",
    description: "사고 시 고객부담금 전액",
    price: 0,
  },
  {
    id: "basic",
    label: "일반자차",
    description: "사고 시 고객부담금 30만원",
    price: 45000,
  },
  {
    id: "full",
    label: "완전자차",
    description: "사고 시 고객부담금 면제",
    price: 48000,
  },
];

const ReservationInsurance = ({ selected, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(selected || "full");
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (id) => {
    setSelectedOption(id);
    onSelect?.(id);
  };

  return (
    <div className="w-full max-w-[640px] xx:p-2 sm:p-4 xx:space-y-3 sm:space-y-4">
      <h2 className="xx:text-base sm:text-lg font-bold">어떤 보험을 선택할까요?</h2>
      <p className="xx:text-sm sm:text-base text-gray-600">상대방과 나를 보호하는 종합보험이 포함되어 있어요.</p>

      <ul className="xx:space-y-3 sm:space-y-4">
        {insuranceOptions.map((option) => (
          <li
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              selectedOption === option.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
            onClick={() => handleSelect(option.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              <div className="text-blue-500 font-bold">
                +{option.price.toLocaleString()}원
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="text-center">
        <span 
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setShowModal(true)}>
          보장내용을 알아볼까요?
        </span>
      </div>

      <InsuranceDetailModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ReservationInsurance;

import React from "react";
import Modal from "./Modal";

const PickupLocationModal = ({ onClose, onSelect }) => {
  const domestic = [
    {
      name: "강남점 카픽센터", 
      details: "서울역 / KTX • 지하 1층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "강서점 카픽센터", 
      details: "김포공항 / 1층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "김포공항점 카픽센터", 
      details: "김포공항 / 2층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "여수엑스포역점 카픽센터", 
      details: "여수엑스포역 / 3층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "용산점 카픽센터", 
      details: "용산역 / 4층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "인천공항점 카픽센터", 
      details: "인천공항 / 5층 주차장\n운영시간 07:00 ~ 23:00"
    },
    {
      name: "전라광주점 카픽센터", 
      details: "광주역 / 6층 주차장\n운영시간 07:00 ~ 23:00"
    }
  ];

  return (
    <Modal onClose={onClose}>
      {/* 모달 헤더 */}
      <div className="flex flex-row justify-between">
        <div className="font-lg font-bold p-3">어디서 출발 할까요?</div>
        <div className="p-3 text-right">
          <img 
            src="./images/common/close.svg" 
            alt="close"
            onClick={() => onClose()}/>
        </div>
      </div>
      <div className="flex w-full p-2 bg-blue-50 border border-gray-300 rounded-md mb-3">
        <span><i className="fa-solid fa-magnifying-glass"></i></span>
        <input type="search" placeholder="주소를 입력해주세요." className="w-full outline-none pl-4"/>
      </div>
      <div className="flex">
        <button type="button" className="w-full bg-blue-50 border border-gray-300 rounded-md py-3 mb-3 font-bold cursor-pointer">현재 위치에서 검색</button>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="w-full">
          <ul>
            { domestic.map((loc) => (
              <li 
                key={loc.name}
                onClick={() => {
                  onSelect(loc.name);
                  onClose();
                }}
                className="w-full bg-blue-50 px-2 border border-gray-300 rounded-md py-3 mb-3 cursor-pointer"
              >
                <h2 className="font-bold text-lg">{loc.name}</h2>
                <h4 className="text-sm">{loc.details.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}</h4>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PickupLocationModal;

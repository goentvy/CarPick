import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getBranches } from "@/services/zoneApi";

const PickupLocationModal = ({ onClose, onSelect }) => {
  const [domestic, setDomestic] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await getBranches(); // GET /api/branches
        if (!alive) return;

        const next = (res.data ?? []).map((b) => ({
          name: b.branchName, // "김포공항점" 등
          details: `${b.addressBasic ?? ""}\n운영시간:  ${b.businessHours ?? ""}`, // 주소 + 운영시간
        }));

        setDomestic(next);
      } catch (e) {
        console.error("getBranches fail", e);
        setDomestic([]); // 실패하면 빈 목록
      }
    })();

    return () => {
      alive = false;
    };
  }, []);
  return (
    <Modal onClose={onClose}>
      {/* 모달 헤더 */}
      <div className="flex flex-row justify-between">
        <div className="font-lg font-bold p-3">어디서 출발 할까요?</div>
        <div className="p-3 text-right">
          <img
            src="./images/common/close.svg"
            alt="close"
            onClick={() => onClose()} />
        </div>
      </div>
      <div className="flex w-full p-2 bg-blue-50 border border-gray-300 rounded-md mb-3">
        <span><i className="fa-solid fa-magnifying-glass"></i></span>
        <input type="search" placeholder="주소를 입력해주세요." className="w-full outline-none pl-4" />
      </div>
      <div className="flex">
        <button type="button" className="w-full bg-blue-50 border border-gray-300 rounded-md py-3 mb-3 font-bold cursor-pointer">현재 위치에서 검색</button>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="w-full">
          <ul>
            {domestic.map((loc) => (
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

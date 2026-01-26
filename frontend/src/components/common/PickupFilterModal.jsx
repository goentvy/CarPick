import RangeSlider from "./RangeSlider";
import FilterModal from "./FilterModal";

const PickupFilterModal = ({
  onClose,
  selectedLevel,
  setSelectedLevel,
  selectedFuel,
  setSelectedFuel,
  selectedPerson,
  setSelectedPerson,
  yearRange,
  setYearRange,
  priceRange,
  setPriceRange,
  onApply,
  onReset,
}) => {
  // ✅ 수입 추가
  const level = ["경형", "준중형", "중형", "승합RV", "SUV", "수입"];
  const fuel = ["휘발유", "경유", "LPG", "전기", "하이브리드", "수소"];
  const person = ["1~5인승", "6인승", "9인승 이상"];

  const toggleOption = (value, selected, setSelected) => {
    if (selected.includes(value)) setSelected(selected.filter((v) => v !== value));
    else setSelected([...selected, value]);
  };

  return (
    <FilterModal onClose={onClose} className="flex mx-auto">
      <div className="pb-4" id="carFilter">
        <div className="flex justify-between items-center shadow-lg p-4 mb-[10px]">
          {/* ✅ 필터 적용 */}
          <button
            type="button"
            onClick={() =>
              onApply({
                selectedLevel,
                selectedFuel,
                selectedPerson,
                yearRange,
                priceRange,
              })
            }
          >
            <img src="/images/common/chevron-left.svg" alt="" />
          </button>

          {/* 초기화 */}
          <button
            type="button"
            onClick={onReset}
            className="bg-blue-50 px-4 py-1 rounded-[50px] font-bold cursor-pointer"
          >
            초기화
          </button>
        </div>

        <div className="p-4">
          {/* 차량 등급 */}
          <div className="pop_info">
            <h3 className="text-lg font-bold mb-4">차량 등급</h3>
          </div>
          <div className="list grid grid-cols-3 gap-2 mb-5">
            {level.map((item) => (
              <label
                key={item}
                className={`filter-label ${selectedLevel.includes(item) ? "bg-blue-600 text-white" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedLevel.includes(item)}
                  onChange={() => toggleOption(item, selectedLevel, setSelectedLevel)}
                  className="filter-checkbox"
                />
                {item}
              </label>
            ))}
          </div>

          {/* 연료 */}
          <div className="pop_info">
            <h3 className="text-lg font-bold mb-4">연료</h3>
          </div>
          <div className="list grid grid-cols-3 gap-2 mb-5">
            {fuel.map((item) => (
              <label
                key={item}
                className={`filter-label ${selectedFuel.includes(item) ? "bg-blue-600 text-white" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedFuel.includes(item)}
                  onChange={() => toggleOption(item, selectedFuel, setSelectedFuel)}
                  className="filter-checkbox"
                />
                {item}
              </label>
            ))}
          </div>

          {/* 탑승인원 */}
          <div className="pop_info">
            <h3 className="text-lg font-bold mb-4">탑승인원</h3>
          </div>
          <div className="list grid grid-cols-3 gap-2 mb-5">
            {person.map((item) => (
              <label
                key={item}
                className={`filter-label ${selectedPerson.includes(item) ? "bg-blue-600 text-white" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedPerson.includes(item)}
                  onChange={() => toggleOption(item, selectedPerson, setSelectedPerson)}
                  className="filter-checkbox"
                />
                {item}
              </label>
            ))}
          </div>

          {/* 연식 */}
          <div className="pop_info">
            <RangeSlider
              title="연식"
              min={2010}
              max={new Date().getFullYear()}
              step={1}
              unit="년"
              value={yearRange}
              onChange={setYearRange}
            />
          </div>

          {/* 렌트 가격 */}
          <div className="pop_info">
            <RangeSlider
              title="렌트 가격"
              min={10000}
              max={1000000}
              step={10000}
              unit="원"
              value={priceRange}
              onChange={setPriceRange}
              format={(v) => new Intl.NumberFormat("ko-KR").format(v)}
            />
          </div>
        </div>
      </div>
    </FilterModal>
  );
};

export default PickupFilterModal;

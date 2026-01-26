// src/utils/carFilter.js

// UI(한글) -> enum(영문) 매핑 (보조)
const FUEL_ENUM_MAP = {
  휘발유: "GASOLINE",
  경유: "DIESEL",
  LPG: "LPG",
  전기: "ELECTRIC",
  하이브리드: "HYBRID",
  수소: "HYDROGEN",
};

const CLASS_ENUM_MAP = {
  경형: ["LIGHT"],
  준중형: ["COMPACT"],
  중형: ["MID"],
  SUV: ["SUV"],
  승합RV: ["RV", "VAN"],
  수입: ["IMPORT"],
};

function normalizeStr(s) {
  return (s ?? "").toString().trim();
}
function toUpper(s) {
  return normalizeStr(s).toUpperCase();
}

function splitLabels(car) {
  // ✅ 실제 응답 키: driveLabels (한글 CSV) 우선
  const raw = normalizeStr(car.driveLabels ?? car.drive_labels);
  if (!raw) return [];
  return raw.split(",").map((x) => x.trim()).filter(Boolean);
}

function getYear(car) {
  return Number(car.modelYear ?? car.modelYearBase ?? car.model_year_base ?? null);
}

function getSeat(car) {
  return Number(car.seatingCapacity ?? car.seating_capacity ?? null);
}

function getPrice(car) {
  const v =
    car.finalPrice ??
    car.final_price ??
    car.price ??
    car.originalPrice ??
    car.original_price ??
    null;

  if (v == null) return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

// ------------------ matchers ------------------
function matchLevel(car, selectedLevel) {
  if (!selectedLevel?.length) return true;

  const labels = splitLabels(car);
  const carClass = toUpper(car.carClass ?? car.car_class);

  return selectedLevel.some((ui) => {
    // 1) driveLabels 기반
    if (labels.includes(ui)) return true;
    if (ui === "경형" && (labels.includes("경차") || labels.includes("경형"))) return true;

    // 2) enum 기반(있으면)
    const enums = CLASS_ENUM_MAP[ui] ?? [];
    if (enums.length && enums.includes(carClass)) return true;

    // 3) 포함 매칭(유연)
    return labels.some((l) => l.includes(ui));
  });
}

function matchFuel(car, selectedFuel) {
  if (!selectedFuel?.length) return true;

  const labels = splitLabels(car);               // ["가솔린","EV","SUV"...]
  const fuelEnum = toUpper(car.fuelType ?? car.fuel_type); // "GASOLINE" 등

  return selectedFuel.some((ui) => {
    // 1) driveLabels 직접 매칭
    if (labels.includes(ui)) return true;

    // 2) 한글 동의어 보강 (핵심)
    if (ui === "휘발유" && (labels.includes("가솔린") || labels.includes("휘발유"))) return true;
    if (ui === "경유" && (labels.includes("디젤") || labels.includes("경유"))) return true;
    if (ui === "전기" && (labels.includes("EV") || labels.includes("전기"))) return true;
    if (ui === "하이브리드" && (labels.includes("하이브리드") || labels.includes("HEV"))) return true;
    if (ui === "수소" && (labels.includes("수소") || labels.includes("FCEV"))) return true;
    if (ui === "LPG" && labels.includes("LPG")) return true;

    // 3) enum 기반(백에서 내려오면 이걸로도 잡힘)
    const mapped = FUEL_ENUM_MAP[ui];
    if (mapped && mapped === fuelEnum) return true;

    return false;
  });
}


function matchPerson(car, selectedPerson) {
  if (!selectedPerson?.length) return true;

  const seat = getSeat(car);
  if (!seat) return false;

  return selectedPerson.some((ui) => {
    if (ui === "1~5인승") return seat >= 1 && seat <= 5;
    if (ui === "6인승") return seat === 6;
    if (ui === "9인승 이상") return seat >= 9;
    return true;
  });
}

function matchYear(car, yearRange) {
  if (!yearRange?.length) return true;

  const y = getYear(car);
  if (!y) return false;

  const [minY, maxY] = yearRange;
  return y >= minY && y <= maxY;
}

function matchPrice(car, priceRange) {
  if (!priceRange?.length) return true;

  const p = getPrice(car);

  // ✅ 너 구조상 가격은 /api/price 이후에 붙음 → 없으면 일단 통과
  if (p == null) return true;

  const [minP, maxP] = priceRange;
  return p >= minP && p <= maxP;
}

// ------------------ final ------------------
export function filterCars(cars, filters) {
  const {
    selectedLevel = [],
    selectedFuel = [],
    selectedPerson = [],
    yearRange = null,
    priceRange = null,
  } = filters ?? {};

  return (cars ?? []).filter((car) => {
    return (
      matchLevel(car, selectedLevel) &&
      matchFuel(car, selectedFuel) &&
      matchPerson(car, selectedPerson) &&
      matchYear(car, yearRange) &&
      matchPrice(car, priceRange)
    );
  });
}

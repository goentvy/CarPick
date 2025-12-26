import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpinVideo from "../../components/car/SpinVideo.jsx";
import CarDetailMap from "../../components/car/CarDetailMap.jsx";
import { getCarDetail } from "@/services/carApi";
import { createGlobalStyle } from "styled-components";

const HideHeaderFooter = createGlobalStyle`
  #head, #footer {
    display: none !important;
  }
`;

/** ---------- UI Parts ---------- */
const InfoTile = ({ icon, title }) => (
  <div className="rounded-2xl bg-[#EEF3FF] p-4 min-h-[138px] flex flex-col justify-between">
    <div className="text-base font-medium text-[#1A1A1A] leading-snug">
      {title}
    </div>
    <div className="text-xl">{icon}</div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="mt-8 mb-3 text-base font-semibold text-[#111]">{children}</h2>
);

/** ---------- Icons (assets on FE) ---------- */
const ICON = {
  gas: "/images/common/icon_car_gas.svg",
  year: "/images/common/icon_car_side.svg",
  group: "/images/common/icon_car_group.svg",
  user26: "/images/common/icon_car_year.svg",
  user21: "/images/common/icon_car_user21.svg",
  data: "/images/common/icon_car_data.svg",
  share: "/images/common/icon_car_share.svg",
};

const CARD_ICON_MAP = {
  fuel: ICON.gas,
  year: ICON.year,
  seats: ICON.group,
  career: ICON.user26,
  age: ICON.user21,
  fuel_eff: ICON.data,
};

/** ---------- Adapter: BE cards -> UI cards (6 fixed) ---------- */
function normalizeCards(cards) {
  const byType = {};
  (cards ?? []).forEach((c) => {
    if (!c?.type) return;
    byType[String(c.type).toUpperCase()] = c;
  });

  const slots = ["FUEL", "YEAR", "SEATS", "CAREER", "AGE", "FUEL_EFF"];

  return slots.map((type) => {
    const c = byType[type] ?? {};
    const hasValue = c.value !== undefined && c.value !== null;
    const valueText = hasValue ? `${String(c.value)}${c.unit ?? ""}` : null;

    let displayText = "정보 준비 중이에요.";
    if (valueText) {
      switch (type) {
        case "FUEL":
          displayText = `${valueText} 차량이에요.`;
          break;
        case "YEAR":
          displayText = `${valueText}식이에요.`;
          break;
        case "SEATS":
          displayText = `최대 ${valueText} 탑승 가능해요.`;
          break;
        case "CAREER":
          displayText = `운전경력 ${valueText} 필요해요.`;
          break;
        case "AGE":
          displayText = `만 ${valueText}만 이용 가능해요.`;
          break;
        case "FUEL_EFF":
          displayText = `연비는 약 ${valueText}예요.`;
          break;
        default:
          break;
      }
    }

    // icon 키가 BE에서 "fuel" 같은 소문자일 수도, "FUEL" 같은 값일 수도 있어서 방어
    const iconKey = c.icon ? String(c.icon).toLowerCase() : null;

    return {
      type,
      iconKey, // fuel | year | seats | career | age | fuel_eff
      title: c.title,
      displayText,
    };
  });
}

export default function CarDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const spinRef = useRef(null);

  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
  if (!id) return;

  console.log("🚗 carId:", id);

  getCarDetail(id)
    .then((res) => {
      console.log("✅ API 응답:", res.data);
      setCar(res.data);
    })
    .catch((e) => {
      console.error("❌ API 에러:", e?.response?.status, e?.response?.data, e);
      setCar(null);
      setErrorText("차량 정보를 불러오지 못했어요.");
    })
    .finally(() => setLoading(false));
}, [id]);


  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setErrorText("");

    getCarDetail(id)
      .then((res) => {
        if (!mounted) return;
        setCar(res.data);
      })
      .catch((e) => {
        if (!mounted) return;
        console.error(e);
        setCar(null);
        setErrorText("차량 정보를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 1400);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        showToast("공유창을 열었어요");
        return;
      }
    } catch {
      // ignore
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast("링크를 복사했어요");
    } catch {
      const ok = window.prompt("복사해서 공유하세요:", url);
      if (ok !== null) showToast("링크를 준비했어요");
    }
  };

  const top = car?.topCarDetailDto;
  const cards = car?.carCardSectionDto?.cards ?? [];
  const pickup = car?.locationDto?.pickup;
  const uiCards = normalizeCards(cards);

  return (
    <div className="min-h-screen bg-white">
      <HideHeaderFooter />

      {/* 640 컨테이너 */}
      <div className="mx-auto w-full max-w-[640px] pb-28">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-black/5">
          <div className="h-[60px] px-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-black/5 active:scale-95 transition"
              aria-label="뒤로가기"
            >
              ←
            </button>

            <div className="text-sm font-semibold text-[#111]">상세 정보</div>

            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 grid place-items-center rounded-full transition active:scale-95 active:bg-black/10"
              aria-label="링크 공유"
            >
              <img src={ICON.share} className="w-6 h-6" alt="공유" />
            </button>
          </div>
        </header>

        {/* Hero (360 영상) */}
        <div className="relative bg-[#E9EAEE] overflow-hidden mt-1">
          <button
            type="button"
            onClick={() => spinRef.current?.prev?.()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full bg-white/80 backdrop-blur grid place-items-center
              cursor-pointer hover:bg-white active:scale-95 transition"
            aria-label="이전 각도"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => spinRef.current?.next?.()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full bg-white/80 backdrop-blur grid place-items-center
              cursor-pointer hover:bg-white active:scale-95 transition"
            aria-label="다음 각도"
          >
            ›
          </button>

          <SpinVideo
            ref={spinRef}
            src="/assets/spin/car_spin_01.mp4"
            className="w-full"
            dragWidth={640}
          />
        </div>

        <section className="px-8 pt-4">
          {/* Title */}
          <div className="mt-4">
            <h1 className="text-[20px] font-bold text-[#111] leading-snug">
              {top?.title ?? "차량 정보"}
            </h1>
            <p className="mt-1 text-xs text-[#7A7A7A]">{top?.subtitle ?? ""}</p>

            {loading && (
              <div className="mt-2 text-[11px] text-[#8A8A8A]">
                데이터를 불러오는 중이에요…
              </div>
            )}

            {!loading && errorText && (
              <div className="mt-2 text-[11px] text-red-500">{errorText}</div>
            )}
          </div>

          {/* AI Summary Card: 실데이터 우선, 없으면 빈칸 */}
          <div className="mt-4 rounded-3xl bg-[#EEF3FF] p-5">
            <div className="text-xs font-bold text-[#1D6BF3]">
              AI가 정리한 이 차량의 한 줄 요약
            </div>
            <p className="mt-2 text-sm text-[#1A1A1A] leading-snug">
              {top?.aiSummary ?? "요약 정보를 준비 중이에요."}
            </p>
          </div>

          {/* 차량정보 (6개 고정, 데이터 적용) */}
          <SectionTitle>차량정보</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            {uiCards.map((c) => {
              const iconSrc = c.iconKey
                ? CARD_ICON_MAP[c.iconKey] ?? ICON.data
                : ICON.data;

              return (
                <InfoTile
                  key={c.type}
                  icon={
                    <img
                      src={iconSrc}
                      className="w-8 h-8 opacity-70"
                      alt={c.title ?? c.type}
                    />
                  }
                  title={c.displayText}
                />
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl bg-[#F6F7FA] p-4 text-xs text-[#6B6B6B] leading-relaxed">
            <div className="font-semibold text-[#111] mb-2">주행요금 안내</div>
            주행요금은 실제 주행거리 기준으로만 계산돼요. 별도의 주유비나 충전료
            정산 없이, 이용 요금에 포함돼요. (주행요금 단가는 차량 및 상품에
            따라 달라질 수 있어요.)
          </div>

          {/* 후기 (임시 유지) */}
          <SectionTitle>
            {top?.title ?? "이 차량을"}
            <br />
            탄 사람들 이야기
          </SectionTitle>

          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-white border border-black/5 shadow-sm p-4 ${
                idx === 0 ? "mt-5" : "mt-3"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#111]">
                    (임시) 리뷰 데이터 준비 중
                  </div>
                  <div className="mt-1 text-xs text-[#2B56FF]">★★★★★</div>
                  <p className="mt-2 text-sm text-[#333] leading-relaxed">
                    리뷰 영역은 추후 API 연동으로 교체하면 돼요.
                  </p>
                </div>
                <div className="text-xs text-[#8A8A8A] whitespace-nowrap">
                  -
                </div>
              </div>
              <div className="mt-3 text-xs text-[#6B6B6B]">-</div>
            </div>
          ))}

          {/* 세차 이미지 */}
          <SectionTitle>99.9% 살균 세차</SectionTitle>
          <p className="text-sm text-[#333] leading-snug">
            고온 스팀으로 실내를 살균하고
            <br />
            냄새와 얼룩까지 깔끔하게 관리합니다.
          </p>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              "/images/common/img_clean_01.png",
              "/images/common/img_clean_02.png",
              "/images/common/img_clean_03.png",
            ].map((src, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#E9EAEE] h-[120px] overflow-hidden transition hover:scale-[1.02] active:scale-95"
              >
                <img
                  src={src}
                  alt="살균 세차 이미지"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* 대여 장소 */}
          <SectionTitle>대여 장소</SectionTitle>
          <CarDetailMap pickup={pickup} label="대여 장소" />

          {/* FAQ */}
          <SectionTitle>자주 묻는 질문</SectionTitle>
          <div className="rounded-2xl bg-white border border-black/5 divide-y">
            {[
              [
                "Q. 이 차량, 보험료/면책금이 있나요?",
                "A. 기본 보험이 포함되며, 면책금은 상품에 따라 달라요.",
              ],
              [
                "Q. 딜리버리로 이용해도 되나요?",
                "A. 가능해요. 옵션에서 딜리버리를 선택하면 돼요.",
              ],
              [
                "Q. 차량 상태는 어떻게 확인하나요?",
                "A. 360 뷰/사진/후기/점검 정보로 확인할 수 있어요.",
              ],
            ].map(([q, a], idx) => (
              <div key={idx} className="p-4">
                <div className="text-sm font-semibold text-[#111]">{q}</div>
                <div className="mt-1 text-sm text-[#444]">{a}</div>
              </div>
            ))}
          </div>

          {toast && (
            <div
              className="fixed left-1/2 bottom-20 -translate-x-1/2 z-50 px-3 py-2 rounded-full bg-black/80 text-white text-xs"
              role="status"
              aria-live="polite"
            >
              {toast}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Sticky CTA */}
      <footer className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-[640px] bg-white border-t border-black/5 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <button className="w-full h-12 rounded-2xl bg-[#0A56FF] text-white font-semibold active:scale-[0.98] transition">
            예약하기
          </button>
        </div>
      </footer>
    </div>
  );
}

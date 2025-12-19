import { useRef, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import SpinVideo from "../../components/car/SpinVideo.jsx";
import carDetailMock from "@/mocks/carDetail.json";


const InfoTile = ({ icon, title }) => (
  <div className="rounded-2xl bg-[#EEF3FF] p-4 min-h-[138px] flex flex-col justify-between">
    <div className="text-base font-medium text-[#1A1A1A] leading-snug">
      {title}
    </div>
    <div className="text-xl">{icon}</div>
  </div>
);

const ICON = {
  gas: "/images/common/icon_car_gas.svg",
  year: "/images/common/icon_car_side.svg",
  group: "/images/common/icon_car_group.svg",
  user26: "/images/common/icon_car_year.svg",
  user21: "/images/common/icon_car_user21.svg",
  data: "/images/common/icon_car_data.svg",
  share: "/images/common/icon_car_share.svg",
};

const SectionTitle = ({ children }) => (
  <h2 className="mt-8 mb-3 text-base font-semibold text-[#111]">{children}</h2>
);

export default function CarDetailPage() {
  const data = carDetailMock;
  const nav = useNavigate();

  const spinRef = useRef(null);
  const [toast, setToast] = useState("");

  // ✅ 변경: timer는 ref로 관리 (안전)
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 1400);
  };

  const handleShare = async () => {
    const url = window.location.href;

    // ✅ 변경: Web Share API 우선(모바일에서 앱처럼)
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        showToast("공유창을 열었어요");
        return;
      }
    } catch (e) {
      // 사용자가 공유 취소해도 여기로 올 수 있음 → 그냥 fallback으로 진행
    }

    // fallback: 링크 복사
    try {
      await navigator.clipboard.writeText(url);
      showToast("링크를 복사했어요");
    } catch (e) {
      const ok = window.prompt("복사해서 공유하세요:", url);
      if (ok !== null) showToast("링크를 준비했어요");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 640 컨테이너 */}
      <div className="mx-auto w-full max-w-[640px] pb-28">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-black/5">
          <div className="h-12 px-4 flex items-center justify-between">
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
          {/* 좌 버튼 */}
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

          {/* ✅ 변경: 우 버튼 크기 통일(w-9 h-9) */}
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
              더 뉴 쏘렌토 4세대 (MQ4) HEV 1.6 2WD 그래비티
            </h1>
            <p className="mt-1 text-xs text-[#7A7A7A]">
              2024년식 · 5인승 · 하이브리드 SUV
            </p>
          </div>

          {/* AI Summary Card */}
          <div className="mt-4 rounded-3xl bg-[#EEF3FF] p-5">
            <div className="text-xs font-bold text-[#1D6BF3]">
              AI가 정리한 이 차량의 한 줄 요약
            </div>
            <p className="mt-2 text-sm text-[#1A1A1A] leading-snug">
              유지비를 아끼면서도 가족과 편하게 탈 수 있는, 연비 좋은 패밀리 LPG
              차량입니다. <br />
              연식 2024년식LPG크루즈 컨트롤차선 이탈 경보열선시트·핸들
            </p>
          </div>

          {/* 차량정보 */}
          <SectionTitle>차량정보</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            <InfoTile
              icon={<img src={ICON.gas} className="w-8 h-8 opacity-70" alt="연료" />}
              title="하이브리드 차량이에요."
            />
            <InfoTile
              icon={<img src={ICON.year} className="w-8 h-8 opacity-70" alt="연식" />}
              title="2024년식이에요."
            />
            <InfoTile
              icon={<img src={ICON.group} className="w-8 h-8 opacity-70" alt="탑승" />}
              title="최대 4인 탑승 가능해요."
            />
            <InfoTile
              icon={<img src={ICON.user26} className="w-8 h-8 opacity-70" alt="경력" />}
              title="운전경력 1년 이상 필요해요."
            />
            <InfoTile
              icon={<img src={ICON.user21} className="w-8 h-8 opacity-70" alt="나이" />}
              title="만 21세 이상만 이용 가능해요."
            />
            <InfoTile
              icon={<img src={ICON.data} className="w-8 h-8 opacity-70" alt="연비" />}
              title="연비는 약 ○○km/L예요."
            />
          </div>

          <div className="mt-3 rounded-2xl bg-[#F6F7FA] p-4 text-xs text-[#6B6B6B] leading-relaxed">
            <div className="font-semibold text-[#111] mb-2">주행요금 안내</div>
            주행요금은 실제 주행거리 기준으로만 계산돼요. 별도의 주유비/충전료
            정산 없이, 이용 요금에 포함돼요. (주행요금 단가는 차량/상품에 따라
            달라질 수 있어요.)
          </div>

          {/* 후기 */}
          <SectionTitle>
            더 뉴 쏘렌토를<br />탄 사람들 이야기
          </SectionTitle>

          {/* (후기 3개 동일한 건 일단 유지: 최소 수정 원칙) */}
          <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 mt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#111]">
                  CARNIVAL KA4 (G) 3.5
                </div>
                <div className="mt-1 text-xs text-[#2B56FF]">★★★★★</div>
                <p className="mt-2 text-sm text-[#333] leading-relaxed">
                  가족끼리 여행다니기에는 카니발만한 차가 없는 것 같습니다. 짐도
                  많이 싣고 장거리도 편했어요.
                </p>
              </div>
              <div className="text-xs text-[#8A8A8A] whitespace-nowrap">
                3일 전
              </div>
            </div>
            <div className="mt-3 text-xs text-[#6B6B6B]">50대 남성</div>
          </div>

          <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 mt-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#111]">
                  CARNIVAL KA4 (G) 3.5
                </div>
                <div className="mt-1 text-xs text-[#2B56FF]">★★★★★</div>
                <p className="mt-2 text-sm text-[#333] leading-relaxed">
                  가족끼리 여행다니기에는 카니발만한 차가 없는 것 같습니다. 짐도
                  많이 싣고 장거리도 편했어요.
                </p>
              </div>
              <div className="text-xs text-[#8A8A8A] whitespace-nowrap">
                3일 전
              </div>
            </div>
            <div className="mt-3 text-xs text-[#6B6B6B]">50대 남성</div>
          </div>

          <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 mt-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#111]">
                  CARNIVAL KA4 (G) 3.5
                </div>
                <div className="mt-1 text-xs text-[#2B56FF]">★★★★★</div>
                <p className="mt-2 text-sm text-[#333] leading-relaxed">
                  가족끼리 여행다니기에는 카니발만한 차가 없는 것 같습니다. 짐도
                  많이 싣고 장거리도 편했어요.
                </p>
              </div>
              <div className="text-xs text-[#8A8A8A] whitespace-nowrap">
                3일 전
              </div>
            </div>
            <div className="mt-3 text-xs text-[#6B6B6B]">50대 남성</div>
          </div>

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
          {/* 대여 및 반납장소 */}
          <SectionTitle>대여 및 반납장소</SectionTitle>
          <div className="mt-3 rounded-2xl h-40 bg-white border border-black/5 p-4">

          </div>

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
          <button className=" w-full h-12 rounded-2xl bg-[#0A56FF] text-white font-semibold active:scale-[0.98] transition">
            예약하기
          </button>
        </div>
      </footer>
    </div>
  );
}
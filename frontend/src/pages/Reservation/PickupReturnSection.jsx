import { useEffect, useMemo, useState } from "react";
import useReservationStore from "../../store/useReservationStore";
import api from "../../services/api";

const PickupReturnSection = ({ pickup, dropoff, startDateTime, endDateTime }) => {
  // ✅ store
  const pickupReturn = useReservationStore((state) => state.pickupReturn);
  const setReturnType = useReservationStore((state) => state.setReturnType);
  const setDropzoneId = useReservationStore((state) => state.setDropzoneId);
  const setRentalPeriod = useReservationStore((state) => state.setRentalPeriod);

  // ✅ 드롭존 목록은 A안 기준: UI(local state)에서만 관리
  const [dropzones, setDropzones] = useState([]);
  const [dzLoading, setDzLoading] = useState(false);
  const [dzError, setDzError] = useState(null);

  // dropoff에서 branchId 뽑기 (프로퍼티명은 프로젝트에 맞춰 조정)
  const returnBranchId = useMemo(() => {
    return dropoff?.branchId ?? dropoff?.id ?? null;
  }, [dropoff]);

  const returnType = (pickupReturn?.returnType ?? "VISIT").toUpperCase();
  const selectedDropzoneId = pickupReturn?.dropzoneId ?? "";

  // ✅ 날짜도 store에 같이 저장 (기존 로직 유지)
  useEffect(() => {
    if (startDateTime && endDateTime) {
      setRentalPeriod({ startDateTime, endDateTime });
    }
  }, [startDateTime, endDateTime, setRentalPeriod]);

  // ✅ returnType이 DROPZONE일 때만 드롭존 목록 조회
  useEffect(() => {
    const shouldFetch = returnType === "DROPZONE" && !!returnBranchId;
    if (!shouldFetch) return;

    const fetchDropzones = async () => {
      try {
        setDzLoading(true);
        setDzError(null);

        const res = await api.get("/dropzones", {
          params: { branchId: returnBranchId },
        });

        // 활성 드롭존만 (원하시면 필터 제거 가능)
        const active = Array.isArray(res.data)
          ? res.data.filter((d) => d?.isActive !== false)
          : [];

        setDropzones(active);

        // ✅ 선택값이 없으면 첫 번째를 자동 선택(선택 UX 편하게)
        if (!pickupReturn?.dropzoneId && active.length > 0) {
          setDropzoneId(active[0].dropzoneId);
        }
      } catch (e) {
        setDzError(e);
      } finally {
        setDzLoading(false);
      }
    };

    fetchDropzones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnType, returnBranchId]);

  // ✅ 반납 방식 변경
  const handleReturnTypeChange = (next) => {
    const nextType = String(next).toUpperCase(); // VISIT / DROPZONE
    setReturnType(nextType);

    // VISIT로 바꾸면 dropzoneId는 store에서 자동 null 처리(앞서 작성한 setReturnType 기준)
    // DROPZONE으로 바꾼 경우는 useEffect에서 목록 fetch + 자동 선택 처리
  };

  // ✅ 드롭존 선택 (드롭다운)
  const handleDropzoneSelect = (e) => {
    const id = Number(e.target.value);
    if (!Number.isFinite(id)) return;
    setDropzoneId(id); // A안: 선택값만 store에 저장
  };

  return (
    <section className="w-full max-w-[640px] xx:p-2 sm:p-4">
      <h2 className="xx:text-base sm:text-lg font-semibold mb-2">대여 및 반납</h2>

      {/* 반납 방식 탭 (업체 방문 / 드롭존 반납) */}
      <div className="flex xx:justify-center sm:justify-normal space-x-2 mt-1">
        <button
          type="button"
          onClick={() => handleReturnTypeChange("VISIT")}
          className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${returnType === "VISIT"
            ? "bg-blue-100 text-brand border-blue-500"
            : "bg-white text-brand border-gray-300 hover:bg-blue-100"
            }`}
        >
          업체 방문
        </button>

        <button
          type="button"
          onClick={() => handleReturnTypeChange("DROPZONE")}
          className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors duration-200 ${returnType === "DROPZONE"
            ? "bg-blue-100 text-brand border-blue-500"
            : "bg-white text-brand border-gray-300 hover:bg-blue-100"
            }`}
        >
          드롭존 반납
        </button>
      </div>

      {/* 기본 지점 정보 */}
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <p>
          <strong>지점: </strong>
          {pickup?.branchName ?? ""}
        </p>



        <p>
          <strong>주소: </strong>
          {pickup?.address ?? ""}
        </p>
      </div>




      {/*  DROPZONE 선택 UI (돋보기 → 드롭다운) */}
      {returnType === "DROPZONE" && (
        <div className="mt-4 p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">드롭존 선택</h3>
            <span className="text-xs text-gray-500">
              지점({returnBranchId ?? "-"}) 기준
            </span>
          </div>

          {!returnBranchId && (
            <div className="text-sm text-red-500">
              반납 지점(branchId)이 없어 드롭존을 불러올 수 없습니다.
            </div>
          )}

          {dzLoading && <div className="text-sm">드롭존 불러오는 중...</div>}

          {dzError && (
            <div className="text-sm text-red-500">
              드롭존 조회 실패: {String(dzError?.message ?? dzError)}
            </div>
          )}

          {!dzLoading && !dzError && returnBranchId && (
            <>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedDropzoneId || (dropzones[0]?.dropzoneId ?? "")}
                onChange={handleDropzoneSelect}
              >
                {dropzones.map((dz) => (
                  <option key={dz.dropzoneId} value={dz.dropzoneId}>
                    {dz.dropzoneName} (도보 {dz.walkingTimeMin}분)
                  </option>
                ))}
              </select>

              {/* 선택된 드롭존 상세 */}
              {dropzones.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  {(() => {
                    const selected =
                      dropzones.find((d) => d.dropzoneId === Number(selectedDropzoneId)) ??
                      dropzones[0];

                    if (!selected) return null;

                    return (
                      <>
                        <div className="font-medium">{selected.dropzoneName}</div>
                        <div className="mt-1">{selected.addressText}</div>
                        <div className="mt-1 text-gray-500">
                          운영시간: {selected.serviceHours} / 도보 {selected.walkingTimeMin}분
                        </div>
                        {selected.locationDesc && (
                          <div className="mt-1 text-gray-500">{selected.locationDesc}</div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {dropzones.length === 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  사용 가능한 드롭존이 없습니다.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default PickupReturnSection;

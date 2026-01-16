import { useEffect, useMemo, useState } from "react";
import { getZoneMap, getDropzoneStatus } from "@/services/zoneApi.js";

export function useZoneMap() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getZoneMap({ signal: ac.signal });
        const { branches = [], dropzones = [] } = res.data || {};

        // 1) 기본 zones 생성
        const baseZones = [
          ...branches.map((b) => ({
            id: `B-${b.branchId}`,
            kind: "BRANCH",
            branchId: b.branchId,
            name: b.branchName,
            address: b.addressBasic,
            lat: Number(b.latitude),
            lng: Number(b.longitude),
          })),

          ...dropzones.map((d) => ({
            id: `D-${d.dropzoneId}`,
            kind: "DROP",
            dropzoneId: d.dropzoneId, // ✅ numeric
            branchId: d.branchId,
            parentZoneId: `B-${d.branchId}`,
            name: d.dropzoneName,
            address: d.addressText,
            lat: Number(d.latitude),
            lng: Number(d.longitude),
            walkingTimeMin: d.walkingTimeMin,
            locationDesc: d.locationDesc,
            isActive: d.isActive === true || d.isActive === 1,
          })),
        ];

        // 2) 드롭존들 status 병합 (단건 API를 병렬 호출)
        const drops = baseZones.filter((z) => z.kind === "DROP");

        const statusList = await Promise.all(
          drops.map(async (dz) => {
            try {
              const sres = await getDropzoneStatus(dz.dropzoneId, {
                signal: ac.signal,
              });
              // 예상: { dropzoneId, status, label, ... } 형태
              return { id: dz.id, data: sres.data };
            } catch (e) {
              // 일부 실패해도 전체는 살려두기
              if (e?.name === "CanceledError" || e?.name === "AbortError") return null;
              console.warn("[dropzone status fail]", dz.dropzoneId, e);
              return { id: dz.id, data: null };
            }
          })
        );

        const statusMap = new Map(
          statusList
            .filter(Boolean)
            .map((x) => [x.id, x.data])
        );

        const nextZones = baseZones.map((z) => {
          if (z.kind !== "DROP") return z;

          const st = statusMap.get(z.id);
          return {
            ...z,
            // ✅ ZoneMapKakao가 읽는 필드명으로 맞춰줌
            status: st?.status, // FREE | NORMAL | CROWDED | FULL
            label: st?.label,   // 여유 | 보통 | 혼잡 | 만차
            occupancyRate: st?.occupancyRate,
            currentCount: st?.currentCount,
            capacity: st?.capacity,
            measuredAt: st?.measuredAt,
          };
        });

        if (!ac.signal.aborted) setZones(nextZones);
      } catch (e) {
        if (e?.name === "CanceledError" || e?.name === "AbortError") return;
        console.error("zone map load fail", e);
        setZones([]);
        setError(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const branchItems = useMemo(() => zones.filter((z) => z.kind === "BRANCH"), [zones]);
  const firstBranch = useMemo(() => branchItems[0] ?? null, [branchItems]);

  return { zones, branchItems, firstBranch, loading, error };
}

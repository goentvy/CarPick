import { useEffect, useMemo, useState } from "react";
import { getZoneMap } from "@/services/zoneApi.js";

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

        // ✅ axios면 getZoneMap 내부에서 signal 전달 가능하게 해두면 베스트
        const res = await getZoneMap({ signal: ac.signal });

        const { branches = [], dropzones = [] } = res.data || {};

        const nextZones = [
          ...branches.map((b) => ({
            id: `B-${b.branchId}`,
            kind: "BRANCH",
            name: b.branchName,
            address: b.addressBasic,
            lat: Number(b.latitude),
            lng: Number(b.longitude),
            open: b.open,
            close: b.close,
            images: b.images ?? [],
          })),

          ...dropzones.map((d) => ({
            id: `D-${d.dropzoneId}`,
            kind: "DROP",
            parentZoneId: `B-${d.branchId}`,
            name: d.dropzoneName,
            address: d.addressText,
            lat: Number(d.latitude),
            lng: Number(d.longitude),
            walkingTimeMin: d.walkingTimeMin,
            locationDesc: d.locationDesc,
            isActive: d.isActive === true || d.isActive === 1,
            crowdStatus: d.status ?? d.crowdLevel ?? null,
            crowdLabel: d.label ?? null,
            measuredAt: d.measuredAt ?? null,
          })),
        ];

        setZones(nextZones);
      } catch (e) {
        // ✅ Abort는 에러로 취급 안 함
        if (e?.name === "CanceledError" || e?.name === "AbortError") return;
        console.error("zone map load fail", e);
        setZones([]);
        setError(e);
      } finally {
        // ✅ StrictMode에서도 항상 로딩 내려가게
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => {
      ac.abort();
    };
  }, []);

  const branchItems = useMemo(
    () => zones.filter((z) => z.kind === "BRANCH"),
    [zones]
  );

  const firstBranch = useMemo(() => branchItems[0] ?? null, [branchItems]);

  return { zones, branchItems, firstBranch, loading, error };
}

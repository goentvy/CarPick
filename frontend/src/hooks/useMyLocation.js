import { useCallback, useEffect, useState } from "react";

/**
 * ✅ 내 위치 훅
 * - 권한 체크 → 모달 오픈/트래킹 상태 결정
 * - requestMyLocation()으로 1회 요청
 * - trackingOn이면 watchPosition으로 지속 업데이트
 */
export function useMyLocation() {
  const [myPos, setMyPos] = useState(null);
  const [locModalOpen, setLocModalOpen] = useState(false);
  const [trackingOn, setTrackingOn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkPermission() {
      try {
        if (!navigator.permissions) {
          if (mounted) setLocModalOpen(true);
          return;
        }

        const res = await navigator.permissions.query({ name: "geolocation" });
        if (!mounted) return;

        if (res.state === "granted") {
          setLocModalOpen(false);
          setTrackingOn(true);
        } else {
          setLocModalOpen(true);
          setTrackingOn(false);
        }
      } catch {
        if (mounted) setLocModalOpen(true);
      }
    }

    checkPermission();
    return () => {
      mounted = false;
    };
  }, []);

  const requestMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocModalOpen(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocModalOpen(false);
        setTrackingOn(true);
      },
      () => {
        setLocModalOpen(false);
        setTrackingOn(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!trackingOn) return;
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setMyPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.log("위치 오류:", err),
      { enableHighAccuracy: false, maximumAge: 10000, timeout: 8000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingOn]);

  return { myPos, locModalOpen, setLocModalOpen, requestMyLocation };
}

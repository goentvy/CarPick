import ZoneMapKakao from "../../components/zone/ZoneMapKakao.jsx";

export default function CarDetailMap({ pickup }) {
  if (!pickup?.latitude || !pickup?.longitude) {
    return (
      <div className="h-60 rounded-2xl bg-[#F4F6FA] grid place-items-center text-sm text-black/60">
        픽업 장소 정보가 없어요
      </div>
    );
  }

  const item = {
    id: String(pickup.branchId ?? "pickup"),
    kind: "BRANCH",
    lat: Number(pickup.latitude),
    lng: Number(pickup.longitude),
  };

  return (
    <div className="mt-3 rounded-2xl overflow-hidden border border-black/5 bg-white">
      <div className="h-60">
        <ZoneMapKakao
          items={[item]}
          center={{ lat: item.lat, lng: item.lng }}
        />
      </div>
    </div>
  );
}

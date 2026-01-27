import SafeVideo from "@/components/common/SafeVideo.jsx";
import SpinVideo from "@/components/car/SpinVideo.jsx";

export default function SpinVideoWithFallback({
  spinRef,
  src,
  className = "",
  dragWidth = 640,
  dragHeight = 280,
  pitchCount = 5,
  pitchSensitivity = 4,
  step = 0.06,
  pitchStep = 1,
}) {
  return (
    <SafeVideo src={src} className={className}>
      {(videoProps) => (
        <SpinVideo
          ref={spinRef}
          src={src}
          className="w-full"
          dragWidth={dragWidth}
          dragHeight={dragHeight}
          pitchCount={pitchCount}
          pitchSensitivity={pitchSensitivity}
          step={step}
          pitchStep={pitchStep}
          videoProps={videoProps} // ✅ 공용 이벤트 주입
        />
      )}
    </SafeVideo>
  );
}
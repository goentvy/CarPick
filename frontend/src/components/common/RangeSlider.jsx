
import { useState } from "react";
const RangeSlider = ({
  title,
  min,
  max,
  step,
  unit = "",
  value,
  onChange,
  format = (v) => v
}) => {
  const [minValue, maxValue] = value;
  const formatNumber = (num) => new Intl.NumberFormat("ko-KR").format(num);

  const handleMinChange = (e) => {
    const v = Math.min(Number(e.target.value), maxValue - step);
    onChange([v, maxValue]);
  };

  const handleMaxChange = (e) => {
    const v = Math.max(Number(e.target.value), minValue + step);
    onChange([minValue, v]);
  };

  return (
    <div className="range-wrap mb-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>

      {/* 슬라이더 */}
      <div className="range-track relative h-8">
        <div
            className="range-progress"
            style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`
            }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) =>
            onChange([Math.min(Number(e.target.value), maxValue - step), maxValue])
          }
          className="absolute w-full pointer-events-none appearance-none"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) =>
            onChange([minValue, Math.max(Number(e.target.value), minValue + step)])
          }
          className="absolute w-full pointer-events-none appearance-none"
        />
      </div>

      {/* 최소값 - 최대값 텍스트 */}
      <div className="flex justify-end text-sm mt-2">
        <span>{format(minValue)}{unit}</span>
        <span className="px-1">-</span>
        <span>{format(maxValue)}{unit}</span>
      </div>
    </div>
  );
};

export default RangeSlider;

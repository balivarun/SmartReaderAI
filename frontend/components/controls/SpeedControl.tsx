"use client";

import { Gauge } from "../icons";

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [
  { label: "0.5×", value: 0.5 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1 },
  { label: "1.25×", value: 1.25 },
  { label: "1.5×", value: 1.5 },
  { label: "2×", value: 2 },
  { label: "2.5×", value: 2.5 },
  { label: "3×", value: 3 },
];

function speedLabel(speed: number): string {
  if (speed <= 0.75) return "Slow";
  if (speed <= 1) return "Normal";
  if (speed <= 1.5) return "Fast";
  return "Very Fast";
}

export default function SpeedControl({ speed, onSpeedChange }: SpeedControlProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-ink-900 border border-ink-700">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Gauge size={16} className="text-amber-warm" />
        <span className="text-xs font-body text-ink-400 font-medium">Speed</span>
        <span className="text-xs font-mono text-amber-warm font-medium px-2 py-0.5 bg-amber-warm/10 rounded-md">
          {speedLabel(speed)}
        </span>
      </div>

      {/* Speed buttons */}
      <div className="flex items-center gap-1 flex-1 flex-wrap">
        {SPEEDS.map((s) => (
          <button
            key={s.value}
            onClick={() => onSpeedChange(s.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-smooth ${
              speed === s.value
                ? "bg-amber-warm text-ink-950"
                : "text-ink-400 hover:text-paper-warm hover:bg-ink-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="flex items-center gap-2 w-32 flex-shrink-0">
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-ink-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-3 
            [&::-webkit-slider-thumb]:h-3 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-amber-warm
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-amber-warm
            [&::-moz-range-thumb]:border-none"
        />
        <span className="text-xs font-mono text-ink-500 w-8">{speed.toFixed(2)}×</span>
      </div>
    </div>
  );
}

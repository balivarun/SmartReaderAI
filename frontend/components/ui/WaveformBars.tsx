"use client";

export default function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[14, 20, 12, 18, 16, 22, 10].map((h, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            height: `${h}px`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

"use client";

import React from "react";

type Props = {
  isPlaying: boolean;
  currentIndex: number;
  total: number;
};

export default function ProgressInfo({ isPlaying, currentIndex, total }: Props) {
  return (
    <div className="mt-4 p-3 bg-white rounded-lg shadow-sm border border-sky-50">
      <div className="flex items-center justify-between text-sm text-sky-700">
        <div>Status: <span className="font-medium text-sky-900">{isPlaying ? "Playing" : "Stopped"}</span></div>
        <div>Paragraph: <span className="font-medium text-sky-900">{Math.min(currentIndex + 1, total)}</span> / {total}</div>
      </div>

      <div className="mt-3 w-full bg-sky-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all"
          style={{ width: `${total === 0 ? 0 : ((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

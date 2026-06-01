"use client";

import React from "react";

type Props = {
  sentences: string[];
  currentIndex: number;
};

export default function Preview({ sentences, currentIndex }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-sky-700">Preview & highlight</label>
      <div className="h-64 overflow-auto rounded-xl p-4 bg-gradient-to-b from-white to-sky-50 border border-sky-100 shadow-sm">
        {sentences.length === 0 && <div className="text-sky-400">No text to preview</div>}
        {sentences.map((s, i) => (
          <p
            key={i}
            className={`mb-2 p-3 rounded-md transition-all duration-200 ${i === currentIndex ? "bg-yellow-300 border-l-4 border-yellow-400 font-semibold text-sky-900" : "bg-white/50"}`}
          >
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}

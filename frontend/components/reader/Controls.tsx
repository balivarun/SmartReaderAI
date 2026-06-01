"use client";

import React from "react";

type Props = {
  playFrom: (i?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  repeat: () => void;
  previous: () => void;
  next: () => void;
  rate: number;
  setRate: (r: number) => void;
};

export default function Controls({ playFrom, pause, resume, stop, repeat, previous, next, rate, setRate }: Props) {
  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-sky-50">
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={() => playFrom()} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.76A1 1 0 006 8.316v7.368a1 1 0 001.234.97l6.518-1.88a1 1 0 00.748-.97v-3.736a1 1 0 00-.748-.97z" /></svg>
          Play
        </button>

        <button onClick={pause} className="px-3 py-2 rounded-md bg-amber-400 text-white">Pause</button>
        <button onClick={resume} className="px-3 py-2 rounded-md bg-emerald-500 text-white">Resume</button>
        <button onClick={stop} className="px-3 py-2 rounded-md bg-red-500 text-white">Stop</button>
        <button onClick={repeat} className="px-3 py-2 rounded-md border">Repeat</button>

        <div className="ml-auto flex items-center gap-3">
          <button onClick={previous} className="px-3 py-2 rounded-md border bg-white">Prev</button>
          <button onClick={next} className="px-3 py-2 rounded-md border bg-white">Next</button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm text-sky-600">Speed</label>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-48 accent-sky-600"
        />
        <span className="text-sm font-medium text-sky-700">{rate}x</span>
      </div>
    </div>
  );
}

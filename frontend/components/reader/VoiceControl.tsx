"use client";

import React from "react";

type Props = {
  listening: boolean;
  toggleListening: () => void;
  lastCommand: string;
  supportsRecognition: boolean;
};

export default function VoiceControl({ listening, toggleListening, lastCommand, supportsRecognition }: Props) {
  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-sky-50">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-sky-700">Voice commands</label>
          <div className="mt-1 text-xs text-sky-500">Try: pause, resume, repeat, slower, faster, next, previous</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${listening ? "bg-red-500 text-white" : supportsRecognition ? "bg-sky-600 text-white" : "border text-sky-400"}`}
            disabled={!supportsRecognition}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21a1 1 0 102 0v-3.08A7 7 0 0019 11z"/></svg>
            {listening ? "Stop" : supportsRecognition ? "Listen" : "Unavailable"}
          </button>

          <div className="text-sm text-sky-700 bg-sky-50 px-3 py-1 rounded-full">{lastCommand || "No commands yet"}</div>
        </div>
      </div>
    </div>
  );
}

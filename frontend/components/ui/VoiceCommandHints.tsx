"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mic } from "../icons";

const HINTS = [
  { cmd: '"pause"', desc: "Pause reading" },
  { cmd: '"resume"', desc: "Continue reading" },
  { cmd: '"stop"', desc: "Stop & reset" },
  { cmd: '"repeat"', desc: "Repeat sentence" },
  { cmd: '"next"', desc: "Next sentence" },
  { cmd: '"previous"', desc: "Go back" },
  { cmd: '"faster"', desc: "Increase speed" },
  { cmd: '"slower"', desc: "Decrease speed" },
];

export default function VoiceCommandHints() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-900/50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-ink-800/40 transition-smooth"
      >
        <div className="flex items-center gap-2">
          <Mic size={14} className="text-ink-500" />
          <span className="text-xs font-body font-medium text-ink-400">
            Voice Command Reference
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-ink-600" />
        ) : (
          <ChevronDown size={14} className="text-ink-600" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HINTS.map((h) => (
            <div
              key={h.cmd}
              className="flex flex-col gap-1 p-2.5 rounded-xl bg-ink-800 border border-ink-700"
            >
              <code className="text-xs font-mono text-amber-warm">{h.cmd}</code>
              <p className="text-xs text-ink-400 font-body">{h.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

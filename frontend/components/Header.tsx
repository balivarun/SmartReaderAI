"use client";

import { Mic2, BookOpen } from "./icons";

export default function Header() {
  return (
    <header className="w-full border-b border-ink-800 bg-ink-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-warm flex items-center justify-center">
            <BookOpen size={18} className="text-ink-950" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ink-950 flex items-center justify-center">
              <Mic2 size={7} className="text-amber-warm" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-paper-warm leading-none tracking-tight">
              VoiceNotes
            </h1>
            <p className="text-xs text-ink-400 font-body tracking-wide mt-0.5">
              AI Reading Assistant
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-900 border border-ink-700">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-body text-ink-300">
            Web Speech API Ready
          </span>
        </div>
      </div>
    </header>
  );
}

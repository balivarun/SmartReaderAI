"use client";

import { Mic } from "../icons";

interface VoiceCommandOverlayProps {
  isListening: boolean;
  lastCommand: string | null;
}

const COMMAND_LABELS: Record<string, { label: string; emoji: string }> = {
  pause: { label: "Paused", emoji: "⏸" },
  resume: { label: "Resumed", emoji: "▶️" },
  stop: { label: "Stopped", emoji: "⏹" },
  faster: { label: "Faster", emoji: "⚡" },
  slower: { label: "Slower", emoji: "🐢" },
  repeat: { label: "Repeating", emoji: "🔁" },
  next: { label: "Next", emoji: "⏭" },
  prev: { label: "Previous", emoji: "⏮" },
};

export default function VoiceCommandOverlay({
  isListening,
  lastCommand,
}: VoiceCommandOverlayProps) {
  const cmd = lastCommand ? COMMAND_LABELS[lastCommand] : null;

  return (
    <>
      {/* Persistent listening indicator - bottom right */}
      {isListening && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-ink-900 border border-amber-warm/30 shadow-xl">
          <div className="relative">
            <div className="w-7 h-7 rounded-xl bg-amber-warm/15 flex items-center justify-center">
              <Mic size={14} className="text-amber-warm" />
            </div>
            <div className="absolute inset-0 rounded-xl border border-amber-warm/40 listening-ring" />
          </div>
          <div>
            <p className="text-xs font-display font-semibold text-amber-warm leading-none">
              Listening
            </p>
            <p className="text-xs text-ink-500 font-body mt-0.5">
              Say a command
            </p>
          </div>
        </div>
      )}

      {/* Command detected badge - centered bottom */}
      {cmd && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 command-badge">
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-ink-900 border border-amber-warm shadow-2xl amber-glow">
            <span className="text-lg">{cmd.emoji}</span>
            <div>
              <p className="text-xs text-ink-400 font-body">Voice command</p>
              <p className="text-sm font-display font-bold text-amber-warm">
                {cmd.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

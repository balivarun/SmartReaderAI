"use client";

import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Mic,
  MicOff,
} from "../icons";

interface ControlBarProps {
  isPlaying: boolean;
  isPaused: boolean;
  isListening: boolean;
  progress: number;
  currentSentenceIndex: number;
  totalSentences: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRepeat: () => void;
  onToggleVoice: () => void;
}

export default function ControlBar({
  isPlaying,
  isPaused,
  isListening,
  onPlay,
  onPause,
  onResume,
  onStop,
  onNext,
  onPrev,
  onRepeat,
  onToggleVoice,
}: ControlBarProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onPlay();
    }
  };

  const iconBtn = (
    onClick: () => void,
    Icon: React.ElementType,
    label: string,
    variant: "default" | "primary" | "danger" | "active" = "default"
  ) => {
    const styles = {
      default:
        "bg-ink-800 border-ink-700 text-ink-300 hover:bg-ink-700 hover:text-paper-warm hover:border-ink-600",
      primary:
        "bg-amber-warm border-amber-warm text-ink-950 hover:bg-amber-glow hover:border-amber-glow amber-glow",
      danger:
        "bg-ink-800 border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-700",
      active:
        "bg-amber-warm/15 border-amber-warm text-amber-warm hover:bg-amber-warm/25",
    };

    return (
      <button
        onClick={onClick}
        title={label}
        aria-label={label}
        className={`flex items-center justify-center w-11 h-11 rounded-2xl border transition-smooth active:scale-95 ${styles[variant]}`}
      >
        <Icon size={18} strokeWidth={2} />
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-ink-900 border border-ink-700">
      {/* Left group - navigation */}
      <div className="flex items-center gap-2">
        {iconBtn(onPrev, SkipBack, "Previous sentence")}
        {iconBtn(onRepeat, RotateCcw, "Repeat sentence")}
        {iconBtn(onNext, SkipForward, "Next sentence")}
      </div>

      {/* Center - play/pause and stop */}
      <div className="flex items-center gap-3">
        {iconBtn(
          handlePlayPause,
          isPlaying ? Pause : Play,
          isPlaying ? "Pause" : isPaused ? "Resume" : "Play",
          "primary"
        )}
        {iconBtn(onStop, Square, "Stop", "danger")}
      </div>

      {/* Right - voice command toggle */}
      <div className="flex items-center gap-2">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-body text-ink-500">Voice control</p>
          <p className="text-xs font-body text-amber-warm">
            {isListening ? "Listening..." : "Off"}
          </p>
        </div>
        <div className="relative">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-2xl bg-amber-warm/20 listening-ring" />
              <div className="absolute inset-0 rounded-2xl bg-amber-warm/15 listening-ring-2" />
            </>
          )}
          {iconBtn(
            onToggleVoice,
            isListening ? Mic : MicOff,
            isListening ? "Disable voice commands" : "Enable voice commands",
            isListening ? "active" : "default"
          )}
        </div>
      </div>
    </div>
  );
}

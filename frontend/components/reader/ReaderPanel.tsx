"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "../icons";
import WaveformBars from "@/components/ui/WaveformBars";

interface ReaderPanelProps {
  notes: string;
  sentences: string[];
  currentSentenceIndex: number;
  isPlaying: boolean;
  onBack: () => void;
}

export default function ReaderPanel({
  sentences,
  currentSentenceIndex,
  isPlaying,
  onBack,
}: ReaderPanelProps) {
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  // Auto-scroll to active sentence
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSentenceIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ink-400 hover:text-paper-warm transition-smooth group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Edit Notes
        </button>

        <div className="flex items-center gap-2">
          {isPlaying && <WaveformBars />}
          <span className="text-xs font-mono text-ink-500">
            {currentSentenceIndex + 1} / {sentences.length}
          </span>
        </div>
      </div>

      {/* Reading card */}
      <div className="relative rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden">
        {/* Ambient glow when playing */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-0.5 progress-shimmer" />
        )}

        {/* Text content */}
        <div className="px-6 py-6 max-h-[450px] overflow-y-auto">
          <p className="font-body text-[1.05rem] leading-[1.9] text-ink-200 select-none">
            {sentences.map((sentence, i) => (
              <span key={i}>
                {i === currentSentenceIndex ? (
                  <span
                    ref={highlightRef}
                    className="sentence-highlight text-paper-warm font-medium"
                  >
                    {sentence}
                  </span>
                ) : i < currentSentenceIndex ? (
                  <span className="text-ink-500">{sentence}</span>
                ) : (
                  <span>{sentence}</span>
                )}
                {" "}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom progress */}
        <div className="px-6 py-3 border-t border-ink-800 bg-ink-950/30 flex items-center gap-3">
          <div className="flex-1 h-1 bg-ink-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-warm rounded-full transition-all duration-500"
              style={{
                width: `${
                  sentences.length > 0
                    ? (currentSentenceIndex / sentences.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <span className="text-xs font-mono text-ink-500 w-8 text-right">
            {sentences.length > 0
              ? Math.round((currentSentenceIndex / sentences.length) * 100)
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
}

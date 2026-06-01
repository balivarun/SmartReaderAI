"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Mic2,
  ArrowRight,
  X,
  Upload,
  Sparkles,
} from "../icons";

interface NoteInputProps {
  notes: string;
  onChange: (val: string) => void;
  onStartReading: () => void;
}

const SAMPLE_NOTES = `The water cycle, also known as the hydrological cycle, describes the continuous movement of water on, above, and below the surface of Earth. Water evaporates from the surface due to solar energy, forming water vapor in the atmosphere.

This vapor rises, cools, and condenses to form clouds through a process called condensation. Eventually, water returns to the surface as precipitation in the form of rain, snow, sleet, or hail.

Once on the ground, water can either run off into streams and rivers, soak into the ground to become groundwater, or evaporate again — continuing the endless cycle that sustains all life on Earth.`;

export default function NoteInput({
  notes,
  onChange,
  onStartReading,
}: NoteInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const wordCount = notes
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const charCount = notes.length;
  const estReadTime = Math.ceil(wordCount / (200 * 1.0)); // avg 200 wpm

  return (
    <div className="flex flex-col gap-4">
      {/* Instruction banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-warm/10 border border-amber-warm/20">
        <Sparkles size={18} className="text-amber-warm mt-0.5 flex-shrink-0" />
        <p className="text-sm font-body text-ink-200 leading-relaxed">
          Paste your lecture notes, study material, or any text below. Switch to{" "}
          <span className="text-amber-warm font-medium">Reading Mode</span> and
          let AI read it aloud while you take notes — hands-free.
        </p>
      </div>

      {/* Textarea card */}
      <div
        className={`relative rounded-2xl border transition-smooth overflow-hidden ${
          isDragOver
            ? "border-amber-warm bg-amber-warm/5"
            : "border-ink-700 bg-ink-900"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const text = e.dataTransfer.getData("text");
          if (text) onChange(notes + text);
        }}
      >
        {/* Textarea header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-ink-400" />
            <span className="text-xs font-body text-ink-400 font-medium tracking-wide uppercase">
              Your Notes
            </span>
          </div>
          <div className="flex items-center gap-3">
            {notes && (
              <button
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-red-400 transition-smooth"
              >
                <X size={12} />
                Clear
              </button>
            )}
            <button
              onClick={() => onChange(SAMPLE_NOTES)}
              className="flex items-center gap-1.5 text-xs text-amber-warm/70 hover:text-amber-warm transition-smooth"
            >
              <Upload size={12} />
              Load sample
            </button>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/80 z-10">
            <p className="text-amber-warm font-display font-semibold text-lg">
              Drop text here
            </p>
          </div>
        )}

        {/* Main textarea */}
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your notes here... or drag and drop text from another window.&#10;&#10;Try: 'Load sample' to see how it looks."
          className="w-full min-h-[320px] bg-transparent px-5 py-4 font-body text-base text-paper-warm placeholder:text-ink-600 resize-none leading-relaxed focus:outline-none"
          spellCheck={false}
        />

        {/* Footer stats */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink-800 bg-ink-950/40">
          <div className="flex items-center gap-4 text-xs text-ink-500 font-mono">
            <span>{wordCount} words</span>
            <span className="text-ink-700">•</span>
            <span>{charCount} chars</span>
            {wordCount > 0 && (
              <>
                <span className="text-ink-700">•</span>
                <span>~{estReadTime} min read</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-600">
            <Upload size={11} />
            <span>drag & drop text</span>
          </div>
        </div>
      </div>

      {/* Start reading button */}
      <button
        onClick={onStartReading}
        disabled={!notes.trim()}
        className={`group flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-display font-semibold text-base tracking-wide transition-smooth ${
          notes.trim()
            ? "bg-amber-warm text-ink-950 hover:bg-amber-glow amber-glow hover:scale-[1.01] active:scale-[0.99]"
            : "bg-ink-800 text-ink-600 cursor-not-allowed"
        }`}
      >
        <Mic2 size={20} strokeWidth={2.5} />
        Start Reading Aloud
        {notes.trim() && (
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        )}
      </button>
    </div>
  );
}

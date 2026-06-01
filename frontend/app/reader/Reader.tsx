"use client";

import React, { useEffect, useRef, useState } from "react";
import TextEditor from "../../components/reader/TextEditor";
import Controls from "../../components/reader/Controls";
import Preview from "../../components/reader/Preview";
import VoiceControl from "../../components/reader/VoiceControl";
import ProgressInfo from "../../components/reader/ProgressInfo";

function splitIntoSentences(text: string) {
  if (!text) return [];
  // crude sentence splitter: keeps punctuation with sentence
  const re = /[^\n.!?]+[\n.!?]*/g;
  const matches = text.match(re);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

export default function Reader(): JSX.Element {
  const [text, setText] = useState<string>("");
  // derive sentences from text instead of storing them in state to avoid
  // calling setState synchronously inside an effect (causes cascading renders)
  const sentences = React.useMemo(() => splitIntoSentences(text), [text]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1);
  const [listening, setListening] = useState<boolean>(false);
  const [lastCommand, setLastCommand] = useState<string>("");

  // recognitionRef holds the browser SpeechRecognition instance when available.
  // Use `any` because different browsers expose prefixed implementations
  // (webkitSpeechRecognition) and the DOM type may not be present in TS config.
  const recognitionRef = useRef<any | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Reset currentIndex asynchronously when text changes. Performing the
    // setState inside a timeout avoids calling setState synchronously during
    // the effect body and prevents the linter warning about cascading renders.
    const id = setTimeout(() => setCurrentIndex(0), 0);
    return () => clearTimeout(id);
  }, [text]);

  useEffect(() => {
    return () => {
      // cleanup
      try {
        if (typeof window !== "undefined" && 'speechSynthesis' in window && window.speechSynthesis.cancel) {
          window.speechSynthesis.cancel();
        }
      } catch (_e) {}
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_e) {}
      }
    };
  }, []);

  function speakSentence(index: number) {
    if (!sentences || index < 0 || index >= sentences.length) {
      setIsPlaying(false);
      return;
    }
    if (typeof window === "undefined" || !('speechSynthesis' in window)) {
      // TTS not available in this environment
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = sentences[index];
    const u = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = u;
    u.rate = rate;
    u.onstart = () => {
      setCurrentIndex(index);
      setIsPlaying(true);
    };
    u.onend = () => {
      // proceed to next sentence automatically
      const next = index + 1;
      if (next < sentences.length && isPlaying) {
        // slight delay to allow smooth transition
        setTimeout(() => speakSentence(next), 50);
      } else {
        setIsPlaying(false);
      }
    };
    u.onerror = () => setIsPlaying(false);
    try {
      window.speechSynthesis.speak(u);
    } catch (_e) {
      setIsPlaying(false);
    }
  }

  function playFrom(index = 0) {
    if (!sentences || sentences.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, sentences.length - 1));
    speakSentence(safeIndex);
  }

  function pause() {
    try {
      if (typeof window !== "undefined" && 'speechSynthesis' in window && window.speechSynthesis.pause) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    } catch (_e) {}
  }

  function resume() {
    try {
      if (typeof window !== "undefined" && 'speechSynthesis' in window && window.speechSynthesis.resume) {
        window.speechSynthesis.resume();
      }
      setIsPlaying(true);
    } catch (_e) {}
  }

  function stop() {
    try {
      if (typeof window !== "undefined" && 'speechSynthesis' in window && window.speechSynthesis.cancel) {
        window.speechSynthesis.cancel();
      }
    } catch (_e) {}
    setIsPlaying(false);
  }

  function repeat() {
    stop();
    playFrom(currentIndex);
  }

  function next() {
    stop();
    const nextIndex = Math.min(currentIndex + 1, sentences.length - 1);
    playFrom(nextIndex);
  }

  function previous() {
    stop();
    const prevIndex = Math.max(currentIndex - 1, 0);
    playFrom(prevIndex);
  }

  function slower() {
    const r = Math.max(0.5, +(rate - 0.1).toFixed(2));
    setRate(r);
    // restart current utterance at new rate
    if (isPlaying) {
      const idx = currentIndex;
      stop();
      setTimeout(() => playFrom(idx), 50);
    }
  }

  function faster() {
    const r = Math.min(2, +(rate + 0.1).toFixed(2));
    setRate(r);
    if (isPlaying) {
      const idx = currentIndex;
      stop();
      setTimeout(() => playFrom(idx), 50);
    }
  }

  function updateRate(r: number) {
    const rr = Math.max(0.5, Math.min(2, +r.toFixed(2)));
    setRate(rr);
    if (isPlaying) {
      const idx = currentIndex;
      stop();
      setTimeout(() => playFrom(idx), 50);
    }
  }

  function saveProgress() {
    const payload = { text, currentIndex, rate };
    localStorage.setItem("smartreader_progress", JSON.stringify(payload));
    setLastCommand("Progress saved");
  }

  function loadProgress() {
    const raw = localStorage.getItem("smartreader_progress");
    if (!raw) return setLastCommand("No saved progress");
    try {
      const p = JSON.parse(raw);
      if (p.text) setText(p.text);
      if (typeof p.currentIndex === "number") setCurrentIndex(p.currentIndex);
      if (typeof p.rate === "number") setRate(p.rate);
      setLastCommand("Progress loaded");
    } catch (_e) {
      setLastCommand("Failed to load progress");
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || "");
      setText(txt);
      setLastCommand(`Loaded ${f.name}`);
    };
    reader.readAsText(f);
  }

  function startListening() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return setLastCommand("SpeechRecognition not supported in this browser");
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (ev: any) => {
      const transcript = ev.results[ev.results.length - 1][0].transcript.trim().toLowerCase();
      setLastCommand(`Heard: ${transcript}`);
      handleVoiceCommand(transcript);
    };
    rec.onerror = (e: any) => setLastCommand("Voice recognition error: " + (e.error || e.message || ""));
    rec.onend = () => {
      setListening(false);
    };
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
    setLastCommand("Listening for commands...");
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_e) {}
      recognitionRef.current = null;
    }
    setListening(false);
  }

  function handleVoiceCommand(command: string) {
    // simple mapping of common phrases
    if (command.includes("pause") || command.includes("stop reading") || command === "stop") {
      pause();
      setLastCommand("Paused by voice");
      return;
    }
    if (command.includes("resume") || command.includes("play")) {
      // if paused resume else start from currentIndex
      if (speechSynthesis.paused) {
        resume();
      } else {
        playFrom(currentIndex);
      }
      setLastCommand("Resumed by voice");
      return;
    }
    if (command.includes("repeat") || command.includes("again")) {
      repeat();
      setLastCommand("Repeat by voice");
      return;
    }
    if (command.includes("slower") || command.includes("slow down") || command.includes("decrease speed")) {
      slower();
      setLastCommand("Slowed down");
      return;
    }
    if (command.includes("faster") || command.includes("speed up") || command.includes("increase speed")) {
      faster();
      setLastCommand("Sped up");
      return;
    }
    if (command.includes("next") || command.includes("skip")) {
      next();
      setLastCommand("Next sentence");
      return;
    }
    if (command.includes("previous") || command.includes("back")) {
      previous();
      setLastCommand("Previous sentence");
      return;
    }
    // fallback: try to detect numbers like 'go back 10 seconds' (not implemented precisely)
    setLastCommand("Command not recognized: " + command);
  }

  const supports = {
    tts: typeof window !== "undefined" && "speechSynthesis" in window,
    recognition: typeof window !== "undefined" && ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition),
  };

  return (
    <div>
      <header className="mb-6 p-6 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-300 text-white shadow-md">
        <h1 className="text-2xl font-bold">SmartReader — Hands-free note reader</h1>
        <p className="mt-1 text-sm opacity-90">Paste your notes and listen while you write. Control playback with voice or buttons.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 space-y-4">
          <TextEditor text={text} setText={setText} handleFile={handleFile} />

          <Controls
            playFrom={playFrom}
            pause={pause}
            resume={resume}
            stop={stop}
            repeat={repeat}
            previous={previous}
            next={next}
            rate={rate}
            setRate={updateRate}
          />

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md bg-white border text-sky-700" onClick={saveProgress}>Save progress</button>
            <button className="px-4 py-2 rounded-md bg-white border text-sky-700" onClick={loadProgress}>Load progress</button>
          </div>

          <VoiceControl
            listening={listening}
            toggleListening={() => (listening ? stopListening() : startListening())}
            lastCommand={lastCommand}
            supportsRecognition={!!supports.recognition}
          />
        </main>

        <aside className="space-y-4">
          <Preview sentences={sentences} currentIndex={currentIndex} />
          <ProgressInfo isPlaying={isPlaying} currentIndex={currentIndex} total={sentences.length} />
        </aside>
      </div>
    </div>
  );
}

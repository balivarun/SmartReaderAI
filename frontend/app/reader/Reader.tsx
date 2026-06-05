"use client";

import React, { useEffect, useRef, useState } from "react";
import TextEditor from "../../components/reader/TextEditor";
import Controls from "../../components/reader/Controls";
import ProgressInfo from "../../components/reader/ProgressInfo";

function splitIntoSentences(text: string) {
  if (!text) return [];
  // split into paragraphs: blank-line separated blocks. This treats
  // consecutive newline(s) as paragraph separators so we read whole
  // paragraphs instead of sentence-by-sentence.
  return text
    .split(/(?:\r?\n){2,}/)
    .map((p) => p.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);
}

export default function Reader(): JSX.Element {
  const [text, setText] = useState<string>("");
  // derive paragraphs from text (we still call them sentences in code for
  // backward compatibility) — we read whole paragraphs at a time.
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
  // If true, recognition should automatically restart after onend while playback is active.
  const autoRestartRef = useRef<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(msg: string) {
    const t = `${new Date().toLocaleTimeString()}: ${msg}`;
    setLogs((s) => [t, ...s].slice(0, 50));
  }

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
    // When playback starts, enable voice command listening so the user can say
    // "pause", "resume", etc. The recognition implementation is guarded by
    // feature detection inside startListening().
    try {
      // Start listening and enable auto-restart so recognition keeps running while playing.
      // startListening is async (may prompt for mic permission); call without await.
      void startListening(true);
    } catch (_e) {}
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
    // Also stop voice recognition when playback is stopped.
    try {
      stopListening();
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
    const id = localStorage.getItem("smartreader_user_id");

    if (!id) {
      // Not signed in / not synced — save locally only and prompt to sign in for cloud save.
      localStorage.setItem("smartreader_progress", JSON.stringify(payload));
      setLastCommand("Progress saved locally. Sign in to sync to the cloud.");
      return;
    }

    // Try saving to backend; fall back to localStorage on failure.
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const url = apiBase ? `${apiBase}/api/progress` : `/api/progress`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text, currentIndex, rate }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        setLastCommand("Progress saved to server");
      })
      .catch(() => {
        localStorage.setItem(`smartreader_progress_${id}`, JSON.stringify(payload));
        setLastCommand("Progress saved locally (server unavailable)");
      });
  }

  function loadProgress() {
    const id = localStorage.getItem("smartreader_user_id");
    if (!id) {
      // load from local storage as a fallback
      const raw = localStorage.getItem("smartreader_progress");
      if (!raw) return setLastCommand("No saved progress");
      try {
        const p = JSON.parse(raw);
        if (p.text) setText(p.text);
        if (typeof p.currentIndex === "number") setCurrentIndex(p.currentIndex);
        if (typeof p.rate === "number") setRate(p.rate);
        setLastCommand("Progress loaded (local)");
      } catch (_e) {
        setLastCommand("Failed to load progress");
      }
      return;
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const url = apiBase ? `${apiBase}/api/progress/${encodeURIComponent(id)}` : `/api/progress/${encodeURIComponent(id)}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((p) => {
        if (p.text) setText(p.text);
        if (typeof p.currentIndex === "number") setCurrentIndex(p.currentIndex);
        if (typeof p.rate === "number") setRate(p.rate);
        setLastCommand("Progress loaded from server");
      })
      .catch(() => {
        // fallback to local
        const raw = localStorage.getItem(`smartreader_progress_${id}`) || localStorage.getItem("smartreader_progress");
        if (!raw) return setLastCommand("No saved progress");
        try {
          const p = JSON.parse(raw);
          if (p.text) setText(p.text);
          if (typeof p.currentIndex === "number") setCurrentIndex(p.currentIndex);
          if (typeof p.rate === "number") setRate(p.rate);
          setLastCommand("Progress loaded (local fallback)");
        } catch (_e) {
          setLastCommand("Failed to load progress");
        }
      });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const isDoc = /pdf|word|officedocument|msword|vnd\.openxmlformats-officedocument/.test(f.type || f.name);
    if (isDoc && apiBase) {
      // upload to backend for conversion
      const fd = new FormData();
      fd.append("file", f);
      fetch(`${apiBase}/api/convert`, { method: "POST", body: fd })
        .then(async (res) => {
          if (!res.ok) throw new Error("convert failed");
          const txt = await res.text();
          setText(txt);
          setLastCommand(`Loaded ${f.name} (converted)`);
        })
        .catch(() => {
          setLastCommand(`Failed to convert ${f.name}`);
        });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const txt = String(reader.result || "");
      setText(txt);
      setLastCommand(`Loaded ${f.name}`);
    };
    reader.readAsText(f);
  }

  async function startListening(autoRestart = false) {
    // Feature-detect Web Speech API (standard name first, then webkit prefixed).
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return setLastCommand("SpeechRecognition not supported in this browser");
    // If already listening, avoid creating another instance
    if (recognitionRef.current) return setLastCommand("Already listening");

    // Ask for microphone permission explicitly via getUserMedia so browsers
    // prompt early and the permission state is granted before starting recognition.
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      try {
        addLog("Requesting microphone permission...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop tracks; we only requested permission.
        stream.getTracks().forEach((t) => t.stop());
        addLog("Microphone permission granted");
        setLastCommand("Microphone permission granted");
      } catch (err: any) {
        addLog("Microphone permission denied or error: " + (err && err.message ? err.message : String(err)));
        setLastCommand("Microphone permission denied");
        return;
      }
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    // Set interimResults to true for more responsive recognition and partial transcripts
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = (navigator.language || "en-US");
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setListening(true);
      addLog("Recognition started");
      setLastCommand("Listening for commands...");
      recognitionRef.current = rec;
      autoRestartRef.current = !!autoRestart;
    };
    rec.onresult = (ev: any) => {
      // Prefer the most recent result; accumulate interim if needed.
      const last = ev.results[ev.results.length - 1];
      const transcript = last[0].transcript.trim().toLowerCase();
      addLog("Result: " + transcript + (last.isFinal ? " (final)" : " (interim)"));
      setLastCommand(`Heard: ${transcript}`);
      if (last.isFinal) {
        handleVoiceCommand(transcript);
      }
    };
    rec.onerror = (e: any) => setLastCommand("Voice recognition error: " + (e.error || e.message || ""));
    rec.onend = () => {
      // recognition ended (possibly due to permission, network, or explicit stop)
      setListening(false);
      recognitionRef.current = null;
      setLastCommand((prev) => prev || "Recognition ended");
      // If we should auto-restart (playback is active and autoRestartRef is true), try to restart.
      if (autoRestartRef.current && isPlaying) {
        // small delay before restarting to avoid rapid loops
        setTimeout(() => {
          try {
            startListening(true);
          } catch (_e) {}
        }, 500);
      }
    };
    try {
      rec.start();
    } catch (e: any) {
      setLastCommand("Failed to start recognition: " + (e && e.message ? e.message : String(e)));
    }
  }

  function stopListening() {
    // disable auto-restart when explicitly stopping
    autoRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        if (typeof recognitionRef.current.stop === "function") recognitionRef.current.stop();
      } catch (_e) {}
      recognitionRef.current = null;
    }
    setListening(false);
  }

  function toggleListening() {
    if (recognitionRef.current) {
      stopListening();
    } else {
      // start listening without forcing auto-restart (manual toggle)
      void startListening(false);
    }
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

      <div className="grid grid-cols-1 gap-6">
        <main className="space-y-4">
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
            listening={listening}
            lastCommand={lastCommand}
            toggleListening={toggleListening}
            logs={logs}
          />

          <div className="flex gap-3 items-center">
            <button className="btn btn-primary" onClick={saveProgress}>Save progress</button>
            <button className="btn btn-secondary" onClick={loadProgress}>Load progress</button>
            <div className="text-sm text-ink-400">Cloud sync requires sign-in — <a href="/sign-in" className="underline">Sign in</a></div>
          </div>

          {/* Voice control UI intentionally hidden — microphone is enabled automatically when playback starts. */}
        </main>
        <div className="space-y-4">
          <ProgressInfo isPlaying={isPlaying} currentIndex={currentIndex} total={sentences.length} />
        </div>
      </div>
    </div>
  );
}

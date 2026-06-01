"use client";

import { useState, useCallback, useRef, useEffect } from "react";

function splitIntoSentences(text: string): string[] {
  if (!text.trim()) return [];
  // Split on sentence-ending punctuation, keeping the punctuation
  const raw = text.match(/[^.!?।\n]+[.!?।\n]?/g) || [];
  return raw
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

export function useTextToSpeech(notes: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [speed, setSpeedState] = useState(1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const speedRef = useRef(1);
  const pausedRef = useRef(false);

  const sentences = splitIntoSentences(notes);
  sentencesRef.current = sentences;

  const progress =
    sentences.length > 0
      ? Math.round((currentSentenceIndex / sentences.length) * 100)
      : 0;

  const speakSentence = useCallback((index: number) => {
    if (typeof window === "undefined") return;
    if (index >= sentencesRef.current.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
      currentIndexRef.current = 0;
      return;
    }

    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const sentence = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = speedRef.current;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Pick a natural voice if available
    const voices = (window.speechSynthesis && window.speechSynthesis.getVoices)
      ? window.speechSynthesis.getVoices()
      : [];
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel"))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      if (!pausedRef.current) {
        const next = currentIndexRef.current + 1;
        currentIndexRef.current = next;
        setCurrentSentenceIndex(next);
        speakSentence(next);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("TTS error:", e.error);
        setIsPlaying(false);
      }
    };

    utteranceRef.current = utterance;
    try {
      if ('speechSynthesis' in window && window.speechSynthesis.speak) {
        window.speechSynthesis.speak(utterance);
      }
    } catch (_e) {}
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    pausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    const idx = currentIndexRef.current;
    speakSentence(idx);
  }, [speakSentence]);

  const pause = useCallback(() => {
    if (typeof window === "undefined") return;
    pausedRef.current = true;
    try {
      if ('speechSynthesis' in window && window.speechSynthesis.pause) {
        window.speechSynthesis.pause();
      }
    } catch (_e) {}
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === "undefined") return;
    pausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    // Resume from current sentence (re-speak in case browser doesn't support resume well)
    speakSentence(currentIndexRef.current);
  }, [speakSentence]);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    pausedRef.current = true;
    try {
      if ('speechSynthesis' in window && window.speechSynthesis.cancel) {
        window.speechSynthesis.cancel();
      }
    } catch (_e) {}
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    currentIndexRef.current = 0;
  }, []);

  const repeat = useCallback(() => {
    if (typeof window === "undefined") return;
    pausedRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(currentIndexRef.current);
  }, [speakSentence]);

  const nextParagraph = useCallback(() => {
    if (typeof window === "undefined") return;
    const next = Math.min(
      currentIndexRef.current + 1,
      sentencesRef.current.length - 1
    );
    currentIndexRef.current = next;
    setCurrentSentenceIndex(next);
    if (isPlaying || isPaused) {
      pausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
      speakSentence(next);
    }
  }, [isPlaying, isPaused, speakSentence]);

  const prevParagraph = useCallback(() => {
    if (typeof window === "undefined") return;
    const prev = Math.max(currentIndexRef.current - 1, 0);
    currentIndexRef.current = prev;
    setCurrentSentenceIndex(prev);
    if (isPlaying || isPaused) {
      pausedRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);
      speakSentence(prev);
    }
  }, [isPlaying, isPaused, speakSentence]);

  const setSpeed = useCallback(
    (newSpeed: number) => {
      speedRef.current = newSpeed;
      setSpeedState(newSpeed);
      // If currently playing, restart at new speed
      if (isPlaying) {
        pausedRef.current = false;
        speakSentence(currentIndexRef.current);
      }
    },
    [isPlaying, speakSentence]
  );

  const increasSpeed = useCallback(() => {
    const newSpeed = Math.min(speedRef.current + 0.25, 3);
    setSpeed(newSpeed);
  }, [setSpeed]);

  const decreaseSpeed = useCallback(() => {
    const newSpeed = Math.max(speedRef.current - 0.25, 0.5);
    setSpeed(newSpeed);
  }, [setSpeed]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
            try {
              if ('speechSynthesis' in window && window.speechSynthesis.cancel) {
                window.speechSynthesis.cancel();
              }
            } catch (_e) {}
      }
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    currentSentenceIndex,
    sentences,
    progress,
    speed,
    start,
    pause,
    resume,
    stop,
    repeat,
    nextParagraph,
    prevParagraph,
    setSpeed,
    increasSpeed,
    decreaseSpeed,
  };
}

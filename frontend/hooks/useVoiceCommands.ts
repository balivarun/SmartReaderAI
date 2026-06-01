"use client";

import { useState, useCallback, useRef } from "react";

interface VoiceCommandCallbacks {
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onFaster: () => void;
  onSlower: () => void;
  onRepeat: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const COMMANDS: Record<string, string[]> = {
  pause: ["pause", "stop reading", "hold on", "wait", "रुको"],
  resume: ["resume", "continue", "go on", "play", "जारी रखो"],
  stop: ["stop", "end", "finish", "बंद करो"],
  faster: ["faster", "speed up", "go faster", "तेज़"],
  slower: ["slower", "slow down", "go slower", "धीमा"],
  repeat: ["repeat", "say again", "replay", "दोबारा"],
  next: ["next", "skip", "forward", "अगला"],
  prev: ["previous", "back", "go back", "पिछला"],
};

function matchCommand(transcript: string): string | null {
  const lower = transcript.toLowerCase().trim();
  for (const [cmd, phrases] of Object.entries(COMMANDS)) {
    if (phrases.some((p) => lower.includes(p))) return cmd;
  }
  return null;
}

export function useVoiceCommands(callbacks: VoiceCommandCallbacks) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const executeCommand = useCallback(
    (cmd: string) => {
      setLastCommand(cmd);
      setTimeout(() => setLastCommand(null), 2500);
      switch (cmd) {
        case "pause":
          callbacks.onPause();
          break;
        case "resume":
          callbacks.onResume();
          break;
        case "stop":
          callbacks.onStop();
          break;
        case "faster":
          callbacks.onFaster();
          break;
        case "slower":
          callbacks.onSlower();
          break;
        case "repeat":
          callbacks.onRepeat();
          break;
        case "next":
          callbacks.onNext();
          break;
        case "prev":
          callbacks.onPrev();
          break;
      }
    },
    [callbacks]
  );

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice commands are not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const cmd = matchCommand(transcript);
      if (cmd) executeCommand(cmd);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [executeCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, lastCommand, toggleListening };
}

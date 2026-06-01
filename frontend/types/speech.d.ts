// Type declarations to help TypeScript recognize the Web Speech API prefixed
// implementations (webkitSpeechRecognition) used in browsers like Chrome.
// These are intentionally permissive (`any`) because different browsers expose
// different shapes; the runtime feature-detection in code guards usage.

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }

  // Allow referencing the global `speechSynthesis` more easily in TS files
  interface Window {
    speechSynthesis: SpeechSynthesis;
  }
}

export {};

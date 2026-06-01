"use client";

import React from "react";

type Props = {
  text: string;
  setText: (t: string) => void;
  handleFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextEditor({ text, setText, handleFile }: Props) {
  return (
    <div className="p-4 bg-gradient-to-br from-white via-sky-50 to-sky-100 rounded-xl shadow-lg border border-sky-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-sky-700">Your notes</h3>
          <p className="text-xs text-sky-500 mt-1">Paste lecture notes, articles or any text here — AI will read it aloud.</p>
        </div>
        <div className="text-sm text-sky-600">Words: <span className="font-medium">{text ? text.trim().split(/\s+/).length : 0}</span></div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste lecture notes, articles or any text here..."
        className="w-full h-64 mt-4 p-4 rounded-md border border-sky-200 bg-white text-sm resize-y shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
      />

      <div className="mt-3 flex items-center gap-3">
        <label className="px-3 py-2 rounded-md bg-sky-600 text-white cursor-pointer text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9.414A2 2 0 0016.586 8L12 3.414A2 2 0 0010.586 3H4z" /></svg>
          Upload (.txt)
          <input className="hidden" type="file" accept=".txt,.md" onChange={handleFile} />
        </label>

        <button
          onClick={() => setText("")}
          className="px-3 py-2 rounded-md border border-sky-200 bg-white text-sky-700 text-sm shadow-sm hover:bg-sky-50"
        >
          Clear
        </button>

        <div className="ml-auto text-xs text-sky-500">Tip: Use voice commands like “pause” or “resume”</div>
      </div>
    </div>
  );
}

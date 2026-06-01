"use client";

import dynamic from "next/dynamic";
import React from "react";

const Reader = dynamic(() => import("./reader/Reader"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-sky-50 font-sans min-h-screen p-8">
      <main className="w-full max-w-4xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">SmartReaderAI — Voice-controlled reader</h1>
        <Reader />
      </main>
    </div>
  );
}

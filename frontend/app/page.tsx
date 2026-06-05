"use client";

import dynamic from "next/dynamic";
import React from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

const Reader = dynamic(() => import("./reader/Reader"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-sky-50 font-sans min-h-screen p-8">
      <main className="w-full max-w-4xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">SmartReaderAI — Voice-controlled reader</h1>

        <SignedOut>
          <div className="mb-6 flex gap-3">
            <SignInButton>
              <button className="px-4 py-2 rounded bg-amber-warm text-ink-950">Sign in</button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 rounded border border-ink-700 text-ink-300">Create account</button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Reader />
        </SignedIn>

        <SignedOut>
          <p className="text-sm text-ink-500">Sign in or create an account to use the reader and save notes.</p>
        </SignedOut>
      </main>
    </div>
  );
}

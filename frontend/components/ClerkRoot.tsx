"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider, useUser } from "@clerk/nextjs";

export default function ClerkRoot({ children }: { children: React.ReactNode }) {
  const envKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const [key, setKey] = useState<string>(envKey || "");
  const [input, setInput] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!key && typeof window !== "undefined") {
      const saved = localStorage.getItem("CLERK_PUBLISHABLE_KEY");
      if (saved) setKey(saved);
    }
  }, [key]);

  const saveKey = () => {
    if (input) {
      localStorage.setItem("CLERK_PUBLISHABLE_KEY", input);
      setKey(input);
      setShowSetup(false);
    }
  };

  // Inner component that runs inside ClerkProvider to sync the Clerk user id
  // into localStorage so client-only code can decide whether to attempt server
  // saves/loads. This is intentionally small and optional: if Clerk is present
  // it stores the user's id; otherwise nothing happens.
  function AuthSync() {
    const { isSignedIn, user } = useUser() as any;
    useEffect(() => {
      if (isSignedIn && user && user.id) {
        localStorage.setItem("smartreader_user_id", user.id);
      } else {
        // remove stored id when signed out
        localStorage.removeItem("smartreader_user_id");
      }
    }, [isSignedIn, user]);
    return null;
  }

  // If no publishable key is available, render the app UI normally but show a
  // small persistent banner prompting the developer to enter a key. This avoids
  // blocking the whole app (so pages, header, reader, etc. render even without
  // Clerk) while still allowing a developer to set the key at runtime.
  if (!key) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="p-3 rounded-lg bg-amber-warm text-ink-950 shadow-md">
            <div className="flex items-center gap-3">
              <div>
                <strong>Clerk not configured</strong>
                <div className="text-sm">Enter a publishable key to enable authentication.</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSetup(true)} className="btn btn-primary">Setup</button>
              </div>
            </div>
          </div>
        </div>

        {showSetup ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-60">
            <div className="p-6 rounded-lg bg-ink-900 border border-ink-800 max-w-lg w-full">
              <h2 className="text-lg font-bold mb-2">Setup Clerk</h2>
              <p className="text-sm mb-4">Enter your Clerk publishable key to enable authentication (you can also set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in your environment).</p>
              <input
                aria-label="Clerk publishable key"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded bg-ink-800 border border-ink-700"
                placeholder="pk_live_... or pk_test_..."
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowSetup(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={saveKey} className="btn btn-primary">Save & continue</button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <ClerkProvider publishableKey={key}>
      <AuthSync />
      {children}
    </ClerkProvider>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Mic2, BookOpen } from "./icons";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  const [clerkAvailable, setClerkAvailable] = useState(false);

  useEffect(() => {
    // Determine availability only on client — keep server and first-client render identical
    const hasKey = Boolean(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        (typeof window !== "undefined" && window.localStorage.getItem("CLERK_PUBLISHABLE_KEY"))
    );
    setClerkAvailable(hasKey);
  }, []);
  return (
    <header className="w-full border-b border-ink-800 bg-ink-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-amber-warm flex items-center justify-center">
            <BookOpen size={18} className="text-ink-950" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ink-950 flex items-center justify-center">
              <Mic2 size={7} className="text-amber-warm" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-paper-warm leading-none tracking-tight">
              SmartReaderAI
            </h1>
            <p className="text-xs text-ink-400 font-body tracking-wide mt-0.5">
              AI Reading Assistant
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden sm:flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-4">
            <a href="/" className="text-sm text-ink-300 hover:text-paper-warm">
              Home
            </a>
            <a href="/reader" className="text-sm text-ink-300 hover:text-paper-warm">
              Reader
            </a>
            <a href="/notes" className="text-sm text-ink-300 hover:text-paper-warm">
              Notes
            </a>
          </nav>


            {/* Clerk auth controls (only active if Clerk is configured) */}
          <div className="flex items-center gap-2">
            {/* Render a deterministic static UI on the server/initial render. After
                mount we check for a configured Clerk publishable key and replace
                the simple links with Clerk components if available. This avoids
                hydration mismatches that happen when client-only values are
                inspected during SSR. */}
            {clerkAvailable ? (
              <>
                <SignedIn>
                  <UserButton />
                </SignedIn>

                <SignedOut>
                  <div className="flex items-center gap-2">
                    <SignInButton>
                      <button className="btn btn-primary text-sm">Sign in</button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="btn btn-secondary text-sm">Sign up</button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <a href="/sign-in" className="btn btn-primary text-sm">Sign in</a>
                <a href="/sign-up" className="btn btn-secondary text-sm">Sign up</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

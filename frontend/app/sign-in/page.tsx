"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 text-paper-warm p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-ink-900 border border-ink-800">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <SignIn path="/sign-in" routing="path"/>
      </div>
    </div>
  );
}

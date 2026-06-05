"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 text-paper-warm p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-ink-900 border border-ink-800">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>
        <SignUp path="/sign-up" routing="path"/>
      </div>
    </div>
  );
}

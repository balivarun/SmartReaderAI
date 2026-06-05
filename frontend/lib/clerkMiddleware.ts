import { NextResponse } from "next/server";

// This module contains helper functions that would be used to initialize
// Clerk's auth middleware programmatically. We moved it out of the Top-level
// `middleware.ts` to avoid Next's deprecation warning for the `middleware`
// file convention. If you need to enable edge middleware behavior, consider
// following Next's "proxy" guidance and the Clerk docs for your Next version.

let clerkAuthMiddleware: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const clerk = require("@clerk/nextjs/server");
  if (clerk && typeof clerk.authMiddleware === "function") {
    clerkAuthMiddleware = clerk.authMiddleware();
  }
} catch (err) {
  // Ignore if Clerk isn't installed — callers can check clerkAuthMiddleware.
}

export function runClerkMiddleware(request: Request) {
  if (clerkAuthMiddleware) {
    try {
      return clerkAuthMiddleware(request as any) || NextResponse.next();
    } catch (e) {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

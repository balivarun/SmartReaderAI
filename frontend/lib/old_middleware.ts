import { NextResponse } from "next/server";

// This file was moved from the top-level `middleware.ts` to avoid Next's
// deprecation warning about the middleware file convention. Keep a copy here
// for reference; prefer using `lib/clerkMiddleware.ts` helpers and per-route
// protection (see `app/api/protected/route.ts`).

let clerkAuthMiddleware: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const clerk = require("@clerk/nextjs/server");
  if (clerk && typeof clerk.authMiddleware === "function") {
    clerkAuthMiddleware = clerk.authMiddleware();
  }
} catch (err) {
  // ignore
}

export function legacyMiddlewareForReference(request: Request) {
  if (clerkAuthMiddleware) {
    try {
      return clerkAuthMiddleware(request as any) || NextResponse.next();
    } catch (e) {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

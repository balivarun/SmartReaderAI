import { NextResponse } from "next/server";

// Backup of the previous middleware implementation moved out of project root
// to avoid Next.js deprecation warnings. Keep this file for reference only.

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

export function migratedMiddlewareBackup(request: Request) {
  if (clerkAuthMiddleware) {
    try {
      return clerkAuthMiddleware(request as any) || NextResponse.next();
    } catch (e) {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

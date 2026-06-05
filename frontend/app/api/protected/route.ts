import { NextResponse } from "next/server";

// Server-side API route example that validates a Clerk session.
// This demonstrates protecting an API route without using `middleware.ts`.

export async function GET(request: Request) {
  // Try to dynamically load Clerk's server SDK. If it's not installed,
  // return a helpful error message instead of failing the build.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const clerk = require("@clerk/nextjs/server");
    const { getAuth } = clerk;

    const auth = getAuth(request as any);
    if (!auth || !auth.userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify({ ok: true, userId: auth.userId }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ error: "Clerk SDK not installed. Install @clerk/nextjs." }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

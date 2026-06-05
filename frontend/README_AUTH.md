Clerk auth notes and migration from `middleware.ts`

Why remove `middleware.ts`?
- Next.js now warns that the `middleware` file convention is deprecated and recommends using the "proxy" approach.
- Leaving a `middleware.ts` file will cause that deprecation warning to appear on startup.

Recommended action
1. Delete `frontend/middleware.ts` (or rename it) to silence the deprecation warning.
   Example:

   ```bash
   cd frontend
   git rm middleware.ts
   git commit -m "Remove deprecated middleware.ts; use per-route protection"
   ```

2. Protect routes without middleware:
   - Use server-side checks in API routes and server components (see `app/api/protected/route.ts` example).
   - Use client-side components and guards (`<SignedIn>`, `<SignedOut>`) for UI-level protection.

Server-side example
- `app/api/protected/route.ts` demonstrates how to validate a Clerk session on a server-side API route with `getAuth(request)`.
- This pattern avoids relying on Next middleware and works with the App Router.

If you still want middleware-like behavior
- Consider implementing a proxy as instructed by Next's docs (https://nextjs.org/docs/messages/middleware-to-proxy) or use edge functions where appropriate.
- Check Clerk's docs for the recommended integration for your Next version.

Install Clerk
- If you haven't installed the Clerk package, do so:

```bash
cd frontend
npm install @clerk/nextjs
```

After installing, restart the dev server.

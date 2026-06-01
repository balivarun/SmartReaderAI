# SmartReaderAI

Monorepo containing frontend (Next.js) and backend (Spring Boot).

This README explains how to deploy the frontend only to Vercel.

## Deploying the frontend to Vercel

There are two recommended options to deploy just the `frontend` app to Vercel:

### Option A — Use the provided `vercel.json` (automatic)

This repository includes a `vercel.json` at the repository root that tells Vercel to build the `frontend` package using the Next.js builder. To deploy using this file:

1. Connect your GitHub/GitLab/Bitbucket repository in the Vercel dashboard.
2. When creating a new project from the repository, Vercel should detect the `vercel.json` and build the frontend.

No additional configuration is required; the `vercel.json` instructs Vercel to run the Next.js builder against `frontend/package.json`.

### Option B — Set the project root to `frontend` in Vercel (recommended for clarity)

1. In the Vercel dashboard, choose "Create New Project" and import your repository.
2. In the project settings (Import and Build step), set the "Root Directory" (or "Project Settings > Git > Root Directory") to `frontend`.
3. Vercel will then run the `build` script from `frontend/package.json`.

This is a clean approach if you only ever want to deploy the frontend from this repository.

## Local build and test

To run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

To build locally (same command Vercel runs):

```bash
npm run build
```

## Notes

- The `frontend/package.json` includes a `vercel-build` script to ensure Vercel runs `next build` when using the Vercel build pipeline.
- If you need environment variables (for AI APIs or keys), set them in the Vercel project settings (Environment Variables) — do not commit secrets to the repository.

If you want, I can also:
- Add a minimal `.vercelignore` to speed uploads,
- Configure preview/prod environment variable examples in `.env.example`,
- Configure GitHub Actions to deploy automatically to Vercel (though Vercel has built-in Git integration).

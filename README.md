# SmartReaderAI

An AI-powered voice reading assistant for hands-free note-taking and study. Paste or upload notes and the app reads them aloud with natural-sounding speech, adjustable speed, and voice-command controls such as pause, resume, repeat and navigation.

This repository contains two main parts:

- `frontend/` — Next.js + React + TypeScript + Tailwind UI (visual UI, voice controls, text areas, TTS integration)
- `backend/` — Spring Boot (Java) backend (API endpoints, persistence, optional AI integration and token management)

---

Table of contents
- Project overview
- Features
- Tech stack
- Prerequisites
- Local development
  - Frontend
  - Backend
- Environment variables
- Building for production
- Notes about design and styling
- Contributing
- License

---

Project overview

SmartReaderAI helps users study or take notes without looking at the screen. The app reads user-provided text, highlights the currently spoken sentence, supports voice commands (pause, resume, repeat, faster, slower, next/previous) and persists reading progress.

Features (planned / partial)
- Paste or upload text and documents (PDF/Word)
- Natural TTS (browser SpeechSynthesis API or external voices)
- Speech recognition for voice commands (Web Speech API or server-side STT)
- Adjustable playback speed and voice selection
- Highlight current sentence as it’s being read
- Save / continue reading progress
- Multi-language support and optional AI summarization

Tech stack
- Frontend: Next.js (app router), React 19, TypeScript, Tailwind CSS
- Backend: Spring Boot (Java / Gradle)
- Database: (optional) PostgreSQL — backend prepared to add persistence
- Optional: OpenAI / Google TTS or other AI APIs for advanced voices

Prerequisites
- Node.js (recommended 18+)
- npm or pnpm
- JDK 17+ (for Spring Boot)
- Gradle wrapper included in `backend/` (no global Gradle required)

Local development

Start the frontend
1. Open a terminal and go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies (if needed):

```bash
npm install
```

3. Start the Next.js dev server:

```bash
npm run dev
```

4. Open http://localhost:3000 to view the app.

Notes:
- The frontend uses Next.js (app directory). Port 3000 is the default.
- If you see dark backgrounds, the global styling forces a light theme; however existing components may contain `dark:` classes — those are harmless but will not flip the entire UI.

Start the backend
1. Open a terminal and go to the backend folder:

```bash
cd backend
```

2. Run the Spring Boot application using the Gradle wrapper:

```bash
./gradlew bootRun
```

3. By default the backend will bind to http://localhost:8080 (configurable via `application.properties`).

API
- The backend currently provides a basic Spring Boot application. Add endpoints in `src/main/java/com/example/backend`.
- If you will wire the frontend to the backend, the frontend fetch requests should point to `http://localhost:8080` (or a proxy).

Environment variables and configuration
- If you use external AI services, store API keys in environment variables and load them in the backend or in a secure serverless function. Some common env vars you might add:
  - `OPENAI_API_KEY` — OpenAI API key (if you use their API)
  - `GOOGLE_API_KEY` — Google Cloud key (if using Google TTS/STT)

Example: run backend with an env var (Bash):

```bash
export OPENAI_API_KEY=sk_...  # do not commit secrets
./gradlew bootRun
```

Building for production

Frontend (production build):

```bash
cd frontend
npm run build
npm start    # or use `next start` to run the production server
```

Backend (build & run):

```bash
cd backend
./gradlew build
java -jar build/libs/*.jar
```

Design and styling notes
- The frontend uses Tailwind CSS and a globals stylesheet in `frontend/app/globals.css` which currently forces a bright/light theme for the entire app.
- If you want a theme toggle (light/dark), implement a small stateful toggle and CSS variables to switch without relying on system `prefers-color-scheme`.

Project structure (high-level)
```
SmartReaderAI/
├─ backend/                # Spring Boot project
│  ├─ build.gradle
│  └─ src/main/java/...
├─ frontend/               # Next.js app
│  ├─ app/
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ public/
│  └─ package.json
└─ README.md               # <-- you are reading this
```

Contributing
- Open an issue describing your idea or bug.
- Create a branch named `feature/<short-name>` or `fix/<short-desc>`.
- Send a pull request when your change is ready.

Troubleshooting
- Frontend dev server not starting: ensure `node` & `npm` versions are compatible and run `npm install` again.
- Backend fails to start due to Java: ensure your `JAVA_HOME` points to a JDK 17+ installation.

Ideas for next steps
- Implement voice-command controls using the Web Speech API (SpeechRecognition) and tie them to the speech playback controls.
- Add TTS with higher-quality voices (cloud providers) and stream audio when using remote services.
- Add persistent user sessions and progress saving (PostgreSQL + JPA).
- Add file upload (PDF/Word) parsing on the backend for longer documents.

License
Add a license file (e.g., MIT) to this repository if you plan to open-source it.

---

If you'd like, I can also:
- Add a short `README` to the `frontend/` and `backend/` subfolders explaining their local dev steps (I can create those files too),
- Add a `Makefile` or root-level `dev` script that starts both frontend and backend simultaneously (using `concurrently` or `docker-compose`).

Tell me which of those you'd like and I'll create them. If you want the smaller per-subproject READMEs, I can add them now.
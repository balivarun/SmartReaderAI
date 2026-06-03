# SmartReaderAI

This repository contains a Next.js frontend and a Spring Boot backend for the SmartReaderAI project.

## Overview
- frontend/: Next.js + React UI using browser Speech Synthesis and Web Speech APIs.
- backend/: Spring Boot application providing:
  - Progress persistence (PostgreSQL)
  - Basic authentication (register/login -> JWT)
  - File conversion endpoint (`/api/convert`) using Apache Tika to extract text from PDF/Word

## Repository structure (full tree)
Below is the full project folder structure to help you and interviewers quickly locate files and understand the project layout.

```
 (Absolute Path: /home/jadu/projects/SmartReaderAI)/
 	README.md
 	vercel.json
 	backend/
 		build.gradle
 		gradlew
 		gradlew.bat
 		HELP.md
 		settings.gradle
 		build/
 			detected build artifacts, classes, libs, reports, resources
 		gradle/
 			distribution wrapper files
 		src/
 			main/
 				java/
 					com/
 						example/
 				resources/
 				test/
 	frontend/
 		AGENTS.md
 		CLAUDE.md
 		eslint.config.mjs
 		global.d.ts
 		next-env.d.ts
 		next.config.js
 		next.config.ts
 		package.json
 		postcss.config.mjs
 		README.md
 		tsconfig.json
 		app/
 			favicon.ico
 			globals.css
 			layout.tsx
 			page.tsx
 			reader/
 				Reader.tsx
 				components/
 					Controls.tsx
 					Preview.tsx
 					ProgressInfo.tsx
 					TextEditor.tsx
 					VoiceControl.tsx
 		components/
 			Header.tsx
 			icons.tsx
 			controls/
 				ControlBar.tsx
 				SpeedControl.tsx
 				VoiceCommandOverlay.tsx
 			reader/
 				Controls.tsx
 				NoteInput.tsx
 				Preview.tsx
 				ProgressInfo.tsx
 				ReaderPanel.tsx
 				TextEditor.tsx
 				VoiceControl.tsx
 			ui/
 				VoiceCommandHints.tsx
 				WaveformBars.tsx
 		hooks/
 			useTextToSpeech.ts
 			useVoiceCommands.ts
 		public/
 			file.svg
 			globe.svg
 			next.svg
 			vercel.svg
 			window.svg
 		types/
 			speech.d.ts

```

## Running locally (frontend + backend)

Prerequisites:
- Node.js 18+
- Java 17+ / JDK matching Gradle toolchain
- PostgreSQL running locally (or use a Docker container)

1. Start PostgreSQL (example using Docker):

```bash
docker run --name smartreader-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=smartreader -p 5432:5432 -d postgres:15
```

2. Start the backend (Spring Boot)

```bash
cd backend
./gradlew bootRun
```

The backend starts on port 8080 by default and expects a Postgres DB at `jdbc:postgresql://localhost:5432/smartreader` (configurable via environment variables in `backend/src/main/resources/application.properties`).

3. Start the frontend

```bash
cd frontend
npm install
# Optionally set API base URL if backend is on different origin
# echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080" > .env.local
npm run dev
```

Open http://localhost:3000

## Notes
- The frontend uses `NEXT_PUBLIC_API_BASE_URL` to configure the backend base URL. If not set, requests are made relative to the current origin.
- Authentication endpoints:
  - POST /api/auth/register { username, password }
  - POST /api/auth/login { username, password } -> returns { token }
- Progress endpoints:
  - POST /api/progress { id, text, currentIndex, rate }
  - GET /api/progress/{id}
- File conversion endpoint (multipart): POST /api/convert (form field `file`) -> returns extracted text

## Security & Production
- The JWT secret is set in `application.properties` via environment variable `JWT_SECRET`; change it to a secure random value in production.
- CORS is currently permissive for development; tighten it for production.
- The backend currently uses JPA `ddl-auto=update` for convenience; switch to migrations (Flyway/Liquibase) for production.

If you want, I can:
- Add Docker Compose to run frontend, backend, and database together.
- Add DB migrations and seed data.
- Protect progress endpoints to require authentication (currently allowed for development).


# SmartReaderAI

This repository contains a Next.js frontend and a Spring Boot backend for the SmartReaderAI project.

## Overview
- frontend/: Next.js + React UI using browser Speech Synthesis and Web Speech APIs.
- backend/: Spring Boot application providing:
  - Progress persistence (PostgreSQL)
  - Basic authentication (register/login -> JWT)
  - File conversion endpoint (`/api/convert`) using Apache Tika to extract text from PDF/Word

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


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Full project tree (backend + frontend)

Below is the full repository layout so you can quickly locate backend and frontend files when developing or preparing for interviews.

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
 		README and config files
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

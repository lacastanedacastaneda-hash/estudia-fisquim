# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**estudia-fisquim** is a web app for studying physics and chemistry (física y química). It is a fresh `create-next-app` scaffold; no app-specific features exist yet.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 — no `tailwind.config.*`; theme tokens live in `app/globals.css` (`@import "tailwindcss"` + `@theme inline`), and Tailwind is wired in through the Turbopack CSS loader rule in `next.config.ts`
- npm (use `npm`, not pnpm/yarn; `package-lock.json` is committed)
- Path alias `@/*` → repo root

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (also type-checks)
npm run start   # serve the production build
npm run lint    # ESLint (flat config in eslint.config.mjs)
```

No test framework is set up yet.

## Next.js notes

- This Next.js version is newer than most training data (see AGENTS.md): check `node_modules/next/dist/docs/` before using an API you're not sure about.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching`, which change the default data-fetching and caching behavior. Read the docs on those flags before adding data fetching or dynamic APIs.

## Conventions

- The project owner communicates in Spanish; reply in Spanish.

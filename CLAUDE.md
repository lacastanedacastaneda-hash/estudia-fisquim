# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**estudia-fisquim** is a study web app for a Física i Química exam for 3r d'ESO (Catalunya). The UI is in **Catalan** and must work well on mobile. There is no backend: the app is a static export, and progress is stored in `localStorage`.

Planned modules (each has a short explanation, random exercises with step-by-step correction, and a score counter):

1. Formulació inorgànica: name ↔ formula
2. Taula periòdica interactiva + quiz
3. Ions (anions/cations) — **implemented** (`/ions`)
4. Isòtops (ᴬ_Z X → protons, neutrons, electrons)
5. Massa atòmica i molecular (weighted isotope average, molecular mass)
6. Configuració electrònica (shells and subshells, for elements and ions)

The module list and each module's `available` flag are in `lib/modules.ts`; the home page renders from it.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- `output: "export"` in `next.config.ts` → `npm run build` writes static HTML/JS to `out/`. Don't re-enable `cacheComponents`/`partialPrefetching`; they're incompatible with export mode. Anything needing a server (route handlers with dynamic data, server actions, `next/image` default loader) won't work.
- Tailwind CSS v4 — no `tailwind.config.*`; theme in `app/globals.css`, wired in through the Turbopack CSS loader rule in `next.config.ts`. Dark mode follows `prefers-color-scheme` via `dark:` variants.
- npm. Path alias `@/*` → repo root.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # static export to out/ (also type-checks)
npm run lint    # ESLint (flat config in eslint.config.mjs)
```

No test framework is set up yet.

## Architecture

Each module follows the same split:

- `lib/<module>.ts` — pure logic, no React: generate a random exercise, parse the student's answers, and return a correction (`ok`, per-field results, step-by-step explanation strings in Catalan). Keep logic here so it can be tested without the UI.
- `app/<module>/page.tsx` — server component: metadata, the explanation text, `<ScoreBoard moduleId=…>`, and the quiz.
- `app/<module>/<Module>Quiz.tsx` — client component with the exercise form. Random exercises are generated **only on the client**: the outer component renders a placeholder until `useIsClient()` is true, so the prerendered HTML doesn't cause hydration mismatches with `Math.random()`.

Shared pieces:

- `lib/progress.ts` — `useScore(moduleId)` returns `{ score, record(ok), reset }`. It's a `useSyncExternalStore` over one `localStorage` key (`fisquim:progress:v1`, JSON map of module id → `{correct, total}`). Storage failures fall back to in-memory state. Use this for every module's score.
- `lib/elements.ts` — element data (Catalan names, Z, common ion charges). Currently only the elements used by the ions module; the periodic-table module will extend it with mass, group, period, and type.
- `lib/random.ts` — `randInt`, `pick`.

## Conventions

- All UI text is Catalan. Use proper chemistry notation: superscript charges (`Ca²⁺`, `Cl⁻`; see `ionSymbol` in `lib/ions.ts`) and the real minus sign `−` (U+2212) in displayed text. Answer parsers should also accept the ASCII `-`.
- Numeric inputs use `type="text"` with `inputMode="numeric"` for mobile keyboards.
- The project owner communicates in Spanish; reply in Spanish.

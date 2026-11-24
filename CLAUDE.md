# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**estudia-fisquim** is a study web app for a Física i Química exam for 3r d'ESO (Catalunya). The UI is in **Catalan** and must work well on mobile. There is no backend: the app is a static export, and progress is stored in `localStorage`.

Planned modules (each has a short explanation, random exercises with step-by-step correction, and a score counter):

1. Formulació inorgànica: name ↔ formula
2. Taula periòdica interactiva + quiz
3. Ions (anions/cations) — **implemented** (`/ions`)
4. Isòtops (ᴬ_Z X → protons, neutrons, electrons) — **implemented** (`/isotops`)
5. Massa atòmica i molecular (weighted isotope average, abundances from average, molecular mass) — **implemented** (`/massa`)
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

- `lib/<module>.ts` — pure logic, no React: `generate…(previous?)` returns a random exercise (different from the previous one), and `correct…(exercise, answers)` returns a `Correction` (`ok`, per-field results, step-by-step explanation strings in Catalan) built with `field`/`makeCorrection` from `lib/exercise.ts`. Answers are kept as raw input strings and parsed here. Keep logic here so it can be tested without the UI.
- `app/<module>/page.tsx` — server component: metadata, the explanation text, `<ScoreBoard moduleId=…>`, and the quiz.
- `app/<module>/<Module>Quiz.tsx` — client component. Wraps its content in `<ClientOnly>` (random exercises must only be generated in the browser, or the prerendered HTML won't match on hydration), uses `useQuiz({ moduleId, generate, emptyAnswers, correct })` for state and scoring, and renders a `QuizCard` (prompt, Comprova/Següent button, correction panel) with inputs from `components/quiz/fields.tsx`.

To add a module: write `lib/<module>.ts` following this shape, add the two `app/<module>/` files, and set `available: true` in `lib/modules.ts`.

Shared pieces:

- `lib/progress.ts` — `useScore(moduleId)` returns `{ score, record(ok), reset }`. It's a `useSyncExternalStore` over one `localStorage` key (`fisquim:progress:v1`, JSON map of module id → `{correct, total}`). Storage failures fall back to in-memory state. `useQuiz` already calls `record`.
- `lib/notation.ts` — plain-text chemistry notation: `ionSymbol` (Ca²⁺), `isotopeText` (³⁷₁₇Cl), `formatCharge` (2+, −), `chargeValue` (+2, −1), super/subscript helpers. `components/IsotopeNotation.tsx` renders ᴬ_Z X with stacked numbers for prompts.
- `lib/elements.ts` — element data: Catalan name, Z, common ion charges (`ions`, empty if none), real isotope mass numbers (`isotopes`). The periodic-table module will extend it with mass, group, period, and type.
- `lib/mass.ts` — besides the module logic, holds the atomic-mass table (`ATOMIC_MASS`, one decimal as in 3r ESO tables), natural isotope abundances, and `parseFormula` (counts atoms, handles parentheses: `Al2(SO4)3`). Formulas are stored as plain strings like `"Ca(OH)2"`; `formulaText` turns them into `Ca(OH)₂` for display.
- `lib/exercise.ts` — `parseCount` for integers, `parseDecimal`/`isClose` for decimal answers (accepts comma or dot and a trailing unit like `u` or `%`).
- `lib/random.ts` — `randInt`, `pick`.

## Conventions

- All UI text is Catalan. Use proper chemistry notation: superscript charges (`Ca²⁺`, `Cl⁻`; see `lib/notation.ts`) and the real minus sign `−` (U+2212) in displayed text. Answer parsers should also accept the ASCII `-`.
- Numeric inputs use `type="text"` with `inputMode="numeric"` (`NumberField`) or `"decimal"` (`DecimalField`) for mobile keyboards. Display decimals with a comma (`formatNumber`/`formatFixed` in `lib/notation.ts`).
- The project owner communicates in Spanish; reply in Spanish.

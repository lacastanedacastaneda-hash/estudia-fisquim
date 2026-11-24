"use client";

import type { FormEvent, ReactNode } from "react";
import type { Correction } from "@/lib/exercise";

/** Targeta d'exercici: enunciat, camps, correcció i botó Comprova / Següent. */
export default function QuizCard(props: {
  prompt: ReactNode;
  children: ReactNode;
  correction: Correction | null;
  complete: boolean;
  onCheck: () => void;
  onNext: () => void;
}) {
  const checked = props.correction !== null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (checked) props.onNext();
    else if (props.complete) props.onCheck();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>{props.prompt}</div>
      {props.children}
      {props.correction && <CorrectionPanel correction={props.correction} />}
      <button
        type="submit"
        disabled={!checked && !props.complete}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {checked ? "Següent exercici" : "Comprova"}
      </button>
    </form>
  );
}

function CorrectionPanel({ correction }: { correction: Correction }) {
  return (
    <div className="space-y-3" aria-live="polite">
      <p
        className={`rounded-lg px-3 py-2 font-semibold ${
          correction.ok
            ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
            : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {correction.ok ? "✓ Correcte!" : "✗ No del tot. Mira la resolució."}
      </p>

      <ul className="space-y-1 text-sm">
        {correction.fields.map((f) => (
          <li key={f.label} className="flex flex-wrap gap-x-2">
            <span className={f.ok ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
              {f.ok ? "✓" : "✗"}
            </span>
            <span className="font-medium">{f.label}:</span>
            <span>{f.given}</span>
            {!f.ok && <span className="text-zinc-500">(correcte: {f.expected})</span>}
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-950">
        <p className="font-semibold">Resolució pas a pas</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {correction.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

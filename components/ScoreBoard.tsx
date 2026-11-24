"use client";

import { useScore } from "@/lib/progress";

export default function ScoreBoard({ moduleId }: { moduleId: string }) {
  const { score, reset } = useScore(moduleId);
  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">Encerts</p>
        <p className="text-lg font-semibold tabular-nums">
          {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="ml-2 text-sm font-normal text-zinc-500">({pct}%)</span>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (score.total === 0 || window.confirm("Vols posar a zero el marcador d'aquest mòdul?")) reset();
        }}
        disabled={score.total === 0}
        className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        Reinicia
      </button>
    </div>
  );
}

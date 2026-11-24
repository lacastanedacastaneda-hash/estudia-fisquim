"use client";

import { CATEGORY_LABEL, PERIODIC_TABLE, type Category, type PTElement } from "@/lib/periodic-table";

// Classes escrites senceres perquè Tailwind les detecti.
export const CATEGORY_CLASS: Record<Category, string> = {
  alkali: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
  "alkaline-earth": "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
  transition: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  lanthanide: "bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-100",
  actinide: "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950 dark:text-fuchsia-100",
  "post-transition": "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  metalloid: "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-100",
  nonmetal: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  halogen: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-100",
  "noble-gas": "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
};

export type CellMark = "correct" | "wrong";

/** Posició a la graella: columna 1 = etiquetes de període, fila 1 = números de grup. */
function cellPosition(e: PTElement): { col: number; row: number } {
  if (e.group !== null) return { col: e.group + 1, row: e.period + 1 };
  // Bloc f: dues files a sota, des de la columna del grup 3.
  const first = e.period === 6 ? 57 : 89;
  return { col: 4 + (e.z - first), row: e.period === 6 ? 10 : 11 };
}

export default function PeriodicTable(props: {
  selected: number | null;
  onSelect: (z: number) => void;
  marks?: Partial<Record<number, CellMark>>;
  disabled?: boolean;
}) {
  const { selected, onSelect, marks = {}, disabled = false } = props;

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div
        className="grid min-w-[40rem] gap-0.5"
        style={{ gridTemplateColumns: "1.5rem repeat(18, minmax(2.1rem, 1fr))" }}
        role="group"
        aria-label="Taula periòdica"
      >
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={`g${i}`}
            className="text-center text-[10px] text-zinc-500"
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            {i + 1}
          </div>
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={`p${i}`}
            className="flex items-center justify-center text-[10px] text-zinc-500"
            style={{ gridColumn: 1, gridRow: i + 2 }}
          >
            {i + 1}
          </div>
        ))}
        {[
          { row: 7, label: "57–71" },
          { row: 8, label: "89–103" },
        ].map((p) => (
          <div
            key={p.label}
            className="flex items-center justify-center rounded border border-dashed border-zinc-300 text-[9px] text-zinc-500 dark:border-zinc-700"
            style={{ gridColumn: 4, gridRow: p.row }}
          >
            {p.label}
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1", gridRow: 9 }} className="h-2" />

        {PERIODIC_TABLE.map((e) => {
          const { col, row } = cellPosition(e);
          const mark = marks[e.z];
          const ring =
            mark === "correct"
              ? "ring-2 ring-green-600 ring-offset-1 dark:ring-green-400"
              : mark === "wrong"
                ? "ring-2 ring-red-600 ring-offset-1 dark:ring-red-400"
                : selected === e.z
                  ? "ring-2 ring-blue-600 ring-offset-1 dark:ring-blue-400"
                  : "";
          return (
            <button
              key={e.z}
              type="button"
              onClick={() => onSelect(e.z)}
              disabled={disabled}
              aria-label={`${e.name}, Z = ${e.z}`}
              aria-pressed={selected === e.z}
              className={`relative flex aspect-[5/6] flex-col items-center justify-center rounded leading-none ring-offset-white dark:ring-offset-zinc-900 ${CATEGORY_CLASS[e.category]} ${ring} enabled:hover:brightness-95 disabled:cursor-default`}
              style={{ gridColumn: col, gridRow: row }}
            >
              <span className="absolute top-0.5 left-0.5 text-[8px] opacity-70">{e.z}</span>
              <span className="mt-1 text-sm font-semibold">{e.symbol}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryLegend() {
  return (
    <ul className="flex flex-wrap gap-1.5 text-xs">
      {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
        <li key={c} className={`rounded px-2 py-0.5 ${CATEGORY_CLASS[c]}`}>
          {CATEGORY_LABEL[c]}
        </li>
      ))}
    </ul>
  );
}

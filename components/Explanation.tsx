import type { ReactNode } from "react";

// Blocs per a les explicacions llargues dels mòduls.

/** Classe per a un requadre gris amb una fórmula o una regla. */
export const formulaBox = "rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      {children}
    </section>
  );
}

export function Example({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  );
}

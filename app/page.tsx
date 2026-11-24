import Link from "next/link";
import { MODULES } from "@/lib/modules";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Física i Química · 3r d&apos;ESO</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Tria un tema i practica amb exercicis aleatoris corregits pas a pas.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => {
          const content = (
            <>
              <h2 className="font-semibold">{m.title}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{m.description}</p>
              {!m.available && (
                <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                  Properament
                </span>
              )}
            </>
          );
          const base = "block h-full rounded-xl border p-4";
          return (
            <li key={m.id}>
              {m.available ? (
                <Link
                  href={m.href}
                  className={`${base} border-zinc-200 bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className={`${base} border-dashed border-zinc-200 opacity-60 dark:border-zinc-800`}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

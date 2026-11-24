import type { Metadata } from "next";
import TaulaApp from "./TaulaApp";

export const metadata: Metadata = {
  title: "Taula periòdica",
};

export default function TaulaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Taula periòdica</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            Els elements estan ordenats per <strong>nombre atòmic (Z)</strong>, de menor a major.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Les files són els <strong>períodes</strong> (1–7). El període indica el nombre de capes amb electrons.
            </li>
            <li>
              Les columnes són els <strong>grups</strong> (1–18). Els elements d&apos;un mateix grup tenen propietats
              semblants: grup 1, alcalins; grup 2, alcalinoterris; grup 17, halògens; grup 18, gasos nobles.
            </li>
            <li>
              Els <strong>lantànids</strong> i els <strong>actínids</strong> es posen a sota perquè la taula no sigui
              massa ampla.
            </li>
          </ul>
          <p>
            <strong>Metalls</strong> a l&apos;esquerra i al centre; <strong>no metalls</strong> a la dreta (a dalt);
            els <strong>semimetalls</strong> (B, Si, Ge, As, Sb, Te) fan l&apos;escala entre tots dos; els{" "}
            <strong>gasos nobles</strong> són el grup 18. L&apos;hidrogen és al grup 1 però és un no metall.
          </p>
          <p className="text-zinc-500">
            Les masses entre parèntesis són les de l&apos;isòtop més estable d&apos;elements que no tenen isòtops
            estables. El quiz pregunta pels 36 primers elements i alguns d&apos;habituals (Ag, Sn, I, Au, Hg, Pb, U…).
          </p>
        </div>
      </details>

      <TaulaApp />
    </div>
  );
}

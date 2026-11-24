import type { Metadata } from "next";
import IsotopeNotation from "@/components/IsotopeNotation";
import ScoreBoard from "@/components/ScoreBoard";
import IsotopesQuiz from "./IsotopesQuiz";

export const metadata: Metadata = {
  title: "Isòtops",
};

export default function IsotopesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Isòtops</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>Un àtom s&apos;escriu amb dos números a l&apos;esquerra del símbol:</p>
          <div className="flex items-center gap-4">
            <span className="text-4xl">
              <IsotopeNotation symbol="X" a={14} z={6} />
            </span>
            <ul className="space-y-1">
              <li>
                <strong>A</strong> (a dalt): <strong>nombre màssic</strong> = protons + neutrons
              </li>
              <li>
                <strong>Z</strong> (a baix): <strong>nombre atòmic</strong> = protons
              </li>
            </ul>
          </div>
          <p>
            <strong>Isòtops</strong> són àtoms del mateix element (mateix Z, mateixos protons) amb diferent nombre de
            neutrons, i per tant diferent A. Per exemple, el carboni-12 i el carboni-14.
          </p>
          <p className="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[13px] dark:bg-zinc-800">
            protons = Z<br />
            neutrons = A − Z<br />
            electrons = Z (si és neutre)<br />
            electrons = Z − càrrega (si és un ió)
          </p>
          <p>Exemple: ¹⁴₆C → 6 protons, 14 − 6 = 8 neutrons i 6 electrons.</p>
        </div>
      </details>

      <ScoreBoard moduleId="isotops" />
      <IsotopesQuiz />
    </div>
  );
}

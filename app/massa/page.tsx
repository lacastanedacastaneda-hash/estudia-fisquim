import type { Metadata } from "next";
import ScoreBoard from "@/components/ScoreBoard";
import MassQuiz from "./MassQuiz";

export const metadata: Metadata = {
  title: "Massa atòmica i molecular",
};

export default function MassPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Massa atòmica i molecular</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            Les masses dels àtoms es mesuren en <strong>unitats de massa atòmica (u)</strong>.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Massa atòmica d&apos;un element</h3>
            <p>
              Un element és una barreja dels seus isòtops. La seva massa atòmica és la{" "}
              <strong>mitjana ponderada</strong> de les masses dels isòtops segons la seva abundància (%):
            </p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[13px] dark:bg-zinc-800">
              M = (m₁ · %₁ + m₂ · %₂ + …) / 100
            </p>
            <p>
              Exemple: el clor té ³⁵Cl (75,8 %) i ³⁷Cl (24,2 %).
              <br />M = (35 · 75,8 + 37 · 24,2) / 100 = (2653 + 895,4) / 100 = 35,48 u.
            </p>
            <p>
              Si et donen la massa atòmica i et demanen les abundàncies, anomena x l&apos;abundància d&apos;un isòtop i
              (100 − x) la de l&apos;altre, i aïlla x de la mateixa fórmula.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Massa molecular</h3>
            <p>
              És la suma de les masses atòmiques de tots els àtoms de la fórmula. Cada subíndex indica quants àtoms
              hi ha de l&apos;element; si va després d&apos;un parèntesi, multiplica tot el que hi ha a dins.
            </p>
            <p>
              Exemple: H₂SO₄ → 2 · 1,0 + 1 · 32,1 + 4 · 16,0 = 2,0 + 32,1 + 64,0 = 98,1 u.
            </p>
            <p className="text-zinc-500">
              En els compostos iònics (com el NaCl) no hi ha molècules i se&apos;n diu massa fórmula, però es calcula
              igual.
            </p>
          </div>
        </div>
      </details>

      <ScoreBoard moduleId="massa" />
      <MassQuiz />
    </div>
  );
}

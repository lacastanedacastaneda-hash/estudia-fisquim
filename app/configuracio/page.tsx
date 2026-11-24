import type { Metadata } from "next";
import MoellerDiagram from "@/components/MoellerDiagram";
import ScoreBoard from "@/components/ScoreBoard";
import ConfigQuiz from "./ConfigQuiz";

export const metadata: Metadata = {
  title: "Configuració electrònica",
};

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuració electrònica</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            Els electrons s&apos;organitzen en <strong>capes</strong> (n = 1, 2, 3…) i cada capa en{" "}
            <strong>subnivells</strong> s, p, d i f. Cada subnivell admet un màxim d&apos;electrons:
          </p>
          <p className="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[13px] dark:bg-zinc-800">
            s: 2 · p: 6 · d: 10 · f: 14
          </p>
          <p>
            Els subnivells s&apos;omplen en l&apos;ordre del <strong>diagrama de Moeller</strong> (seguint les
            diagonals). El número de cada casella és l&apos;ordre d&apos;ompliment:
          </p>
          <MoellerDiagram />
          <p>
            Exemple: Na (Z = 11) → <strong>1s² 2s² 2p⁶ 3s¹</strong>. Per capes sumem els electrons de cada n:{" "}
            <strong>2, 8, 1</strong>.
          </p>
          <p>
            Compte: el 4s s&apos;omple abans que el 3d, però el 3d és de la capa 3. Fe (Z = 26) → 1s² 2s² 2p⁶ 3s² 3p⁶
            4s² 3d⁶ → per capes 2, 8, 14, 2.
          </p>
          <p>
            <strong>Ions:</strong> primer calcula els electrons. En un anió suma els que ha guanyat (Cl⁻: 17 + 1 =
            18) i en un catió resta els que ha perdut (Na⁺: 11 − 1 = 10). Després omple igual: Cl⁻ → 1s² 2s² 2p⁶ 3s²
            3p⁶, la mateixa configuració que l&apos;argó.
          </p>
          <p className="text-zinc-500">
            Pots escriure els exponents com a números normals (1s2 2s2 2p6) i abreujar amb un gas noble: [Ne] 3s1.
            El crom i el coure són excepcions al diagrama i no surten als exercicis.
          </p>
        </div>
      </details>

      <ScoreBoard moduleId="configuracio" />
      <ConfigQuiz />
    </div>
  );
}

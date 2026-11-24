import type { Metadata } from "next";
import ScoreBoard from "@/components/ScoreBoard";
import IonsQuiz from "./IonsQuiz";

export const metadata: Metadata = {
  title: "Ions",
};

export default function IonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ions: anions i cations</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            Un <strong>àtom neutre</strong> té tants protons com electrons. El nombre de protons és el{" "}
            <strong>nombre atòmic (Z)</strong>.
          </p>
          <p>
            Un <strong>ió</strong> és un àtom que ha guanyat o perdut electrons. Els protons{" "}
            <strong>no canvien mai</strong>: només canvien els electrons.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Catió</strong> (càrrega +): ha <em>perdut</em> electrons. Solen ser metalls. Ex.: Na⁺, Ca²⁺.
            </li>
            <li>
              <strong>Anió</strong> (càrrega −): ha <em>guanyat</em> electrons. Solen ser no metalls. Ex.: Cl⁻, O²⁻.
            </li>
          </ul>
          <p className="rounded-lg bg-zinc-100 px-3 py-2 font-mono text-[13px] dark:bg-zinc-800">
            protons = Z<br />
            electrons = Z − càrrega<br />
            càrrega = protons − electrons
          </p>
          <p>
            Exemple: O²⁻ (Z = 8) → 8 protons; electrons = 8 − (−2) = 10; és un anió.
          </p>
        </div>
      </details>

      <ScoreBoard moduleId="ions" />
      <IonsQuiz />
    </div>
  );
}

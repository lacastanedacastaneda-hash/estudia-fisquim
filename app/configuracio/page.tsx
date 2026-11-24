import type { Metadata } from "next";
import { Example, Section, formulaBox as box } from "@/components/Explanation";
import MoellerDiagram from "@/components/MoellerDiagram";
import ScoreBoard from "@/components/ScoreBoard";
import ConfigQuiz from "./ConfigQuiz";
import ConfigStepper from "./ConfigStepper";

export const metadata: Metadata = {
  title: "Configuració electrònica",
};

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuració electrònica</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-4 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <Section title="Què és">
            <p>
              La configuració electrònica diu <strong>com es reparteixen els electrons</strong> d&apos;un àtom o
              d&apos;un ió en capes i subnivells. Els electrons sempre ocupen primer els llocs de menys energia.
            </p>
          </Section>

          <Section title="Capes i subnivells">
            <p>
              Els electrons s&apos;organitzen en <strong>capes</strong> (n = 1, 2, 3…). Cada capa es divideix en{" "}
              <strong>subnivells</strong>, que s&apos;anomenen s, p, d i f. La capa n té n subnivells:
            </p>
            <ul className="list-disc space-y-0.5 pl-5">
              <li>Capa 1: 1s</li>
              <li>Capa 2: 2s, 2p</li>
              <li>Capa 3: 3s, 3p, 3d</li>
              <li>Capa 4: 4s, 4p, 4d, 4f (i a partir d&apos;aquí, també s, p, d i f)</li>
            </ul>
            <p>Cada subnivell admet un nombre màxim d&apos;electrons:</p>
            <p className={`${box} font-mono text-[13px]`}>s: 2 · p: 6 · d: 10 · f: 14</p>
            <p>
              Per tant, una capa admet com a màxim 2n² electrons: 2 a la capa 1, 8 a la 2, 18 a la 3 i 32 a la 4.
            </p>
          </Section>

          <Section title="Com es llegeix">
            <p className={`${box} text-center`}>
              <span className="text-2xl font-bold">3p⁵</span>
            </p>
            <ul className="list-disc space-y-0.5 pl-5">
              <li>
                <strong>3</strong>: la capa (n = 3).
              </li>
              <li>
                <strong>p</strong>: el subnivell.
              </li>
              <li>
                <strong>⁵</strong> (l&apos;exponent): quants electrons hi ha en aquest subnivell.
              </li>
            </ul>
          </Section>

          <Section title="L'ordre d'ompliment: el diagrama de Moeller">
            <p>
              Els subnivells no s&apos;omplen per ordre de capa, sinó per ordre d&apos;energia. Per recordar-lo,
              s&apos;escriuen els subnivells en files i se segueixen les diagonals de dalt a baix:
            </p>
            <MoellerDiagram />
            <p>
              Fixa&apos;t que el <strong>4s s&apos;omple abans que el 3d</strong>, i el 5s abans que el 4d: tenen menys
              energia encara que siguin d&apos;una capa més alta.
            </p>
          </Section>

          <Section title="El mètode, pas a pas">
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <strong>Compta els electrons.</strong> Àtom neutre: tants com Z. Anió: suma els que ha guanyat. Catió:
                resta els que ha perdut.
              </li>
              <li>
                <strong>Segueix el diagrama de Moeller</strong> i omple cada subnivell fins al màxim (2, 6, 10 o 14)
                abans de passar al següent.
              </li>
              <li>
                <strong>Quan et quedin menys electrons</strong> dels que hi caben, posa-hi els que quedin: aquest
                subnivell queda a mitges i ja has acabat.
              </li>
              <li>
                <strong>Comprova</strong> que la suma dels exponents és igual al nombre d&apos;electrons.
              </li>
              <li>
                <strong>Per capes:</strong> suma els electrons de tots els subnivells amb el mateix número.
              </li>
            </ol>
          </Section>

          <Section title="Exemples resolts">
            <div className="grid gap-3 sm:grid-cols-2">
              <Example title="Oxigen, O (Z = 8)">
                <p>8 electrons: 1s² (en portem 2) → 2s² (4) → 2p⁴ (8, el 2p queda a mitges).</p>
                <p>
                  <strong>1s² 2s² 2p⁴</strong> → per capes: <strong>2, 6</strong>
                </p>
              </Example>
              <Example title="Potassi, K (Z = 19)">
                <p>1s² 2s² 2p⁶ 3s² 3p⁶ ja són 18. L&apos;electró que queda va al 4s, no al 3d.</p>
                <p>
                  <strong>1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹</strong> → per capes: <strong>2, 8, 8, 1</strong>
                </p>
              </Example>
              <Example title="Ferro, Fe (Z = 26)">
                <p>Fins al 4s² en portem 20. Els 6 que queden van al 3d.</p>
                <p>
                  <strong>1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶</strong>
                </p>
                <p>
                  Per capes: capa 3 = 3s² + 3p⁶ + 3d⁶ = 14 → <strong>2, 8, 14, 2</strong>
                </p>
              </Example>
              <Example title="Ió sulfur, S²⁻ (Z = 16)">
                <p>Ha guanyat 2 electrons: 16 + 2 = 18 electrons.</p>
                <p>
                  <strong>1s² 2s² 2p⁶ 3s² 3p⁶</strong> → per capes: <strong>2, 8, 8</strong>
                </p>
                <p>Té la mateixa configuració que l&apos;argó, un gas noble: per això és un ió estable.</p>
              </Example>
              <Example title="Ió magnesi, Mg²⁺ (Z = 12)">
                <p>Ha perdut 2 electrons: 12 − 2 = 10 electrons.</p>
                <p>
                  <strong>1s² 2s² 2p⁶</strong> → per capes: <strong>2, 8</strong> (com el neó)
                </p>
              </Example>
            </div>
          </Section>

          <Section title="Forma abreujada">
            <p>
              Els electrons interns tenen la mateixa configuració que el gas noble anterior. Es poden substituir pel
              seu símbol entre claudàtors:
            </p>
            <p className={box}>
              Na: 1s² 2s² 2p⁶ 3s¹ = <strong>[Ne] 3s¹</strong> · Fe: <strong>[Ar] 4s² 3d⁶</strong>
            </p>
            <p>Gasos nobles: He (2 electrons), Ne (10), Ar (18), Kr (36), Xe (54).</p>
          </Section>

          <Section title="Errors freqüents">
            <ul className="list-disc space-y-1 pl-5">
              <li>Escriure el 3d abans del 4s: segueix sempre l&apos;ordre de Moeller.</li>
              <li>Posar més electrons dels que hi caben: 2p⁷ o 3d¹² no existeixen.</li>
              <li>Als ions, fer servir Z en lloc dels electrons reals.</li>
              <li>Per capes, sumar el 3d a la capa 4 perquè va després del 4s: és de la capa 3.</li>
            </ul>
          </Section>

          <Section title="Excepcions">
            <p>
              El crom i el coure no segueixen exactament el diagrama: un electró del 4s passa al 3d perquè així el 3d
              queda mig ple o ple, que és més estable. Cr: [Ar] 4s¹ 3d⁵ · Cu: [Ar] 4s¹ 3d¹⁰. No surten als exercicis.
            </p>
          </Section>

          <p className="text-zinc-500">
            Als exercicis pots escriure els exponents com a números normals (1s2 2s2 2p6) i fer servir la forma
            abreujada ([Ne] 3s1).
          </p>
        </div>
      </details>

      <ConfigStepper />

      <ScoreBoard moduleId="configuracio" />
      <ConfigQuiz />
    </div>
  );
}

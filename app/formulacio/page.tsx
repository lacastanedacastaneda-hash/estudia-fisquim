import type { Metadata } from "next";
import ScoreBoard from "@/components/ScoreBoard";
import FormulationQuiz from "./FormulationQuiz";

export const metadata: Metadata = {
  title: "Formulació inorgànica",
};

const box = "rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800";
const h3 = "font-semibold text-zinc-900 dark:text-zinc-100";

export default function FormulationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Formulació inorgànica</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div className="space-y-2">
            <h3 className={h3}>Compostos binaris</h3>
            <p>
              Tenen dos elements. A la fórmula, el <strong>menys electronegatiu va a l&apos;esquerra</strong> i el
              més electronegatiu, a la dreta. En el nom es diu primer el de la dreta (acabat en <em>-ur</em>, o{" "}
              <em>òxid</em> si és l&apos;oxigen) i després «de» + el de l&apos;esquerra.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong>Òxids:</strong> element + oxigen (O amb −2). Ex.: Fe₂O₃, CO₂.
              </li>
              <li>
                <strong>Hidrurs metàl·lics:</strong> metall + hidrogen (H amb −1). Ex.: NaH, CaH₂.
              </li>
              <li>
                <strong>Hidrurs no metàl·lics:</strong> H + no metall dels grups 16 o 17 (H amb +1, a l&apos;esquerra).
                Ex.: HCl, H₂S. Alguns tenen nom comú: H₂O aigua, NH₃ amoníac, CH₄ metà, PH₃ fosfà, SiH₄ silà, BH₃ borà.
              </li>
              <li>
                <strong>Sals binàries:</strong> metall + no metall, o dos no metalls. Ex.: NaCl, FeCl₃, CCl₄.
              </li>
            </ul>
            <p className={box}>
              Nombres d&apos;oxidació de la dreta: O −2 · H −1 · F, Cl, Br, I −1 · S, Se −2 · N, P −3
            </p>
          </div>

          <div className="space-y-2">
            <h3 className={h3}>Nomenclatura sistemàtica (prefixos)</h3>
            <p>Els prefixos indiquen el nombre d&apos;àtoms de cada element:</p>
            <p className={box}>mono 1 · di 2 · tri 3 · tetra 4 · penta 5 · hexa 6 · hepta 7</p>
            <p>
              Fe₂O₃ → <strong>triòxid de diferro</strong> · CCl₄ → <strong>tetraclorur de carboni</strong> · CaO →{" "}
              <strong>monòxid de calci</strong>. El «mono» de l&apos;element de l&apos;esquerra no es diu mai, i el
              de la dreta és opcional.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className={h3}>Nomenclatura de Stock</h3>
            <p>
              No porta prefixos. Si l&apos;element de l&apos;esquerra pot actuar amb més d&apos;un nombre
              d&apos;oxidació, s&apos;indica en xifres romanes entre parèntesis, enganxat al nom: Fe₂O₃ →{" "}
              <strong>òxid de ferro(III)</strong>. Si només en té un, no s&apos;indica: Na₂O →{" "}
              <strong>òxid de sodi</strong>.
            </p>
            <p>Per saber-lo, multiplica el de la dreta pel seu subíndex i reparteix-lo entre els àtoms de l&apos;esquerra.</p>
          </div>

          <div className="space-y-2">
            <h3 className={h3}>Del nom a la fórmula</h3>
            <p>
              <strong>Sistemàtica:</strong> els prefixos són els subíndexs. <strong>Stock:</strong> intercanvia els
              nombres d&apos;oxidació i simplifica: estany(IV) + òxid → Sn₂O₄ → <strong>SnO₂</strong>.
            </p>
          </div>

          <p className="text-zinc-500">
            Pots escriure les fórmules amb números normals (Fe2O3) i els noms sense accents. Compte amb les majúscules
            dels símbols: Co (cobalt) no és CO.
          </p>
        </div>
      </details>

      <ScoreBoard moduleId="formulacio" />
      <FormulationQuiz />
    </div>
  );
}

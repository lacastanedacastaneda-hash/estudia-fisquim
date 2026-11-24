import type { Metadata } from "next";
import { Example, Section, formulaBox as box } from "@/components/Explanation";
import ScoreBoard from "@/components/ScoreBoard";
import MassQuiz from "./MassQuiz";
import MolecularExample from "./MolecularExample";

export const metadata: Metadata = {
  title: "Massa atòmica i molecular",
};

export default function MassPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Massa atòmica i molecular</h1>

      <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" open>
        <summary className="cursor-pointer font-semibold">Explicació</summary>
        <div className="mt-4 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <Section title="La unitat de massa atòmica (u)">
            <p>
              Els àtoms són tan petits que la seva massa en grams és un nombre molt incòmode. Per això es fa servir la{" "}
              <strong>unitat de massa atòmica (u)</strong>: la dotzena part de la massa d&apos;un àtom de carboni-12.
            </p>
            <p>
              Un protó i un neutró pesen gairebé 1 u cadascun, i un electró gairebé res (unes 2000 vegades menys). Per
              això la massa d&apos;un isòtop és aproximadament igual al seu <strong>nombre màssic A</strong>: el
              clor-35 pesa unes 35 u.
            </p>
          </Section>

          <Section title="Per què la massa atòmica no és un nombre enter">
            <p>
              A la natura, cada element és una <strong>barreja dels seus isòtops</strong> en unes proporcions fixes
              (l&apos;abundància, en %). Per exemple, de cada 100 àtoms de clor, uns 76 són de clor-35 i uns 24 de
              clor-37.
            </p>
            <p>
              La massa atòmica que surt a la taula periòdica (35,45 u per al clor) és la{" "}
              <strong>mitjana ponderada</strong> de les masses dels isòtops: compten més els isòtops més abundants.
            </p>
          </Section>

          <Section title="Com es calcula la massa atòmica">
            <p className={`${box} text-center font-mono text-[13px]`}>
              M = (m₁ · %₁ + m₂ · %₂ + …) / 100
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <strong>Multiplica</strong> la massa de cada isòtop pel seu percentatge d&apos;abundància.
              </li>
              <li>
                <strong>Suma</strong> tots els resultats.
              </li>
              <li>
                <strong>Divideix entre 100</strong> (perquè els percentatges sumen 100).
              </li>
              <li>
                <strong>Comprova</strong> que el resultat queda entre la massa de l&apos;isòtop més lleuger i la del més
                pesant, i més a prop del més abundant.
              </li>
            </ol>
            <p>
              També es pot fer amb les abundàncies en tant per u (75,8 % = 0,758): M = m₁ · 0,758 + m₂ · 0,242. Dona el
              mateix i no cal dividir entre 100.
            </p>
          </Section>

          <Section title="Exercicis resolts: massa atòmica">
            <div className="grid gap-3 sm:grid-cols-2">
              <Example title="1. Clor: dos isòtops">
                <p>³⁵Cl (75,8 %) i ³⁷Cl (24,2 %). Pren com a massa el nombre màssic.</p>
                <p>M = (35 · 75,8 + 37 · 24,2) / 100</p>
                <p>M = (2653 + 895,4) / 100 = 3548,4 / 100</p>
                <p>
                  M = <strong>35,48 u</strong>. Queda més a prop de 35, perquè el clor-35 és el més abundant.
                </p>
              </Example>
              <Example title="2. Magnesi: tres isòtops">
                <p>²⁴Mg (79 %), ²⁵Mg (10 %) i ²⁶Mg (11 %).</p>
                <p>M = (24 · 79 + 25 · 10 + 26 · 11) / 100</p>
                <p>M = (1896 + 250 + 286) / 100 = 2432 / 100</p>
                <p>
                  M = <strong>24,32 u</strong>. Amb tres isòtops es fa igual: un terme per isòtop.
                </p>
              </Example>
              <Example title="3. Coure: masses amb decimals">
                <p>⁶³Cu (62,93 u, 69,2 %) i ⁶⁵Cu (64,93 u, 30,8 %).</p>
                <p>M = (62,93 · 69,2 + 64,93 · 30,8) / 100</p>
                <p>M = (4354,756 + 1999,844) / 100 = 6354,6 / 100</p>
                <p>
                  M = 63,546 ≈ <strong>63,55 u</strong>. Si et donen la massa exacta de cada isòtop, fes-la servir en
                  lloc del nombre màssic.
                </p>
              </Example>
              <Example title="4. Problema invers: trobar les abundàncies">
                <p>Un element X té dos isòtops, ⁶⁹X i ⁷¹X, i la seva massa atòmica és 69,8 u. Quina és l&apos;abundància de cada un?</p>
                <p>
                  Anomena <strong>x</strong> l&apos;abundància de ⁶⁹X. La de ⁷¹X és <strong>100 − x</strong>, perquè
                  sumen 100 %.
                </p>
                <p>69,8 = (69 · x + 71 · (100 − x)) / 100</p>
                <p>6980 = 69x + 7100 − 71x</p>
                <p>6980 − 7100 = −2x → −120 = −2x → x = 60</p>
                <p>
                  ⁶⁹X: <strong>60 %</strong> i ⁷¹X: 100 − 60 = <strong>40 %</strong>.
                </p>
              </Example>
            </div>
          </Section>

          <Section title="Massa molecular">
            <p>
              La <strong>massa molecular</strong> és la massa d&apos;una molècula: la suma de les masses atòmiques de{" "}
              <strong>tots</strong> els àtoms que té. Les masses atòmiques les trobaràs a la taula periòdica.
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                <strong>Compta els àtoms</strong> de cada element. El subíndex diu quants n&apos;hi ha del símbol que té
                just davant (sense subíndex, 1). Un subíndex després d&apos;un parèntesi multiplica tot el que hi ha a
                dins.
              </li>
              <li>
                <strong>Multiplica</strong> el nombre d&apos;àtoms de cada element per la seva massa atòmica.
              </li>
              <li>
                <strong>Suma</strong> els resultats. La unitat també és la u.
              </li>
            </ol>
            <p>
              En els compostos iònics (com el NaCl) no hi ha molècules i se&apos;n diu <strong>massa fórmula</strong>,
              però es calcula exactament igual.
            </p>
          </Section>

          <Section title="Exercicis resolts: massa molecular">
            <div className="grid gap-3 sm:grid-cols-2">
              <MolecularExample formula="H2O" name="aigua" note="2 àtoms d'hidrogen i 1 d'oxigen." />
              <MolecularExample formula="CO2" name="diòxid de carboni" />
              <MolecularExample
                formula="Ca(OH)2"
                name="hidròxid de calci"
                note="El 2 de fora multiplica l'O i l'H de dins del parèntesi: 2 O i 2 H."
              />
              <MolecularExample
                formula="Al2(SO4)3"
                name="sulfat d'alumini"
                note="Dins del parèntesi hi ha 1 S i 4 O; el 3 ho multiplica: 3 S i 12 O."
              />
              <MolecularExample formula="C6H12O6" name="glucosa" />
              <MolecularExample formula="H2SO4" name="àcid sulfúric" />
            </div>
          </Section>

          <Section title="Errors freqüents">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Fer la mitjana simple dels isòtops: (35 + 37) / 2 = 36 és incorrecte, perquè no té en compte quin
                isòtop és més abundant.
              </li>
              <li>Oblidar dividir entre 100 quan les abundàncies estan en %.</li>
              <li>No multiplicar els àtoms de dins d&apos;un parèntesi: a Ca(OH)₂ hi ha 2 H, no 1.</li>
              <li>Confondre el subíndex amb el coeficient: 2 H₂O són dues molècules d&apos;aigua, però la massa d&apos;una molècula continua sent 18,0 u.</li>
              <li>Oblidar posar les unitats (u) al resultat.</li>
            </ul>
          </Section>

          <p className="text-zinc-500">
            Als exercicis, les masses atòmiques es donen amb un decimal. Pots escriure el resultat amb coma o amb punt.
          </p>
        </div>
      </details>

      <ScoreBoard moduleId="massa" />
      <MassQuiz />
    </div>
  );
}

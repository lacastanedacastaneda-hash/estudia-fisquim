import { Example } from "@/components/Explanation";
import { ATOMIC_MASS, molecularMass, parseFormula } from "@/lib/mass";
import { formatFixed, formulaText } from "@/lib/notation";
import { PERIODIC_TABLE } from "@/lib/periodic-table";

const nameOf = (symbol: string) => PERIODIC_TABLE.find((e) => e.symbol === symbol)?.name.toLowerCase() ?? symbol;

/**
 * Exemple resolt de massa molecular. Els números es calculen amb les mateixes
 * dades i funcions que corregeixen els exercicis, per no equivocar-nos.
 */
export default function MolecularExample({ formula, name, note }: { formula: string; name: string; note?: string }) {
  const parts = parseFormula(formula).map(([el, n]) => ({ el, n, mass: ATOMIC_MASS[el], subtotal: n * ATOMIC_MASS[el] }));
  const total = molecularMass(formula);

  return (
    <Example
      title={
        <>
          {formulaText(formula)} <span className="font-normal text-zinc-500">({name})</span>
        </>
      }
    >
      {note && <p>{note}</p>}
      <table className="w-full text-left tabular-nums">
        <thead className="text-xs text-zinc-500">
          <tr>
            <th className="py-0.5 pr-2 font-medium">Element</th>
            <th className="py-0.5 pr-2 font-medium">Àtoms</th>
            <th className="py-0.5 font-medium">Massa</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => (
            <tr key={p.el} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-0.5 pr-2">
                <strong>{p.el}</strong> <span className="text-zinc-500">({nameOf(p.el)})</span>
              </td>
              <td className="py-0.5 pr-2">{p.n}</td>
              <td className="py-0.5">
                {p.n} · {formatFixed(p.mass, 1)} = {formatFixed(p.subtotal, 1)} u
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        M = {parts.map((p) => formatFixed(p.subtotal, 1)).join(" + ")} = <strong>{formatFixed(total, 1)} u</strong>
      </p>
    </Example>
  );
}

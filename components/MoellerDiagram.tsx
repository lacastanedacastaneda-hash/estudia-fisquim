import { MOELLER_ORDER } from "@/lib/configuration";

const LETTERS = ["s", "p", "d", "f"] as const;

/** Diagrama de Moeller com a graella: cada subnivell porta el seu número d'ordre d'ompliment. */
export default function MoellerDiagram() {
  const order = new Map<string, number>(MOELLER_ORDER.map((name, i) => [name, i + 1]));
  return (
    <div className="overflow-x-auto">
      <table className="text-center text-sm tabular-nums" aria-label="Diagrama de Moeller">
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <tr key={n}>
              <th scope="row" className="pr-2 text-right font-medium text-zinc-500">
                n = {n}
              </th>
              {LETTERS.map((l) => {
                const i = order.get(`${n}${l}`);
                return (
                  <td key={l} className="p-0.5">
                    {i && (
                      <span className="relative block min-w-11 rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                        {n}
                        {l}
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-blue-600 px-1 text-[10px] leading-4 font-bold text-white">
                          {i}
                        </span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

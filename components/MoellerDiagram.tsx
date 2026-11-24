import { MOELLER_ORDER } from "@/lib/configuration";

// Diagrama de Moeller: subnivells en files (n) i columnes (s, p, d, f), amb
// fletxes diagonals que indiquen l'ordre d'ompliment (de dalt a baix).

const L = ["s", "p", "d", "f"] as const;
const COL = 64; // separació horitzontal entre columnes
const ROW = 44; // separació vertical entre files
const X0 = 36;
const Y0 = 26;

const cells = MOELLER_ORDER.map((name) => {
  const n = Number(name[0]);
  const l = L.indexOf(name[1] as (typeof L)[number]);
  return { name, n, l, x: X0 + l * COL, y: Y0 + (n - 1) * ROW };
});

// Una diagonal per a cada valor de n + l, començant per la cel·la de dalt a la dreta.
const diagonals = [...new Set(cells.map((c) => c.n + c.l))].map((k) =>
  cells.filter((c) => c.n + c.l === k).sort((a, b) => a.n - b.n),
);

// Pas entre dues cel·les consecutives d'una diagonal (una fila avall, una columna a l'esquerra).
const DX = -COL;
const DY = ROW;
const LEN = Math.hypot(DX, DY);

export default function MoellerDiagram() {
  const width = X0 + 3 * COL + 36;
  const height = Y0 + 6 * ROW + 30;

  return (
    <figure className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto block w-full max-w-xs"
        role="img"
        aria-label={`Diagrama de Moeller. Ordre d'ompliment: ${MOELLER_ORDER.join(", ")}.`}
      >
        {diagonals.map((diag) => {
          const first = diag[0];
          const last = diag[diag.length - 1];
          const x1 = first.x - 0.55 * DX;
          const y1 = first.y - 0.55 * DY;
          const x2 = last.x + 0.5 * DX;
          const y2 = last.y + 0.5 * DY;
          // Punta de fletxa al final.
          const ux = DX / LEN;
          const uy = DY / LEN;
          const head = 7;
          const tip = `${x2},${y2}`;
          const left = `${x2 - head * ux + head * 0.6 * uy},${y2 - head * uy - head * 0.6 * ux}`;
          const right = `${x2 - head * ux - head * 0.6 * uy},${y2 - head * uy + head * 0.6 * ux}`;
          return (
            <g key={first.name} className="stroke-blue-500 fill-blue-500 dark:stroke-blue-400 dark:fill-blue-400">
              <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} strokeLinecap="round" />
              <polygon points={`${tip} ${left} ${right}`} stroke="none" />
            </g>
          );
        })}
        {cells.map((c) => (
          <g key={c.name}>
            <rect
              x={c.x - 20}
              y={c.y - 13}
              width={40}
              height={26}
              rx={6}
              className="fill-white stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-600"
            />
            <text
              x={c.x}
              y={c.y + 5}
              textAnchor="middle"
              className="fill-zinc-900 text-[14px] font-semibold dark:fill-zinc-100"
            >
              {c.name}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="text-center text-xs text-zinc-500">
        Segueix les fletxes d&apos;una en una, de dalt a baix: {MOELLER_ORDER.slice(0, 11).join(" → ")} → …
      </figcaption>
    </figure>
  );
}

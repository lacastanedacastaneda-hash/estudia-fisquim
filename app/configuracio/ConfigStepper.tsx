"use client";

import { useState, type ReactNode } from "react";
import {
  MOELLER_EXCEPTIONS,
  abbreviatedConfig,
  configText,
  configuration,
  fillingSteps,
  shells,
} from "@/lib/configuration";
import { ELEMENTS } from "@/lib/elements";
import { chargeValue, ionSymbol, superscript } from "@/lib/notation";
import { PERIODIC_TABLE } from "@/lib/periodic-table";

const MAX_Z = 38;
const CHOICES = PERIODIC_TABLE.filter((e) => e.z <= MAX_Z);

/** Ions que acaben amb configuració de gas noble (els mateixos que surten als exercicis). */
function ionsOf(z: number): number[] {
  const e = ELEMENTS.find((x) => x.z === z);
  return (e?.ions ?? []).filter((q) => [2, 10, 18, 36].includes(z - q));
}

const selectClass =
  "mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-950";

/** Resolució guiada: tria un element o ió i mostra l'ompliment pas a pas. */
export default function ConfigStepper() {
  const [z, setZ] = useState(26);
  const [charge, setCharge] = useState(0);
  const element = CHOICES[z - 1];
  const electrons = z - charge;
  const steps = fillingSteps(electrons);
  const config = configuration(electrons);
  const shellCounts = shells(config);
  const abbreviated = abbreviatedConfig(electrons);
  const valenceShell = shellCounts.length;
  const exception = charge === 0 ? MOELLER_EXCEPTIONS[z] : undefined;
  const ions = ionsOf(z);
  const symbol = ionSymbol(element.symbol, charge);

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">Prova-ho pas a pas</h2>

      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <label className="block">
          <span className="text-sm font-medium">Element</span>
          <select
            className={selectClass}
            value={z}
            onChange={(e) => {
              setZ(Number(e.target.value));
              setCharge(0);
            }}
          >
            {CHOICES.map((e) => (
              <option key={e.z} value={e.z}>
                {e.z} · {e.name} ({e.symbol})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Àtom o ió</span>
          <select
            className={selectClass}
            value={charge}
            onChange={(e) => setCharge(Number(e.target.value))}
            disabled={ions.length === 0}
          >
            <option value={0}>Àtom neutre</option>
            {ions.map((q) => (
              <option key={q} value={q}>
                Ió {ionSymbol(element.symbol, q)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="space-y-4 text-sm leading-relaxed">
        <Step n={1} title="Compta els electrons">
          {charge === 0 ? (
            <>
              {symbol} és un àtom neutre: té tants electrons com protons. Z = {z} → <strong>{electrons} electrons</strong>.
            </>
          ) : (
            <>
              {symbol} té càrrega {chargeValue(charge)}: {charge < 0 ? "ha guanyat" : "ha perdut"} {Math.abs(charge)}{" "}
              {Math.abs(charge) === 1 ? "electró" : "electrons"}. {z} {charge < 0 ? "+" : "−"} {Math.abs(charge)} ={" "}
              <strong>{electrons} electrons</strong>.
            </>
          )}
        </Step>

        <Step n={2} title="Omple els subnivells en l'ordre de Moeller">
          <p>Cada subnivell s&apos;omple fins al màxim abans de passar al següent. L&apos;últim pot quedar a mitges.</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-left tabular-nums">
              <thead className="text-xs text-zinc-500">
                <tr>
                  <th className="py-1 pr-2 font-medium">Subnivell</th>
                  <th className="py-1 pr-2 font-medium">Hi caben</th>
                  <th className="py-1 pr-2 font-medium">Hi posem</th>
                  <th className="py-1 pr-2 font-medium">Portem</th>
                  <th className="py-1 font-medium">En queden</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s) => {
                  const partial = s.subshell.count < s.capacity;
                  return (
                    <tr key={`${s.subshell.n}${s.subshell.l}`} className="border-t border-zinc-200 dark:border-zinc-800">
                      <td className="py-1 pr-2 font-semibold">
                        {s.subshell.n}
                        {s.subshell.l}
                      </td>
                      <td className="py-1 pr-2">{s.capacity}</td>
                      <td className={`py-1 pr-2 ${partial ? "font-semibold text-amber-700 dark:text-amber-400" : ""}`}>
                        {s.subshell.count}
                        {partial && " (a mitges)"}
                      </td>
                      <td className="py-1 pr-2">{s.total}</td>
                      <td className="py-1">{s.remaining}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Step>

        <Step n={3} title="Escriu la configuració">
          <p className="text-lg font-semibold">{configText(config)}</p>
          <p className="text-zinc-500">
            Comprovació: {config.map((s) => s.count).join(" + ")} = {electrons} ✓
          </p>
        </Step>

        <Step n={4} title="Agrupa per capes">
          <p>Suma els electrons que tenen el mateix número (capa), sigui quin sigui el subnivell:</p>
          <ul className="mt-1 space-y-0.5">
            {shellCounts.map((total, i) => {
              const parts = config.filter((s) => s.n === i + 1);
              return (
                <li key={i}>
                  Capa {i + 1}: {parts.map((s) => `${s.n}${s.l}${superscript(String(s.count))}`).join(" + ")}
                  {parts.length > 1 ? ` = ${parts.map((s) => s.count).join(" + ")}` : ""} → <strong>{total}</strong>
                </li>
              );
            })}
          </ul>
          <p className="mt-1">
            Per capes: <strong>{shellCounts.join(", ")}</strong>
          </p>
          {config.some((s) => s.l === "d") && (
            <p className="mt-1 text-zinc-500">El 3d és de la capa 3, encara que s&apos;escrigui després del 4s.</p>
          )}
        </Step>

        <Step n={5} title="Forma abreujada i capa de valència">
          {abbreviated ? (
            <p>
              Abreujada amb el gas noble anterior: <strong>{abbreviated}</strong>
            </p>
          ) : (
            <p>No té forma abreujada: no hi ha cap gas noble amb menys electrons.</p>
          )}
          <p>
            Capa de valència (la més externa): capa {valenceShell}, amb{" "}
            <strong>{shellCounts[valenceShell - 1]} electrons</strong>.
          </p>
        </Step>
      </ol>

      {exception && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Compte: {element.name.toLowerCase()} és una excepció. Seguint Moeller surt el que veus a dalt, però la
          configuració real és <strong>{exception}</strong>: un electró del 4s passa al 3d perquè així queda mig ple o
          ple, que és més estable.
        </p>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </li>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useIsClient, useScore } from "@/lib/progress";
import {
  EMPTY_ANSWERS,
  TYPE_LABEL,
  correctIonExercise,
  generateIonExercise,
  ionSymbol,
  type IonAnswers,
  type IonCorrection,
  type IonExercise,
  type IonType,
} from "@/lib/ions";

export default function IonsQuiz() {
  // L'exercici és aleatori: es genera només al navegador per evitar
  // diferències entre l'HTML estàtic i la hidratació.
  const isClient = useIsClient();
  if (!isClient) {
    return <div className="h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />;
  }
  return <Quiz />;
}

function Quiz() {
  const { record } = useScore("ions");
  const [exercise, setExercise] = useState<IonExercise>(() => generateIonExercise());
  const [answers, setAnswers] = useState<IonAnswers>(EMPTY_ANSWERS);
  const [correction, setCorrection] = useState<IonCorrection | null>(null);

  const { element, charge } = exercise;
  const electrons = element.z - charge;
  const checked = correction !== null;

  const complete =
    answers.type !== null &&
    (exercise.kind === "particles"
      ? answers.protons.trim() !== "" && answers.electrons.trim() !== ""
      : answers.charge.trim() !== "");

  function set<K extends keyof IonAnswers>(key: K, value: IonAnswers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (checked) {
      setExercise(generateIonExercise(exercise));
      setAnswers(EMPTY_ANSWERS);
      setCorrection(null);
      return;
    }
    if (!complete) return;
    const result = correctIonExercise(exercise, answers);
    setCorrection(result);
    record(result.ok);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <p className="text-sm text-zinc-500">
          {element.name} · Z = {element.z}
        </p>
        {exercise.kind === "particles" ? (
          <p className="mt-1 text-lg">
            Per a l&apos;ió <span className="text-3xl font-bold">{ionSymbol(element.symbol, charge)}</span>,
            calcula els protons i els electrons i digues quin tipus d&apos;ió és.
          </p>
        ) : (
          <p className="mt-1 text-lg">
            Un ió de <strong>{element.name.toLowerCase()}</strong> ({element.symbol}) té{" "}
            <strong>{electrons} electrons</strong>. Quina és la seva càrrega? Quin tipus d&apos;ió és?
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {exercise.kind === "particles" ? (
          <>
            <NumberField
              label="Nombre de protons"
              value={answers.protons}
              onChange={(v) => set("protons", v)}
              disabled={checked}
            />
            <NumberField
              label="Nombre d'electrons"
              value={answers.electrons}
              onChange={(v) => set("electrons", v)}
              disabled={checked}
            />
          </>
        ) : (
          <label className="block">
            <span className="text-sm font-medium">Càrrega de l&apos;ió</span>
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              placeholder="p. ex. 2+ o 1−"
              value={answers.charge}
              onChange={(e) => set("charge", e.target.value)}
              disabled={checked}
              className={inputClass}
            />
          </label>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Tipus d&apos;ió</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {(["cation", "anion"] as IonType[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={answers.type === t}
              disabled={checked}
              onClick={() => set("type", t)}
              className={`rounded-lg border px-3 py-2.5 font-medium ${
                answers.type === t
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-zinc-300 dark:border-zinc-700"
              } disabled:opacity-70`}
            >
              {TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </fieldset>

      {correction && <Correction correction={correction} />}

      <button
        type="submit"
        disabled={!checked && !complete}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
      >
        {checked ? "Següent exercici" : "Comprova"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-lg tabular-nums dark:border-zinc-700 dark:bg-zinc-950 disabled:opacity-70";

function NumberField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        className={inputClass}
      />
    </label>
  );
}

function Correction({ correction }: { correction: IonCorrection }) {
  return (
    <div className="space-y-3" aria-live="polite">
      <p
        className={`rounded-lg px-3 py-2 font-semibold ${
          correction.ok
            ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
            : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {correction.ok ? "✓ Correcte!" : "✗ No del tot. Mira la resolució."}
      </p>

      <ul className="space-y-1 text-sm">
        {correction.fields.map((f) => (
          <li key={f.label} className="flex flex-wrap gap-x-2">
            <span className={f.ok ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
              {f.ok ? "✓" : "✗"}
            </span>
            <span className="font-medium">{f.label}:</span>
            <span>{f.given}</span>
            {!f.ok && <span className="text-zinc-500">(correcte: {f.expected})</span>}
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-950">
        <p className="font-semibold">Resolució pas a pas</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {correction.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

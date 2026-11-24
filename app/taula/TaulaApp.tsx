"use client";

import { useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import PeriodicTable, { CATEGORY_CLASS, CategoryLegend, type CellMark } from "@/components/PeriodicTable";
import ScoreBoard from "@/components/ScoreBoard";
import QuizCard from "@/components/quiz/QuizCard";
import { ChoiceField, NumberField, TextField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import { EMPTY_PT_ANSWERS, correctPTExercise, generatePTExercise } from "@/lib/periodic-quiz";
import {
  CATEGORY_LABEL,
  TYPE_LABEL,
  articled,
  byZ,
  massText,
  valencesText,
  type BroadType,
} from "@/lib/periodic-table";

type Mode = "explore" | "quiz";

export default function TaulaApp() {
  const [mode, setMode] = useState<Mode>("explore");

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800">
        {(
          [
            ["explore", "Explora"],
            ["quiz", "Quiz"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-2 font-medium ${
              mode === m ? "bg-white shadow-sm dark:bg-zinc-950" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "explore" ? (
        <Explore />
      ) : (
        <>
          <ScoreBoard moduleId="taula" />
          <ClientOnly>
            <Quiz />
          </ClientOnly>
        </>
      )}
    </div>
  );
}

function Explore() {
  const [selected, setSelected] = useState<number | null>(null);
  const e = selected ? byZ(selected) : null;

  return (
    <div className="space-y-4">
      <div
        className="min-h-36 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        aria-live="polite"
      >
        {e ? (
          <div className="flex gap-4">
            <div
              className={`flex h-24 w-20 shrink-0 flex-col items-center justify-center rounded-lg ${CATEGORY_CLASS[e.category]}`}
            >
              <span className="text-xs">{e.z}</span>
              <span className="text-3xl font-bold">{e.symbol}</span>
              <span className="text-[10px]">{massText(e)}</span>
            </div>
            <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
              <dt className="text-zinc-500">Nom</dt>
              <dd className="font-semibold">{e.name}</dd>
              <dt className="text-zinc-500">Símbol</dt>
              <dd>{e.symbol}</dd>
              <dt className="text-zinc-500">Z</dt>
              <dd>{e.z}</dd>
              <dt className="text-zinc-500">Massa</dt>
              <dd>
                {massText(e)} u
                {e.radioactiveMass && <span className="text-zinc-500"> (isòtop més estable)</span>}
              </dd>
              <dt className="text-zinc-500">Valències</dt>
              <dd className={e.valences.length ? "font-semibold tabular-nums" : "text-zinc-500"}>{valencesText(e)}</dd>
              <dt className="text-zinc-500">Grup</dt>
              <dd>{e.group ?? "— (bloc f)"}</dd>
              <dt className="text-zinc-500">Període</dt>
              <dd>{e.period}</dd>
              <dt className="text-zinc-500">Tipus</dt>
              <dd>
                {TYPE_LABEL[e.type]}
                {CATEGORY_LABEL[e.category] !== TYPE_LABEL[e.type] && (
                  <span className="text-zinc-500"> · {CATEGORY_LABEL[e.category]}</span>
                )}
              </dd>
            </dl>
          </div>
        ) : (
          <p className="text-zinc-500">Toca un element de la taula per veure&apos;n les dades.</p>
        )}
      </div>
      <PeriodicTable selected={selected} onSelect={setSelected} />
      <CategoryLegend />
    </div>
  );
}

const TYPE_OPTIONS = (Object.keys(TYPE_LABEL) as BroadType[]).map((value) => ({ value, label: TYPE_LABEL[value] }));

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "taula",
    generate: generatePTExercise,
    emptyAnswers: EMPTY_PT_ANSWERS,
    correct: correctPTExercise,
  });
  const e = byZ(exercise.z);
  const { el, de } = articled(e.name);
  const card = { correction, onCheck: check, onNext: next };
  const filled = (v: string) => v.trim() !== "";

  switch (exercise.kind) {
    case "symbol":
      return (
        <QuizCard {...card} complete={filled(answers.text)} prompt={<p className="text-lg">Quin és el símbol {de}?</p>}>
          <TextField label="Símbol" value={answers.text} onChange={(v) => setAnswer("text", v)} disabled={checked} />
        </QuizCard>
      );

    case "name":
      return (
        <QuizCard
          {...card}
          complete={filled(answers.text)}
          prompt={
            <p className="text-lg">
              Quin element té el símbol <span className="text-3xl font-bold">{e.symbol}</span>?
            </p>
          }
        >
          <TextField label="Nom de l'element" value={answers.text} onChange={(v) => setAnswer("text", v)} disabled={checked} />
        </QuizCard>
      );

    case "position":
      return (
        <QuizCard
          {...card}
          complete={filled(answers.group) && filled(answers.period)}
          prompt={
            <p className="text-lg">
              En quin grup i en quin període és {el} ({e.symbol})?
            </p>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Grup" value={answers.group} onChange={(v) => setAnswer("group", v)} disabled={checked} />
            <NumberField label="Període" value={answers.period} onChange={(v) => setAnswer("period", v)} disabled={checked} />
          </div>
        </QuizCard>
      );

    case "type":
      return (
        <QuizCard
          {...card}
          complete={answers.type !== null}
          prompt={
            <p className="text-lg">
              {capitalize(el)} ({e.symbol}) és un metall, un no metall, un semimetall o un gas noble?
            </p>
          }
        >
          <ChoiceField
            label="Tipus"
            options={TYPE_OPTIONS}
            value={answers.type}
            onChange={(v) => setAnswer("type", v)}
            disabled={checked}
          />
        </QuizCard>
      );

    case "locate": {
      const marks: Partial<Record<number, CellMark>> = {};
      if (checked) {
        if (answers.picked !== null && answers.picked !== e.z) marks[answers.picked] = "wrong";
        marks[e.z] = "correct";
      }
      return (
        <QuizCard
          {...card}
          complete={answers.picked !== null}
          prompt={
            <p className="text-lg">
              Toca a la taula on és <strong>{el}</strong>.
            </p>
          }
        >
          <PeriodicTable
            selected={answers.picked}
            onSelect={(z) => setAnswer("picked", z)}
            marks={marks}
            disabled={checked}
          />
          {!checked && answers.picked !== null && (
            <p className="text-sm text-zinc-500">
              Has triat: <strong>{byZ(answers.picked).symbol}</strong>. Prem «Comprova» o toca un altre element.
            </p>
          )}
        </QuizCard>
      );
    }
  }
}

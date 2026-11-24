"use client";

import ClientOnly from "@/components/ClientOnly";
import QuizCard from "@/components/quiz/QuizCard";
import { ChoiceField, NumberField, TextField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import {
  EMPTY_ION_ANSWERS,
  TYPE_LABEL,
  correctIonExercise,
  generateIonExercise,
  type IonType,
} from "@/lib/ions";
import { ionSymbol } from "@/lib/notation";

const TYPE_OPTIONS = (["cation", "anion"] as IonType[]).map((value) => ({ value, label: TYPE_LABEL[value] }));

export default function IonsQuiz() {
  return (
    <ClientOnly>
      <Quiz />
    </ClientOnly>
  );
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "ions",
    generate: generateIonExercise,
    emptyAnswers: EMPTY_ION_ANSWERS,
    correct: correctIonExercise,
  });

  const { element, charge } = exercise;
  const complete =
    answers.type !== null &&
    (exercise.kind === "particles"
      ? answers.protons.trim() !== "" && answers.electrons.trim() !== ""
      : answers.charge.trim() !== "");

  const prompt = (
    <>
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
          <strong>{element.z - charge} electrons</strong>. Quina és la seva càrrega? Quin tipus d&apos;ió és?
        </p>
      )}
    </>
  );

  return (
    <QuizCard prompt={prompt} correction={correction} complete={complete} onCheck={check} onNext={next}>
      <div className="grid gap-4 sm:grid-cols-2">
        {exercise.kind === "particles" ? (
          <>
            <NumberField
              label="Nombre de protons"
              value={answers.protons}
              onChange={(v) => setAnswer("protons", v)}
              disabled={checked}
            />
            <NumberField
              label="Nombre d'electrons"
              value={answers.electrons}
              onChange={(v) => setAnswer("electrons", v)}
              disabled={checked}
            />
          </>
        ) : (
          <TextField
            label="Càrrega de l'ió"
            placeholder="p. ex. 2+ o 1−"
            value={answers.charge}
            onChange={(v) => setAnswer("charge", v)}
            disabled={checked}
          />
        )}
      </div>
      <ChoiceField
        label="Tipus d'ió"
        options={TYPE_OPTIONS}
        value={answers.type}
        onChange={(v) => setAnswer("type", v)}
        disabled={checked}
      />
    </QuizCard>
  );
}

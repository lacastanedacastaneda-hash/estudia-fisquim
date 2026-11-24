"use client";

import ClientOnly from "@/components/ClientOnly";
import QuizCard from "@/components/quiz/QuizCard";
import { DecimalField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import {
  ATOMIC_MASS,
  EMPTY_MASS_ANSWERS,
  abundanceMass,
  correctMassExercise,
  generateMassExercise,
  parseFormula,
} from "@/lib/mass";
import { formatFixed, formatNumber, formulaText, superscript } from "@/lib/notation";

export default function MassQuiz() {
  return (
    <ClientOnly>
      <Quiz />
    </ClientOnly>
  );
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "massa",
    generate: generateMassExercise,
    emptyAnswers: EMPTY_MASS_ANSWERS,
    correct: correctMassExercise,
  });
  const filled = (v: string) => v.trim() !== "";
  const card = { correction, onCheck: check, onNext: next };

  if (exercise.kind === "average") {
    return (
      <QuizCard
        {...card}
        complete={filled(answers.mass)}
        prompt={
          <>
            <p className="text-lg">
              Calcula la massa atòmica {exercise.of} ({exercise.symbol}) a partir dels seus isòtops naturals.
            </p>
            <table className="mt-3 w-full text-left text-sm tabular-nums">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-1 font-medium">Isòtop</th>
                  <th className="py-1 font-medium">Massa</th>
                  <th className="py-1 font-medium">Abundància</th>
                </tr>
              </thead>
              <tbody>
                {exercise.isotopes.map((i) => (
                  <tr key={i.a} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="py-1.5 text-base font-semibold">
                      {superscript(String(i.a))}
                      {exercise.symbol}
                    </td>
                    <td className="py-1.5">{i.a} u</td>
                    <td className="py-1.5">{formatNumber(i.pct, 1)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-zinc-500">
              Pren com a massa de cada isòtop el seu nombre màssic. Arrodoneix a dos decimals.
            </p>
          </>
        }
      >
        <DecimalField
          label="Massa atòmica"
          unit="u"
          value={answers.mass}
          onChange={(v) => setAnswer("mass", v)}
          disabled={checked}
        />
      </QuizCard>
    );
  }

  if (exercise.kind === "abundance") {
    const { a1, a2, x } = exercise;
    const iso1 = `${superscript(String(a1))}X`;
    const iso2 = `${superscript(String(a2))}X`;
    return (
      <QuizCard
        {...card}
        complete={filled(answers.pct1) && filled(answers.pct2)}
        prompt={
          <p className="text-lg">
            Un element X té dos isòtops, <strong>{iso1}</strong> i <strong>{iso2}</strong>, i la seva massa atòmica
            és <strong>{formatNumber(abundanceMass(a1, a2, x))} u</strong>. Quina és l&apos;abundància (%) de cada
            isòtop? Pren com a massa de cada isòtop el seu nombre màssic.
          </p>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <DecimalField
            label={`Abundància de ${iso1}`}
            unit="%"
            value={answers.pct1}
            onChange={(v) => setAnswer("pct1", v)}
            disabled={checked}
          />
          <DecimalField
            label={`Abundància de ${iso2}`}
            unit="%"
            value={answers.pct2}
            onChange={(v) => setAnswer("pct2", v)}
            disabled={checked}
          />
        </div>
      </QuizCard>
    );
  }

  const elements = parseFormula(exercise.formula).map(([el]) => el);
  return (
    <QuizCard
      {...card}
      complete={filled(answers.mass)}
      prompt={
        <>
          <p className="text-lg">
            Calcula la massa molecular de{" "}
            <span className="text-2xl font-bold">{formulaText(exercise.formula)}</span>{" "}
            <span className="text-zinc-500">({exercise.name})</span>.
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Masses atòmiques:{" "}
            {elements.map((el) => `${el} = ${formatFixed(ATOMIC_MASS[el], 1)} u`).join(" · ")}
          </p>
        </>
      }
    >
      <DecimalField
        label="Massa molecular"
        unit="u"
        value={answers.mass}
        onChange={(v) => setAnswer("mass", v)}
        disabled={checked}
      />
    </QuizCard>
  );
}

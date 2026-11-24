"use client";

import ClientOnly from "@/components/ClientOnly";
import QuizCard from "@/components/quiz/QuizCard";
import { TextField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import {
  EMPTY_FORMULATION_ANSWERS,
  NOMENCLATURE_LABEL,
  correctFormulationExercise,
  generateFormulationExercise,
  normalizeFormula,
  shownName,
} from "@/lib/formulation";
import { formulaText } from "@/lib/notation";

export default function FormulationQuiz() {
  return (
    <ClientOnly>
      <Quiz />
    </ClientOnly>
  );
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "formulacio",
    generate: generateFormulationExercise,
    emptyAnswers: EMPTY_FORMULATION_ANSWERS,
    correct: correctFormulationExercise,
  });
  const { compound, direction, nomenclature } = exercise;
  const card = { correction, onCheck: check, onNext: next, complete: answers.text.trim() !== "" };

  if (direction === "to-formula") {
    const preview = normalizeFormula(answers.text);
    return (
      <QuizCard
        {...card}
        prompt={
          <p className="text-lg">
            Escriu la fórmula de: <strong className="text-xl">{shownName(compound, nomenclature)}</strong>
          </p>
        }
      >
        <div>
          <TextField
            label="Fórmula"
            placeholder="p. ex. Fe2O3"
            value={answers.text}
            onChange={(v) => setAnswer("text", v)}
            disabled={checked}
          />
          <p className="mt-1 text-sm text-zinc-500">
            {preview ? (
              <>
                Es llegeix: <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">{formulaText(preview)}</span>
              </>
            ) : (
              "Escriu els subíndexs com a números normals: es mostraran a sota."
            )}
          </p>
        </div>
      </QuizCard>
    );
  }

  return (
    <QuizCard
      {...card}
      prompt={
        <p className="text-lg">
          {compound.special ? (
            <>Escriu el nom de </>
          ) : (
            <>
              Escriu el nom en nomenclatura <strong>{NOMENCLATURE_LABEL[nomenclature]}</strong> de{" "}
            </>
          )}
          <span className="text-3xl font-bold">{formulaText(compound.formula)}</span>
        </p>
      }
    >
      <TextField
        label="Nom"
        placeholder={nomenclature === "stock" ? "p. ex. òxid de ferro(III)" : "p. ex. triòxid de diferro"}
        value={answers.text}
        onChange={(v) => setAnswer("text", v)}
        disabled={checked}
      />
    </QuizCard>
  );
}

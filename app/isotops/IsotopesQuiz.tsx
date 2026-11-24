"use client";

import ClientOnly from "@/components/ClientOnly";
import IsotopeNotation from "@/components/IsotopeNotation";
import QuizCard from "@/components/quiz/QuizCard";
import { NumberField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import {
  EMPTY_ISOTOPE_ANSWERS,
  correctIsotopeExercise,
  generateIsotopeExercise,
} from "@/lib/isotopes";

export default function IsotopesQuiz() {
  return (
    <ClientOnly>
      <Quiz />
    </ClientOnly>
  );
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "isotops",
    generate: generateIsotopeExercise,
    emptyAnswers: EMPTY_ISOTOPE_ANSWERS,
    correct: correctIsotopeExercise,
  });

  const { element, a, charge } = exercise;
  const filled = (v: string) => v.trim() !== "";

  if (exercise.kind === "particles") {
    const complete = filled(answers.protons) && filled(answers.neutrons) && filled(answers.electrons);
    return (
      <QuizCard
        prompt={
          <>
            <p className="text-sm text-zinc-500">{element.name}</p>
            <p className="mt-1 text-lg">
              Quants protons, neutrons i electrons té{" "}
              <span className="text-4xl">
                <IsotopeNotation symbol={element.symbol} a={a} z={element.z} charge={charge} />
              </span>
              ?
            </p>
          </>
        }
        correction={correction}
        complete={complete}
        onCheck={check}
        onNext={next}
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <NumberField label="Protons" value={answers.protons} onChange={(v) => setAnswer("protons", v)} disabled={checked} />
          <NumberField label="Neutrons" value={answers.neutrons} onChange={(v) => setAnswer("neutrons", v)} disabled={checked} />
          <NumberField label="Electrons" value={answers.electrons} onChange={(v) => setAnswer("electrons", v)} disabled={checked} />
        </div>
      </QuizCard>
    );
  }

  return (
    <QuizCard
      prompt={
        <p className="text-lg">
          Un àtom de <strong>{element.name.toLowerCase()}</strong> ({element.symbol}) té{" "}
          <strong>{element.z} protons</strong> i <strong>{a - element.z} neutrons</strong>. Quins són el seu
          nombre atòmic (Z) i el seu nombre màssic (A)?
        </p>
      }
      correction={correction}
      complete={filled(answers.z) && filled(answers.a)}
      onCheck={check}
      onNext={next}
    >
      <div className="grid grid-cols-2 gap-4">
        <NumberField label="Nombre atòmic (Z)" value={answers.z} onChange={(v) => setAnswer("z", v)} disabled={checked} />
        <NumberField label="Nombre màssic (A)" value={answers.a} onChange={(v) => setAnswer("a", v)} disabled={checked} />
      </div>
    </QuizCard>
  );
}

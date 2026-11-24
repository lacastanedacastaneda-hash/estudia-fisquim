"use client";

import ClientOnly from "@/components/ClientOnly";
import QuizCard from "@/components/quiz/QuizCard";
import { TextField } from "@/components/quiz/fields";
import { useQuiz } from "@/components/quiz/useQuiz";
import {
  EMPTY_CONFIG_ANSWERS,
  configText,
  correctConfigExercise,
  generateConfigExercise,
  parseConfiguration,
} from "@/lib/configuration";
import { ionSymbol } from "@/lib/notation";

export default function ConfigQuiz() {
  return (
    <ClientOnly>
      <Quiz />
    </ClientOnly>
  );
}

function Quiz() {
  const { exercise, answers, setAnswer, correction, checked, check, next } = useQuiz({
    moduleId: "configuracio",
    generate: generateConfigExercise,
    emptyAnswers: EMPTY_CONFIG_ANSWERS,
    correct: correctConfigExercise,
  });
  const { element, charge } = exercise;
  const preview = answers.config.trim() ? parseConfiguration(answers.config) : null;

  return (
    <QuizCard
      correction={correction}
      complete={answers.config.trim() !== "" && answers.shells.trim() !== ""}
      onCheck={check}
      onNext={next}
      prompt={
        <>
          <p className="text-sm text-zinc-500">
            {element.name} · Z = {element.z}
          </p>
          <p className="mt-1 text-lg">
            Escriu la configuració electrònica {charge === 0 ? "de l'àtom" : "de l'ió"}{" "}
            <span className="text-3xl font-bold">{ionSymbol(element.symbol, charge)}</span> per subnivells i per capes.
          </p>
        </>
      }
    >
      <div>
        <TextField
          label="Configuració per subnivells"
          placeholder="p. ex. 1s2 2s2 2p6"
          value={answers.config}
          onChange={(v) => setAnswer("config", v)}
          disabled={checked}
        />
        {!checked && preview && (
          <p className="mt-1 text-sm text-zinc-500" aria-live="polite">
            {preview.ok ? (
              <>
                Es llegeix: <span className="font-medium text-zinc-800 dark:text-zinc-200">{configText(preview.config)}</span>
              </>
            ) : (
              preview.error
            )}
          </p>
        )}
      </div>
      <TextField
        label="Electrons per capes"
        placeholder="p. ex. 2, 8, 1"
        value={answers.shells}
        onChange={(v) => setAnswer("shells", v)}
        disabled={checked}
      />
    </QuizCard>
  );
}

"use client";

import { useCallback, useState } from "react";
import type { Correction } from "@/lib/exercise";
import { useScore } from "@/lib/progress";

/** Estat comú d'un exercici: generar, respondre, corregir, comptar i passar al següent. */
export function useQuiz<E, A extends object>(options: {
  moduleId: string;
  generate: (previous?: E) => E;
  emptyAnswers: A;
  correct: (exercise: E, answers: A) => Correction;
}) {
  const { moduleId, generate, emptyAnswers, correct } = options;
  const { record } = useScore(moduleId);
  const [exercise, setExercise] = useState<E>(() => generate());
  const [answers, setAnswers] = useState<A>(emptyAnswers);
  const [correction, setCorrection] = useState<Correction | null>(null);

  const setAnswer = useCallback(<K extends keyof A>(key: K, value: A[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  }, []);

  function check() {
    const result = correct(exercise, answers);
    setCorrection(result);
    record(result.ok);
  }

  function next() {
    setExercise(generate(exercise));
    setAnswers(emptyAnswers);
    setCorrection(null);
  }

  return { exercise, answers, setAnswer, correction, checked: correction !== null, check, next };
}

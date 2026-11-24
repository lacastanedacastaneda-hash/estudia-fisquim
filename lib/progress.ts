"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Progrés per mòdul, guardat a localStorage. Si l'emmagatzematge no està
// disponible (navegació privada, bloquejat...), es manté només en memòria.

export type Score = { correct: number; total: number };

const KEY = "fisquim:progress:v1";
const EMPTY = "{}";
const listeners = new Set<() => void>();
let cache: string | undefined;

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getRaw(): string {
  if (cache === undefined) cache = readStorage() ?? EMPTY;
  return cache;
}

function setRaw(value: string) {
  cache = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Sense emmagatzematge: el progrés dura fins que es tanca la pàgina.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = e.newValue ?? EMPTY;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function parseAll(raw: string): Record<string, Score> {
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Record<string, Score>) : {};
  } catch {
    return {};
  }
}

function normalize(s: Partial<Score> | undefined): Score {
  const correct = Number(s?.correct);
  const total = Number(s?.total);
  return {
    correct: Number.isFinite(correct) && correct > 0 ? correct : 0,
    total: Number.isFinite(total) && total > 0 ? total : 0,
  };
}

export function useScore(moduleId: string) {
  const raw = useSyncExternalStore(subscribe, getRaw, () => EMPTY);
  const score = useMemo(() => normalize(parseAll(raw)[moduleId]), [raw, moduleId]);

  const record = useCallback(
    (ok: boolean) => {
      const all = parseAll(getRaw());
      const s = normalize(all[moduleId]);
      all[moduleId] = { correct: s.correct + (ok ? 1 : 0), total: s.total + 1 };
      setRaw(JSON.stringify(all));
    },
    [moduleId],
  );

  const reset = useCallback(() => {
    const all = parseAll(getRaw());
    delete all[moduleId];
    setRaw(JSON.stringify(all));
  }, [moduleId]);

  return { score, record, reset };
}

const noopSubscribe = () => () => {};

/** true només al navegador, després de la hidratació. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

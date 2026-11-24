"use client";

import type { ReactNode } from "react";
import { useIsClient } from "@/lib/progress";

/**
 * Renderitza els fills només al navegador. Els exercicis són aleatoris i,
 * si es generessin a l'HTML estàtic, no coincidirien en hidratar.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  if (!isClient) {
    return <div className="h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />;
  }
  return <>{children}</>;
}

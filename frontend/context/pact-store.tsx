/**
 * In-memory state for the pact flow.
 *
 * `draft` is what the create screens mutate; `activePact` is what Home reads.
 * Nothing here talks to Supabase yet — commitDraft() is the single place that
 * will call the create_solo_pact RPC once the backend is wired, and its shape
 * deliberately mirrors that function's parameters.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CHARITIES,
  DEFAULT_DRAFT,
  type Metric,
  type PactMode,
} from "../constants/pact-config";
import { pactName } from "../lib/pact-math";

export type PactDraft = {
  mode: PactMode;
  metric: Metric;
  goal: number;
  days: number;
  charityId: string;
  stake: number;
};

export type ActivePact = {
  id: string;
  name: string;
  mode: PactMode;
  metric: Metric;
  goal: number;
  days: number;
  charityName: string;
  stake: number;
  /** Progress so far, in the pact's own metric. */
  current: number;
  createdAt: number;
};

/**
 * Seeded so Home has something to show on first launch. Reproduces the
 * original mock: 37,000 of 50,000 steps = 74%, $13 of a $50 stake at risk.
 */
const SEED_PACT: ActivePact = {
  id: "seed",
  name: "50,000 steps this week",
  mode: "solo",
  metric: "steps",
  goal: 50000,
  days: 7,
  charityName: "Red Cross",
  stake: 50,
  current: 37000,
  createdAt: Date.now() - 4 * 86_400_000,
};

type PactContextValue = {
  draft: PactDraft;
  updateDraft: (patch: Partial<PactDraft>) => void;
  resetDraft: (mode?: PactMode) => void;
  activePact: ActivePact | null;
  commitDraft: () => ActivePact;
};

const PactContext = createContext<PactContextValue | null>(null);

export function PactProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PactDraft>(DEFAULT_DRAFT);
  const [activePact, setActivePact] = useState<ActivePact | null>(SEED_PACT);

  const updateDraft = useCallback((patch: Partial<PactDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetDraft = useCallback((mode: PactMode = "solo") => {
    setDraft({ ...DEFAULT_DRAFT, mode });
  }, []);

  const commitDraft = useCallback(() => {
    const charity = CHARITIES.find((c) => c.id === draft.charityId);
    const pact: ActivePact = {
      id: `pact-${Date.now()}`,
      name: pactName(draft.metric, draft.goal, draft.days),
      mode: draft.mode,
      metric: draft.metric,
      goal: draft.goal,
      days: draft.days,
      charityName: charity?.name ?? "charity",
      stake: draft.stake,
      current: 0,
      createdAt: Date.now(),
    };
    setActivePact(pact);
    return pact;
  }, [draft]);

  const value = useMemo(
    () => ({ draft, updateDraft, resetDraft, activePact, commitDraft }),
    [draft, updateDraft, resetDraft, activePact, commitDraft],
  );

  return <PactContext.Provider value={value}>{children}</PactContext.Provider>;
}

export function usePact() {
  const ctx = useContext(PactContext);
  if (!ctx) throw new Error("usePact must be used inside a PactProvider");
  return ctx;
}

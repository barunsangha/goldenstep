/**
 * Pact state, backed by Supabase.
 *
 * `draft` is local — the create screens mutate it freely and nothing is
 * written until commitDraft() calls create_solo_pact. `activePact` and
 * `today` come from the database via get_active_pact / get_pact_progress /
 * get_today_progress, and are refreshed on mount, whenever the app returns
 * to the foreground, and after any write.
 *
 * The ActivePact shape is kept identical to the old mock version on purpose,
 * so the Home components did not have to change.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import {
  DEFAULT_DRAFT,
  type Metric,
  type PactMode,
} from "../constants/pact-config";
import { pactName, goalToApiUnits } from "../lib/pact-math";
import { getCurrentUserId } from "../lib/session";
import {
  createSoloPact,
  getActivePact,
  getPactProgress,
  getTodayProgress,
  syncSteps,
  type TodayProgress,
} from "../lib/api";
import { getStepsToday, todayISO } from "../lib/health";

export type PactDraft = {
  mode: PactMode;
  metric: Metric;
  goal: number;
  days: number;
  charityId: string;
  stake: number;
};

export type ActivePact = {
  /** The gameweek_id — what every progress RPC needs. */
  id: string;
  leagueId: string;
  name: string;
  mode: PactMode;
  metric: Metric;
  /** In UI units: steps, or KILOMETRES for distance pacts. */
  goal: number;
  days: number;
  daysLeft: number;
  charityName: string;
  stake: number;
  current: number;
  atRisk: number;
  createdAt: number;
};

type PactContextValue = {
  draft: PactDraft;
  updateDraft: (patch: Partial<PactDraft>) => void;
  resetDraft: (mode?: PactMode) => void;
  activePact: ActivePact | null;
  today: TodayProgress | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  commitDraft: () => Promise<ActivePact | null>;
};

const PactContext = createContext<PactContextValue | null>(null);

/** metres -> km for display; steps pass through. */
const toUiUnits = (metric: Metric, v: number) =>
  metric === "steps" ? v : v / 1000;

export function PactProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PactDraft>(DEFAULT_DRAFT);
  const [activePact, setActivePact] = useState<ActivePact | null>(null);
  const [today, setToday] = useState<TodayProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateDraft = useCallback((patch: Partial<PactDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetDraft = useCallback((mode: PactMode = "solo") => {
    setDraft({ ...DEFAULT_DRAFT, mode });
  }, []);

  const refresh = useCallback(async () => {
    const userId = getCurrentUserId();
    setError(null);

    try {
      const pact = await getActivePact(userId);

      if (!pact) {
        setActivePact(null);
        setToday(await getTodayProgress(userId));
        return;
      }

      // Push today's steps in before reading progress back, so the
      // numbers on screen include the walk that just happened.
      const steps = await getStepsToday();
      try {
        await syncSteps({
          userId,
          gameweekId: pact.gameweekId,
          steps,
          date: todayISO(),
        });
      } catch {
        // A failed sync should not blank the screen — show stale data.
      }

      const progress = await getPactProgress(pact.gameweekId, userId);

      setActivePact({
        id: pact.gameweekId,
        leagueId: pact.leagueId,
        name: pact.name,
        mode: pact.pactType,
        metric: pact.metric,
        goal: toUiUnits(pact.metric, pact.goalAmount),
        days: pact.daysTotal,
        daysLeft: progress?.daysLeft ?? 0,
        charityName: pact.charityName ?? "charity",
        stake: pact.stakeAmount,
        current: toUiUnits(pact.metric, progress?.currentAmount ?? 0),
        atRisk: progress?.atRisk ?? pact.stakeAmount,
        createdAt: new Date(pact.startDate).getTime(),
      });

      setToday(await getTodayProgress(userId));
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  /** Initial load. */
  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Re-read whenever the app returns to the foreground.
   *
   * This is what makes a live demo work: walk away from the phone, come
   * back, and the step count and pact progress are current. Without it
   * the numbers are frozen at whatever they were on launch.
   */
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const commitDraft = useCallback(async (): Promise<ActivePact | null> => {
    const userId = getCurrentUserId();
    setError(null);

    try {
      await createSoloPact({
        userId,
        name: pactName(draft.metric, draft.goal, draft.days),
        metric: draft.metric,
        goalAmount: goalToApiUnits(draft.metric, draft.goal),
        stakeAmount: draft.stake,
        charityId: draft.charityId, // must be a real uuid
        days: draft.days,
      });

      await refresh();
      return activePact;
    } catch (e: any) {
      setError(String(e?.message ?? e));
      return null;
    }
  }, [draft, refresh, activePact]);

  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      resetDraft,
      activePact,
      today,
      loading,
      error,
      refresh,
      commitDraft,
    }),
    [
      draft,
      updateDraft,
      resetDraft,
      activePact,
      today,
      loading,
      error,
      refresh,
      commitDraft,
    ],
  );

  return <PactContext.Provider value={value}>{children}</PactContext.Provider>;
}

export function usePact() {
  const ctx = useContext(PactContext);
  if (!ctx) throw new Error("usePact must be used inside a PactProvider");
  return ctx;
}
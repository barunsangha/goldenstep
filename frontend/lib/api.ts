/**
 * Every Supabase call the app makes.
 *
 * RPCs return out_-prefixed columns because that is how the SQL `returns
 * table (...)` outputs are named. This module is the only place that
 * translation happens — no screen should ever see `out_charity_name`.
 */

import { supabase } from "./supabase";
import type { Metric } from "../constants/pact-config";

/* ---------------------------------------------------------------- charities */

export type Charity = {
  id: string;
  slug: string;
  name: string;
};

export async function getCharities(): Promise<Charity[]> {
  const { data, error } = await supabase.rpc("get_charities");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.out_id,
    slug: r.out_slug,
    name: r.out_name,
  }));
}

/* -------------------------------------------------------------- active pact */

export type ActivePactRow = {
  gameweekId: string;
  leagueId: string;
  name: string;
  pactType: "solo" | "group";
  metric: Metric;
  charityName: string | null;
  goalAmount: number;
  stakeAmount: number;
  startDate: string;
  endDate: string;
  daysTotal: number;
};

export async function getActivePact(
  userId: string,
): Promise<ActivePactRow | null> {
  const { data, error } = await supabase.rpc("get_active_pact", {
    p_user_id: userId,
  });
  if (error) throw error;

  const r = (data ?? [])[0];
  if (!r) return null;

  return {
    gameweekId: r.out_gameweek_id,
    leagueId: r.out_league_id,
    name: r.out_name,
    pactType: r.out_pact_type,
    metric: r.out_metric,
    charityName: r.out_charity_name,
    goalAmount: Number(r.out_goal_amount),
    stakeAmount: Number(r.out_stake_amount),
    startDate: r.out_start_date,
    endDate: r.out_end_date,
    daysTotal: r.out_days_total,
  };
}

/* ----------------------------------------------------------- pact progress */

export type PactProgress = {
  leagueId: string;
  name: string;
  pactType: "solo" | "group";
  metric: Metric;
  charityName: string | null;
  goalAmount: number;
  currentAmount: number;
  progressPct: number;
  daysLeft: number;
  atRisk: number;
  status: "active" | "closed";
};

export async function getPactProgress(
  gameweekId: string,
  userId: string,
): Promise<PactProgress | null> {
  const { data, error } = await supabase.rpc("get_pact_progress", {
    p_gameweek_id: gameweekId,
    p_user_id: userId,
  });
  if (error) throw error;

  const r = (data ?? [])[0];
  if (!r) return null;

  return {
    leagueId: r.out_league_id,
    name: r.out_name,
    pactType: r.out_pact_type,
    metric: r.out_metric,
    charityName: r.out_charity_name,
    goalAmount: Number(r.out_goal_amount),
    currentAmount: Number(r.out_current_amount),
    progressPct: Number(r.out_progress_pct ?? 0),
    daysLeft: r.out_days_left,
    atRisk: Number(r.out_at_risk),
    status: r.out_status,
  };
}

/* ---------------------------------------------------------- today progress */

export type TodayProgress = {
  steps: number;
  goal: number;
  remaining: number;
  progressPct: number;
  atRisk: number;
};

export async function getTodayProgress(
  userId: string,
): Promise<TodayProgress | null> {
  const { data, error } = await supabase.rpc("get_today_progress", {
    p_user_id: userId,
  });
  if (error) throw error;

  const r = (data ?? [])[0];
  if (!r) return null;

  return {
    steps: r.out_steps,
    goal: r.out_goal,
    remaining: r.out_remaining,
    progressPct: Number(r.out_progress_pct),
    atRisk: Number(r.out_at_risk),
  };
}

/* ------------------------------------------------------------- leaderboard */

export type LeaderboardRow = {
  userId: string;
  name: string;
  totalAmount: number;
  rank: number;
};

export async function getLeaderboard(
  gameweekId: string,
): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase.rpc("get_leaderboard", {
    p_gameweek_id: gameweekId,
  });
  if (error) throw error;

  return (data ?? []).map((r: any) => ({
    userId: r.user_id,
    name: r.name,
    totalAmount: Number(r.total_amount),
    rank: Number(r.league_rank),
  }));
}

/* --------------------------------------------------------- create/settle */

export type CreateSoloPactArgs = {
  userId: string;
  name: string;
  metric: Metric;
  /** Already in API units — steps, or METRES for distance. */
  goalAmount: number;
  stakeAmount: number;
  charityId: string;
  days: number;
};

export async function createSoloPact(a: CreateSoloPactArgs) {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + a.days - 1);

  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const { data, error } = await supabase.rpc("create_solo_pact", {
    p_user_id: a.userId,
    p_name: a.name,
    p_metric: a.metric,
    p_goal_amount: a.goalAmount,
    p_stake_amount: a.stakeAmount,
    p_charity_id: a.charityId,
    p_start_date: iso(start),
    p_end_date: iso(end),
  });
  if (error) throw error;

  const r = (data ?? [])[0];
  if (!r) throw new Error("create_solo_pact returned no row");

  return {
    leagueId: r.out_league_id,
    gameweekId: r.out_gameweek_id,
    name: r.out_name,
    metric: r.out_metric as Metric,
    goalAmount: Number(r.out_goal_amount),
    stakeAmount: Number(r.out_stake_amount),
    charityName: r.out_charity_name,
    endDate: r.out_end_date,
  };
}

/* -------------------------------------------------------------- step sync */

/**
 * Push a day's step count into `runs`.
 *
 * external_id makes this idempotent — migration 012 has a unique index on
 * (source, external_id), so re-syncing the same day updates rather than
 * duplicating. Without it a refresh would inflate the user's total.
 */
export async function syncSteps(args: {
  userId: string;
  gameweekId: string;
  steps: number;
  date: string;
}) {
  const externalId = `pedometer:${args.userId}:${args.date}`;

  const { error } = await supabase
    .from("runs")
    .upsert(
      {
        user_id: args.userId,
        gameweek_id: args.gameweekId,
        steps: args.steps,
        source: "health",
        activity_date: args.date,
        external_id: externalId,
      },
      { onConflict: "source,external_id" },
    );

  if (error) throw error;
}
/* ============================================================
   APPEND THESE to the bottom of frontend/lib/api.ts
   ============================================================ */

/* ----------------------------------------------------------------- profile */

export type Profile = {
  name: string;
  dailyStepGoal: number;
  avatar : string | null;
  pactsTotal: number;
  pactsCompleted: number;
  totalForfeited: number;
  totalKept: number;
  stepsAllTime: number;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.rpc("get_profile", {
    p_user_id: userId,
  });
  if (error) throw error;

  const r = (data ?? [])[0];
  if (!r) return null;

  return {
    name: r.out_name,
    avatar : r.out_avatar,
    dailyStepGoal: r.out_daily_step_goal,
    pactsTotal: Number(r.out_pacts_total),
    pactsCompleted: Number(r.out_pacts_completed),
    totalForfeited: Number(r.out_total_forfeited),
    totalKept: Number(r.out_total_kept),
    stepsAllTime: Number(r.out_steps_all_time),
  };
}

export type PactHistoryRow = {
  gameweekId: string;
  name: string;
  metric: Metric;
  charityName: string | null;
  goalAmount: number;
  finalAmount: number;
  progressPct: number;
  stakeAmount: number;
  forfeited: number;
  endDate: string;
  status: "active" | "closed";
};

export async function getPactHistory(
  userId: string,
): Promise<PactHistoryRow[]> {
  const { data, error } = await supabase.rpc("get_pact_history", {
    p_user_id: userId,
  });
  if (error) throw error;

  return (data ?? []).map((r: any) => ({
    gameweekId: r.out_gameweek_id,
    name: r.out_name,
    metric: r.out_metric,
    charityName: r.out_charity_name,
    goalAmount: Number(r.out_goal_amount ?? 0),
    finalAmount: Number(r.out_final_amount),
    progressPct: Number(r.out_progress_pct ?? 0),
    stakeAmount: Number(r.out_stake_amount),
    forfeited: Number(r.out_forfeited),
    endDate: r.out_end_date,
    status: r.out_status,
  }));
  
}

export async function setAvatar(userId: string, seed: string) {
  const { data, error } = await supabase.rpc("set_avatar", {
    p_user_id: userId,
    p_seed: seed,
  });
  if (error) throw error;
  return (data ?? [])[0]?.out_avatar ?? null;
}
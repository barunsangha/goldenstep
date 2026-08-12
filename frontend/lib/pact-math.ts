/**
 * Every derived number the pact flow shows.
 *
 * Unit note: distance pacts are entered and displayed in kilometres, while
 * the backend's metric_type enum calls the column `distance_m`. Conversion
 * to metres happens at the API boundary (see goalToApiUnits), not in the UI.
 */

import { DURATIONS, type Metric } from "../constants/pact-config";
import { num } from "./format";

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

/** "50,000 steps" / "100 km" */
export function goalLabel(metric: Metric, goal: number) {
  return metric === "steps" ? `${num(goal)} steps` : `${goal} km`;
}

/** "1 week" — falls back to a raw day count for any custom value. */
export function durationLabel(days: number) {
  return DURATIONS.find((d) => d.days === days)?.label ?? `${days} days`;
}

/** "7,150 steps a day" / "14.3 km a day" */
export function perDayLabel(metric: Metric, goal: number, days: number) {
  const perDay = goal / days;
  return metric === "steps"
    ? `${num(Math.round(perDay / 50) * 50)} steps a day`
    : `${perDay.toFixed(1)} km a day`;
}

/** The auto-generated pact title, e.g. "50,000 steps this week". */
export function pactName(metric: Metric, goal: number, days: number) {
  const goalPart = goalLabel(metric, goal);
  if (days === 7) return `${goalPart} this week`;
  if (days === 30) return `${goalPart} this month`;
  return `${goalPart} over ${durationLabel(days)}`;
}

/** "37,000 of 50,000" / "75.0 of 100 km" */
export function progressLabel(metric: Metric, current: number, goal: number) {
  return metric === "steps"
    ? `${num(current)} of ${num(goal)}`
    : `${current.toFixed(1)} of ${goal} km`;
}

/** Completion as a 0–100 percentage, clamped. */
export function pctComplete(current: number, goal: number) {
  if (goal <= 0) return 0;
  return clamp01(current / goal) * 100;
}

/**
 * The core money rule: you are charged the same share of your stake that you
 * missed. Finish the goal and nothing moves.
 */
export function amountAtRisk(stake: number, current: number, goal: number) {
  if (goal <= 0) return 0;
  return stake * (1 - clamp01(current / goal));
}

/** The complement of amountAtRisk — what you keep if it ended right now. */
export function amountKept(stake: number, current: number, goal: number) {
  return stake - amountAtRisk(stake, current, goal);
}

/** Whole days remaining, never negative. */
export function daysRemaining(createdAt: number, days: number, now = Date.now()) {
  const elapsed = Math.floor((now - createdAt) / 86_400_000);
  return Math.max(days - elapsed, 0);
}

export function daysLeftLabel(createdAt: number, days: number) {
  const left = daysRemaining(createdAt, days);
  if (left === 0) return "Ends today";
  return `${left} ${left === 1 ? "day" : "days"} left`;
}

/**
 * Convert a UI goal into the units the backend stores.
 * Steps stay as-is; kilometres become metres for `distance_m`.
 */
export function goalToApiUnits(metric: Metric, goal: number) {
  return metric === "steps" ? goal : goal * 1000;
}

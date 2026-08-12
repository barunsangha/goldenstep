/**
 * Step data from the device.
 *
 * Uses expo-sensors Pedometer, which is bundled in Expo Go — no development
 * build required. On iOS it wraps Core Motion, which keeps roughly the last
 * seven days of history, so getStepsBetween() works for weekly pacts.
 *
 * Known limits, all worth saying out loud before demo day:
 *   • History is ~7 days. The 30- and 90-day options in DURATIONS will only
 *     ever see the last week of data.
 *   • It counts steps recorded by the PHONE only — not an Apple Watch or a
 *     Garmin. Someone wearing a watch will look less active than they are.
 *   • Historical queries are iOS-only. Android needs Health Connect, which
 *     is a separate integration.
 *   • No background updates. Steps refresh when the app is foregrounded.
 *
 * If the pedometer is unavailable (web, simulator, permission denied) these
 * fall back to a fixed number so the UI still has something to render.
 */

import { Pedometer } from "expo-sensors";

const FALLBACK_STEPS = 8412;

export async function isPedometerAvailable(): Promise<boolean> {
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestPedometerPermission(): Promise<boolean> {
  try {
    const { granted } = await Pedometer.requestPermissionsAsync();
    return granted;
  } catch {
    return false;
  }
}

/** Steps between two dates. Returns null if the pedometer can't answer. */
export async function getStepsBetween(
  start: Date,
  end: Date,
): Promise<number | null> {
  try {
    if (!(await Pedometer.isAvailableAsync())) return null;
    const { steps } = await Pedometer.getStepCountAsync(start, end);
    return steps;
  } catch {
    return null;
  }
}

/** Steps since midnight local time. */
export async function getStepsToday(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const steps = await getStepsBetween(start, new Date());
  return steps ?? FALLBACK_STEPS;
}

/** Today's date as YYYY-MM-DD, local — matches runs.activity_date. */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Live updates while the app is foregrounded. Returns an unsubscribe fn. */
export function watchSteps(onChange: (steps: number) => void): () => void {
  try {
    const sub = Pedometer.watchStepCount((r) => onChange(r.steps));
    return () => sub.remove();
  } catch {
    return () => {};
  }
}
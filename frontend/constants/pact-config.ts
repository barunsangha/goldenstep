/**
 * Static options for the pact creation flow.
 *
 * Charity names deliberately match the rows seeded by
 * backend/migrations/charities_enum.sql, so swapping this list for a
 * Supabase query later is a drop-in change.
 */

export type Metric = "steps" | "distance_m";

export type PactMode = "solo" | "group" | "head_to_head";

export const MODES: {
  id: PactMode;
  title: string;
  description: string;
  enabled: boolean;
}[] = [
  {
    id: "solo",
    title: "Beat yourself",
    description:
      "Stake against your own goal. Whatever you miss goes to a charity.",
    enabled: true,
  },
  {
    id: "group",
    title: "Beat your friends",
    description: "Everyone pays into one pot. You decide how it gets split.",
    enabled: false,
  },
  {
    id: "head_to_head",
    title: "Pay your friend",
    description:
      "Same goal, no pot. Whatever you fall short by, you pay them.",
    enabled: false,
  },
];

export const CHARITIES: { id: string; name: string; meta: string }[] = [
  { id: "red-cross", name: "Red Cross", meta: "Emergency relief" },
  { id: "unicef", name: "UNICEF", meta: "Children's aid worldwide" },
  { id: "beyond-blue", name: "Beyond Blue", meta: "Mental health support" },
  { id: "wwf", name: "WWF", meta: "Habitat and wildlife" },
];

export const DURATIONS: { days: number; label: string }[] = [
  { days: 7, label: "1 week" },
  { days: 14, label: "2 weeks" },
  { days: 30, label: "1 month" },
  { days: 90, label: "3 months" },
];

export const GOAL_PRESETS: Record<Metric, number[]> = {
  steps: [35000, 50000, 70000, 100000, 150000],
  distance_m: [25, 50, 100, 150, 200],
};

export const GOAL_RANGE: Record<
  Metric,
  { min: number; max: number; step: number }
> = {
  steps: { min: 10000, max: 250000, step: 2500 },
  distance_m: { min: 5, max: 250, step: 5 },
};

export const STAKE_PRESETS = [20, 50, 100, 200];

export const STAKE_RANGE = { min: 5, max: 300, step: 5 };

/** Defaults a fresh draft starts from. */
export const DEFAULT_DRAFT = {
  mode: "solo" as PactMode,
  metric: "steps" as Metric,
  goal: 50000,
  days: 7,
  charityId: "red-cross",
  stake: 50,
};

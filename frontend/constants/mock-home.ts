/**
 * Remaining stand-in data for Home.
 *
 * The solo pact that used to live here now comes from the pact store, so
 * creating one updates the home screen. What is left is the personal daily
 * target and the group pact, which has no creation flow yet.
 */

/** Your own daily step target, independent of any pact. */
export const DAILY_STEP_GOAL = 12500;

export const groupPact = {
  title: "July 100 km club",
  subtitle: "2nd of 5 · 11 days left",
  distance: "75 km",
};

/**
 * The seam where Apple Health plugs in.
 *
 * HealthKit cannot run in Expo Go — it needs a development build. Until that
 * exists, this module returns a fixed day so the rest of the app can be built
 * and demoed. Swapping in the real implementation should not require touching
 * any screen: keep this signature.
 */

const MOCK_STEPS_TODAY = 8412;

const MOCK_DISTANCE_KM_TODAY = 6.71;

/** Steps recorded so far today. */
export function getStepsToday() {
  return MOCK_STEPS_TODAY;
}

/** Distance in kilometres recorded so far today. */
export function getDistanceKmToday() {
  return MOCK_DISTANCE_KM_TODAY;
}

/**
 * Progress toward a pact in that pact's own metric. Real implementation would
 * sum samples between the pact's start and end dates.
 */
export function getProgressToday(metric: "steps" | "distance_m") {
  return metric === "steps" ? getStepsToday() : getDistanceKmToday();
}

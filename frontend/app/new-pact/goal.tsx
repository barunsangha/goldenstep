import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FlowScreen from "../components/ui/flow-screen";
import BigValue from "../components/ui/big-value";
import ValueSlider from "../components/ui/value-slider";
import Chip from "../components/ui/chip";
import Eyebrow from "../components/ui/eyebrow";
import { H2, Lede, Note } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import {
  DURATIONS,
  GOAL_PRESETS,
  GOAL_RANGE,
  type Metric,
} from "../../constants/pact-config";
import { colors } from "../../constants/theme";
import { num } from "../../lib/format";
import { durationLabel, goalLabel, perDayLabel } from "../../lib/pact-math";

const METRICS: { id: Metric; label: string; defaultGoal: number }[] = [
  { id: "steps", label: "Steps", defaultGoal: 50000 },
  { id: "distance_m", label: "Distance", defaultGoal: 100 },
];

/**
 * Goal and duration share a screen: the per-day figure only means anything
 * once both are set, so splitting them forced the goal step to reference a
 * duration the user had not chosen yet.
 */
export default function GoalScreen() {
  const router = useRouter();
  const { draft, updateDraft } = usePact();
  const { metric, goal, days } = draft;

  const isSteps = metric === "steps";
  const range = GOAL_RANGE[metric];

  return (
    <FlowScreen
      title="Beat yourself"
      step={1}
      ctaLabel="Continue"
      onCta={() => router.push("/new-pact/charity")}
    >
      <H2>Set the goal</H2>
      <Lede>Choose what you&apos;re chasing, and how long you have to do it.</Lede>

      <View style={styles.segment}>
        {METRICS.map((m) => {
          const active = metric === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() =>
                updateDraft({ metric: m.id, goal: m.defaultGoal })
              }
              style={[styles.segmentItem, active && styles.segmentItemActive]}
            >
              <Text
                style={[styles.segmentText, active && styles.segmentTextActive]}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <BigValue
        value={isSteps ? num(goal) : String(goal)}
        caption={
          isSteps ? "steps for the whole pact" : "kilometres for the whole pact"
        }
      />

      <ValueSlider
        value={goal}
        min={range.min}
        max={range.max}
        step={range.step}
        onChange={(value) => updateDraft({ goal: value })}
        minLabel={isSteps ? num(range.min) : `${range.min} km`}
        maxLabel={isSteps ? num(range.max) : `${range.max} km`}
      />

      <View style={styles.chips}>
        {GOAL_PRESETS[metric].map((preset) => (
          <Chip
            key={preset}
            label={isSteps ? num(preset) : `${preset} km`}
            selected={preset === goal}
            onPress={() => updateDraft({ goal: preset })}
          />
        ))}
      </View>

      <Eyebrow top={38}>How long</Eyebrow>
      <View style={styles.chips}>
        {DURATIONS.map((d) => (
          <Chip
            key={d.days}
            label={d.label}
            selected={d.days === days}
            onPress={() => updateDraft({ days: d.days })}
          />
        ))}
      </View>

      <Note style={styles.summary}>
        {goalLabel(metric, goal)} over {durationLabel(days)} is{" "}
        {perDayLabel(metric, goal, days)}.
      </Note>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 3,
    marginBottom: 36,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
    alignItems: "center",
  },
  segmentItemActive: {
    backgroundColor: colors.segmentActive,
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: "400",
    color: colors.gray,
  },
  segmentTextActive: {
    fontWeight: "500",
    color: colors.white,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  summary: {
    marginTop: 26,
  },
});

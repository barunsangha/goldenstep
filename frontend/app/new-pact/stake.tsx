import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FlowScreen from "../components/ui/flow-screen";
import BigValue from "../components/ui/big-value";
import ValueSlider from "../components/ui/value-slider";
import Chip from "../components/ui/chip";
import Eyebrow from "../components/ui/eyebrow";
import ProgressBar from "../components/ui/progress-bar";
import { H2, Lede, Note } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import {
  CHARITIES,
  STAKE_PRESETS,
  STAKE_RANGE,
} from "../../constants/pact-config";
import { colors } from "../../constants/theme";
import { money } from "../../lib/format";

export default function StakeScreen() {
  const router = useRouter();
  const { draft, updateDraft } = usePact();
  const { stake, charityId } = draft;

  /** Local to this screen: a what-if dial, not part of the pact itself. */
  const [finishPct, setFinishPct] = useState(74);

  const charityName =
    CHARITIES.find((c) => c.id === charityId)?.name ?? "charity";
  const lost = (stake * (100 - finishPct)) / 100;
  const kept = stake - lost;

  return (
    <FlowScreen
      title="Beat yourself"
      step={3}
      ctaLabel="Review pact"
      onCta={() => router.push("/new-pact/review")}
    >
      <H2>Set your stake</H2>
      <Lede>Held on your card, charged only for what you miss.</Lede>

      <BigValue value={`$${stake}`} caption="held for the whole pact" />

      <ValueSlider
        value={stake}
        min={STAKE_RANGE.min}
        max={STAKE_RANGE.max}
        step={STAKE_RANGE.step}
        onChange={(value) => updateDraft({ stake: value })}
        minLabel={`$${STAKE_RANGE.min}`}
        maxLabel={`$${STAKE_RANGE.max}`}
      />

      <View style={styles.chips}>
        {STAKE_PRESETS.map((preset) => (
          <Chip
            key={preset}
            label={`$${preset}`}
            selected={preset === stake}
            onPress={() => updateDraft({ stake: preset })}
          />
        ))}
      </View>

      <Eyebrow top={40}>{`If you finish at ${finishPct}%`}</Eyebrow>
      <ProgressBar progress={finishPct} height={6} />

      <View style={styles.split}>
        <View>
          <Text style={styles.splitLabel}>You keep</Text>
          <Text style={[styles.splitValue, styles.kept]}>{money(kept)}</Text>
        </View>
        <View style={styles.splitRight}>
          <Text style={styles.splitLabel}>{charityName} gets</Text>
          <Text style={[styles.splitValue, styles.lost]}>{money(lost)}</Text>
        </View>
      </View>

      <View style={styles.whatIf}>
        <Note>Drag to see other finishes</Note>
        <ValueSlider
          value={finishPct}
          min={0}
          max={100}
          step={1}
          onChange={setFinishPct}
          minLabel="Missed it entirely"
          maxLabel={`${finishPct}% of goal`}
        />
      </View>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  split: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  splitRight: {
    alignItems: "flex-end",
  },
  splitLabel: {
    fontSize: 12,
    color: colors.dim,
  },
  splitValue: {
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: -0.6,
    marginTop: 5,
    fontVariant: ["tabular-nums"],
  },
  kept: {
    color: colors.green,
  },
  lost: {
    color: colors.orange,
  },
  whatIf: {
    marginTop: 30,
  },
});

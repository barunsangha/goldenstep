import { View, Text, StyleSheet } from "react-native";
import Eyebrow from "../ui/eyebrow";
import ProgressBar from "../ui/progress-bar";
import { todayData } from "../../../constants/mock-home";
import { colors } from "../../../constants/theme";
import { money, num } from "../../../lib/format";

export default function TodaySection() {
  const { steps, remaining, atRisk, progress } = todayData;

  return (
    <View style={styles.container}>
      <Eyebrow top={0}>Today</Eyebrow>
      <View style={styles.countRow}>
        <Text style={styles.count}>{num(steps)}</Text>
        <Text style={styles.unit}>steps</Text>
      </View>
      <ProgressBar progress={progress} top={20} />
      <View style={styles.footer}>
        <Text style={styles.remaining}>{num(remaining)} to go today</Text>
        <Text style={styles.atRisk}>{money(atRisk)} at risk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingBottom: 34,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 9,
    marginTop: 14,
  },
  count: {
    fontSize: 52,
    fontWeight: "200",
    letterSpacing: -1.5,
    lineHeight: 52,
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  remaining: {
    fontSize: 12.5,
    color: colors.gray,
  },
  atRisk: {
    fontSize: 12.5,
    color: colors.orange,
    fontWeight: "500",
  },
});

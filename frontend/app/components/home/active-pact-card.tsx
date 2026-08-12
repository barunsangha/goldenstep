import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "../ui/progress-bar";
import { usePact } from "../../../context/pact-store";
import { colors } from "../../../constants/theme";
import { money } from "../../../lib/format";
import { pctComplete, progressLabel } from "../../../lib/pact-math";

export default function ActivePactCard() {
  const router = useRouter();
  const { activePact, loading } = usePact();

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyBody}>Loading…</Text>
      </View>
    );
  }

  if (!activePact) {
    return (
      <Pressable
        onPress={() => router.push("/pact")}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <Text style={styles.emptyTitle}>No active pact</Text>
        <Text style={styles.emptyBody}>
          Put something on the line and your progress shows up here.
        </Text>
      </Pressable>
    );
  }

  const { name, charityName, metric, current, goal, daysLeft, atRisk } =
    activePact;

  return (
    <Pressable
      onPress={() => router.push("/pact")}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Solo · {charityName}</Text>
        <Text style={styles.daysLeft}>
          {daysLeft === 0 ? "Ends today" : `${daysLeft} days left`}
        </Text>
      </View>
      <Text style={styles.title}>{name}</Text>
      <ProgressBar progress={pctComplete(current, goal)} top={18} />
      <View style={styles.footer}>
        <Text style={styles.progress}>
          {progressLabel(metric, current, goal)}
        </Text>
        <Text style={styles.atRisk}>{money(atRisk)} at risk</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  pressed: { opacity: 0.92 },
  header: { flexDirection: "row", alignItems: "baseline" },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.dim,
  },
  daysLeft: { marginLeft: "auto", fontSize: 12, color: colors.dim },
  title: {
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: -0.4,
    color: colors.white,
    marginTop: 13,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  progress: { fontSize: 12.5, color: colors.gray },
  atRisk: { fontSize: 12.5, color: colors.orange, fontWeight: "500" },
  emptyTitle: { fontSize: 15.5, fontWeight: "400", color: colors.white },
  emptyBody: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 20,
    marginTop: 7,
  },
});
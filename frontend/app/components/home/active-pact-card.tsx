import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "../ui/progress-bar";
import { soloPact } from "../../../constants/mock-home";
import { colors } from "../../../constants/theme";
import { money, num } from "../../../lib/format";

export default function ActivePactCard() {
  const router = useRouter();
  const { label, daysLeft, title, current, goal, progress, atRisk } = soloPact;

  return (
    <Pressable
      onPress={() => router.push("/pact")}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.daysLeft}>{daysLeft}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <ProgressBar progress={progress} top={18} />
      <View style={styles.footer}>
        <Text style={styles.progress}>
          {num(current)} of {num(goal)}
        </Text>
        <Text style={styles.atRisk}>{money(atRisk)} at risk</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.dim,
  },
  daysLeft: {
    marginLeft: "auto",
    fontSize: 12,
    color: colors.dim,
  },
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
  progress: {
    fontSize: 12.5,
    color: colors.gray,
  },
  atRisk: {
    fontSize: 12.5,
    color: colors.orange,
    fontWeight: "500",
  },
});

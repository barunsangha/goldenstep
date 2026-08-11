import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Chevron from "../ui/chevron";
import { groupPact } from "../../../constants/mock-home";
import { colors } from "../../../constants/theme";

export default function GroupPactRow() {
  const router = useRouter();
  const { title, subtitle, distance } = groupPact;

  return (
    <Pressable
      onPress={() => router.push("/pact")}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.distance}>{distance}</Text>
      <Chevron />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 20,
    paddingHorizontal: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "400",
    letterSpacing: -0.18,
    color: colors.white,
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: "400",
    color: colors.gray,
    marginTop: 4,
  },
  distance: {
    fontSize: 14,
    color: colors.gray,
    fontVariant: ["tabular-nums"],
  },
});

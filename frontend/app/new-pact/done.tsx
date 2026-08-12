import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import CtaButton from "../components/ui/cta-button";
import { usePact } from "../../context/pact-store";
import { colors, spacing } from "../../constants/theme";
import { durationLabel, goalLabel } from "../../lib/pact-math";

export default function DoneScreen() {
  const router = useRouter();
  const { activePact } = usePact();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.iconRing}>
          <Ionicons name="checkmark" size={26} color={colors.green} />
        </View>

        <Text style={styles.title}>You&apos;re in</Text>

        {activePact ? (
          <Text style={styles.lede}>
            Your {durationLabel(activePact.days)} pact is live. ${activePact.stake}{" "}
            is held — finish {goalLabel(activePact.metric, activePact.goal)} and
            you keep all of it.
          </Text>
        ) : null}

        <View style={styles.actions}>
          <CtaButton onPress={() => router.replace("/")}>See my pact</CtaButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
    paddingBottom: 60,
  },
  iconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(0,224,122,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 27,
    fontWeight: "400",
    letterSpacing: -0.6,
    color: colors.white,
    marginBottom: 12,
  },
  lede: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 280,
  },
  actions: {
    alignSelf: "stretch",
    marginTop: 44,
  },
});

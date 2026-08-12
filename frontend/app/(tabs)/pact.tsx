import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import OptionCard from "../components/ui/option-card";
import { Note } from "../components/ui/typography";
import { usePact } from "../../context/pact-store";
import { MODES } from "../../constants/pact-config";
import { colors, spacing } from "../../constants/theme";

export default function PactScreen() {
  const router = useRouter();
  const { resetDraft } = usePact();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.headline}>Put something{"\n"}on the line</Text>
          <Text style={styles.lede}>
            Money only leaves your account if you fall short. Choose who it goes
            to.
          </Text>
        </View>

        <View style={styles.options}>
          {MODES.map((mode) => (
            <OptionCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              chevron={mode.enabled}
              disabled={!mode.enabled}
              badge={mode.enabled ? undefined : "Soon"}
              onPress={() => {
                resetDraft(mode.id);
                router.push("/new-pact/goal");
              }}
            />
          ))}
        </View>

        <Note style={styles.footnote}>
          Steps and distance come from Apple Health.
        </Note>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 40,
  },
  intro: {
    paddingTop: 44,
  },
  headline: {
    fontSize: 31,
    fontWeight: "200",
    letterSpacing: -0.62,
    lineHeight: 40,
    color: colors.white,
  },
  lede: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
    lineHeight: 22,
    marginTop: 18,
    maxWidth: 288,
  },
  options: {
    marginTop: 46,
  },
  footnote: {
    marginTop: 34,
    maxWidth: 300,
  },
});

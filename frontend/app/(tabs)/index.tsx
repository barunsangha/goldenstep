import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import HomeNav from "../components/home/home-nav";
import TodaySection from "../components/home/today-section";
import ActivePactCard from "../components/home/active-pact-card";
import GroupPactRow from "../components/home/group-pact-row";
import Eyebrow from "../components/ui/eyebrow";
import CtaButton from "../components/ui/cta-button";
import CtaWrap from "../components/ui/cta-wrap";
import { colors, spacing } from "../../constants/theme";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeNav />
          <View style={styles.body}>
            <TodaySection />
            <Eyebrow top={0}>Active pact</Eyebrow>
            <ActivePactCard />
            <GroupPactRow />
          </View>
        </ScrollView>

        <CtaWrap>
          <CtaButton onPress={() => router.push("/pact")}>
            Start a pact
          </CtaButton>
        </CtaWrap>
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
    backgroundColor: colors.black,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  body: {
    paddingHorizontal: spacing.screen,
  },
});

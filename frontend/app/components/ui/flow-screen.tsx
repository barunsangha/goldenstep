import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import ScreenNav from "./screen-nav";
import StepDots from "./step-dots";
import CtaButton from "./cta-button";
import CtaWrap from "./cta-wrap";
import { Fine } from "./typography";
import { colors, spacing } from "../../../constants/theme";

type FlowScreenProps = {
  title?: string;
  /** 1-based step for the progress dots. Omit to hide them. */
  step?: number;
  children: ReactNode;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  fine?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onBack?: (() => void) | null;
};

/**
 * Shared chrome for every create-pact step: safe area, scrolling body,
 * nav, step dots, and the sticky CTA footer. Screens supply only content.
 */
export default function FlowScreen({
  title,
  step,
  children,
  ctaLabel,
  onCta,
  ctaDisabled = false,
  fine,
  secondaryLabel,
  onSecondary,
  onBack,
}: FlowScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 150 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ScreenNav title={title} onBack={onBack} />
          {step ? <StepDots step={step} /> : null}
          <View style={styles.body}>{children}</View>
        </ScrollView>

        <CtaWrap extraBottom={insets.bottom}>
          <CtaButton onPress={onCta} disabled={ctaDisabled}>
            {ctaLabel}
          </CtaButton>
          {secondaryLabel ? (
            <CtaButton variant="ghost" onPress={onSecondary}>
              {secondaryLabel}
            </CtaButton>
          ) : null}
          {fine ? <Fine>{fine}</Fine> : null}
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
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: spacing.screen,
  },
});

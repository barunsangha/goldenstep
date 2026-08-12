import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { colors, spacing } from "../../../constants/theme";

type CtaWrapProps = {
  children: ReactNode;
  /** Extra bottom padding, e.g. the safe-area inset on a full-screen route. */
  extraBottom?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * The sticky footer that fades the scrolling content out behind a CTA.
 * Absolutely positioned, so it must sit inside a flex-1 parent.
 */
export default function CtaWrap({
  children,
  extraBottom = 0,
  style,
}: CtaWrapProps) {
  return (
    <LinearGradient
      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.64)", colors.black]}
      locations={[0, 0.36, 1]}
      style={[styles.wrap, { paddingBottom: 24 + extraBottom }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    bottom: 0,
    paddingTop: 38,
  },
});

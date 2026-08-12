import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import type { ReactNode } from "react";
import { colors } from "../../../constants/theme";

type TextProps = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

/** Screen title. */
export function H2({ children, style }: TextProps) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}

/** The sentence under a screen title that explains the rule. */
export function Lede({
  children,
  bottom = 36,
  style,
}: TextProps & { bottom?: number }) {
  return (
    <Text style={[styles.lede, { marginBottom: bottom }, style]}>{children}</Text>
  );
}

/** Supporting body copy. */
export function Note({ children, style }: TextProps) {
  return <Text style={[styles.note, style]}>{children}</Text>;
}

/** Centred fine print under a CTA. */
export function Fine({ children, style }: TextProps) {
  return <Text style={[styles.fine, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 21,
    fontWeight: "400",
    letterSpacing: -0.55,
    lineHeight: 25,
    color: colors.white,
    marginBottom: 10,
  },
  lede: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
    lineHeight: 21,
  },
  note: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray,
    lineHeight: 21,
  },
  fine: {
    fontSize: 11.5,
    fontWeight: "400",
    color: colors.dim,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 17,
  },
});

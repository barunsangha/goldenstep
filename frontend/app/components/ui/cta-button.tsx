import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../../constants/theme";

type CtaButtonProps = {
  children: string;
  onPress?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function CtaButton({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: CtaButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.ghostText]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
    marginTop: 7,
  },
  primary: {
    backgroundColor: colors.green,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.35,
  },
  text: {
    fontSize: 15.5,
    letterSpacing: -0.15,
  },
  primaryText: {
    color: colors.greenDark,
    fontWeight: "500",
  },
  ghostText: {
    color: colors.gray,
    fontWeight: "400",
  },
});

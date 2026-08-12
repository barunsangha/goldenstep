import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";
import { colors } from "../../../constants/theme";

type ScreenNavProps = {
  title?: string;
  /** Defaults to router.back(). Pass null to hide the back control. */
  onBack?: (() => void) | null;
  right?: ReactNode;
};

export default function ScreenNav({ title = "", onBack, right }: ScreenNavProps) {
  const router = useRouter();
  const showBack = onBack !== null;

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={26} color={colors.gray} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingLeft: 8,
    paddingRight: 16,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 36,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.14,
    color: colors.gray,
  },
  right: {
    minWidth: 36,
    alignItems: "flex-end",
  },
});

import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../constants/theme";

type OptionCardProps = {
  title: string;
  description?: string;
  selected?: boolean;
  /** Show a chevron instead of a tick — for rows that navigate onward. */
  chevron?: boolean;
  disabled?: boolean;
  /** Replaces the tick/chevron when the row is unavailable. */
  badge?: string;
  onPress?: () => void;
};

export default function OptionCard({
  title,
  description,
  selected = false,
  chevron = false,
  disabled = false,
  badge,
  onPress,
}: OptionCardProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            selected && styles.titleSelected,
            disabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
        {description ? (
          <Text style={[styles.description, disabled && styles.textDisabled]}>
            {description}
          </Text>
        ) : null}
      </View>

      {badge ? (
        <Text style={styles.badge}>{badge}</Text>
      ) : chevron ? (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.dim}
          style={description ? styles.chevronOffset : undefined}
        />
      ) : (
        <View style={[styles.tick, selected && styles.tickOn]}>
          {selected ? (
            <Ionicons name="checkmark" size={13} color={colors.greenDark} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 19,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.green,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15.5,
    fontWeight: "400",
    letterSpacing: -0.19,
    color: colors.white,
  },
  titleSelected: {
    color: colors.green,
  },
  description: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray,
    marginTop: 7,
    lineHeight: 20,
  },
  textDisabled: {
    color: colors.dim,
  },
  badge: {
    fontSize: 12,
    color: colors.dim,
  },
  chevronOffset: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  tick: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tickBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  tickOn: {
    borderWidth: 0,
    backgroundColor: colors.green,
  },
});

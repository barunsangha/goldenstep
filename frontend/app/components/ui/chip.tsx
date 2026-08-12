import { Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../../../constants/theme";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export default function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    borderColor: colors.green,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray,
  },
  labelSelected: {
    color: colors.green,
  },
});

import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../constants/theme";

type DetailRowProps = {
  label: string;
  value: string;
  /** Drops the hairline — use on the final row of a group. */
  last?: boolean;
};

export default function DetailRow({ label, value, last = false }: DetailRowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: colors.gray,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    textAlign: "right",
  },
});

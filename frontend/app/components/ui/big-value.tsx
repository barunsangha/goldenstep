import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../constants/theme";

type BigValueProps = {
  value: string;
  caption: string;
};

/** The centred hero figure used on the goal and stake screens. */
export default function BigValue({ value, caption }: BigValueProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  value: {
    fontSize: 54,
    fontWeight: "200",
    letterSpacing: -1.4,
    lineHeight: 58,
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray,
    marginTop: 12,
    textAlign: "center",
  },
});

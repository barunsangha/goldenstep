import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import { colors } from "../../../constants/theme";

type EyebrowProps = {
  children: string;
  top?: number;
  style?: StyleProp<TextStyle>;
};

export default function Eyebrow({ children, top = 40, style }: EyebrowProps) {
  return (
    <Text style={[styles.eyebrow, { marginTop: top }, style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.dim,
    marginBottom: 16,
  },
});

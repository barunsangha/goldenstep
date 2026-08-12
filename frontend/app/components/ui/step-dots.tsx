import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../../../constants/theme";

type StepDotsProps = {
  /** 1-based index of the current step. */
  step: number;
  of?: number;
};

export default function StepDots({ step, of = 4 }: StepDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: of }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < step ? styles.dotOn : styles.dotOff]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    paddingTop: 6,
    paddingBottom: 30,
    paddingHorizontal: spacing.screen,
  },
  dot: {
    height: 2,
    flex: 1,
    borderRadius: 2,
  },
  dotOn: {
    backgroundColor: colors.stepOn,
  },
  dotOff: {
    backgroundColor: colors.stepOff,
  },
});

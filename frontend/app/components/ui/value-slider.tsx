import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../../../constants/theme";

type ValueSliderProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
};

export default function ValueSlider({
  value,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: ValueSliderProps) {
  return (
    <View>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor={colors.white}
        maximumTrackTintColor={colors.track}
        thumbTintColor={colors.white}
      />
      {minLabel || maxLabel ? (
        <View style={styles.labels}>
          <Text style={styles.label}>{minLabel}</Text>
          <Text style={styles.label}>{maxLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 11.5,
    color: colors.dim,
  },
});

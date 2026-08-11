import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../../../constants/theme";

type ProgressBarProps = {
  style?: StyleProp<ViewStyle>;
  progress: number;
  height?: number;
  dim?: boolean;
  top?: number;
};

export default function ProgressBar({
  style,
  progress,
  height = 3,
  dim = false,
  top = 0,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clampedProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress, animatedValue]);

  const widthInterpolation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[{ marginTop: top }, style]}>
      <View
        style={[
          styles.track,
          { height, borderRadius: height },
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              height,
              borderRadius: height,
              backgroundColor: dim ? colors.progressDim : colors.green,
              width: widthInterpolation,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: colors.track,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
  },
});

import { Text, View, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export default function RunScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Run screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
  },
});

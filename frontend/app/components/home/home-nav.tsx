import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../../constants/theme";

export default function HomeNav() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The PACT</Text>
      <Pressable
        onPress={() => router.push("/profile")}
        hitSlop={8}
        style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
      >
        <Ionicons name="person-outline" size={24} color={colors.gray} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 8,
  },
  title: {
    flex: 1,
    fontSize: 19,
    fontWeight: "400",
    letterSpacing: 2,
    color: colors.white,
    paddingLeft: 8,
  },
  profileButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

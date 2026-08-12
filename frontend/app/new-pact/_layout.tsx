import { Stack } from "expo-router";
import { colors } from "../../constants/theme";

export default function NewPactLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.black },
      }}
    />
  );
}

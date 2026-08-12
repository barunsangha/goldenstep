import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PactProvider } from "../context/pact-store";
import { colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PactProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.black },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="new-pact" />
        </Stack>
      </PactProvider>
    </SafeAreaProvider>
  );
}

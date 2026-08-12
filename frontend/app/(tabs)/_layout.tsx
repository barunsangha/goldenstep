import { View, Pressable, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

function RunFab() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/run")}
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
    >
      <Ionicons name="walk" size={22} color={colors.greenDark} />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.dim,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          paddingTop: 11,
          paddingBottom: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 9.5,
          fontWeight: "400",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pact"
        options={{
          title: "Pacts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "trophy-sharp" : "trophy-outline"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.fabContainer}>
              <RunFab />
            </View>
          ),
        }}
      />
      {/*
        Feed is hidden, not deleted. There is no social graph in the schema
        — no friends, no follows, no activity table — so a Feed tab would
        need a whole feature behind it, not just a screen. href: null keeps
        the route working while removing it from the tab bar.
      */}
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={23}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -11,
  },
  fabPressed: {
    opacity: 0.9,
  },
});
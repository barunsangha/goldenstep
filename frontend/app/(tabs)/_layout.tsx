import { View, Pressable, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constants/theme";

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
          paddingBottom: 0,
          height: 80,
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
          title: "Run",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "walk-sharp" : "walk-outline"}
              color={color}
              size={23}
            />
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
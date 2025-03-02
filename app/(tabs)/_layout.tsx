import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.black,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(generate)"
        options={{
          title: "What's Next?",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="robot" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(watchlist)"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(list)"
        options={{
          title: "My List",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;

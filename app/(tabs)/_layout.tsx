import { Tabs } from "expo-router";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function TabLayout() {
  return (
    <Tabs initialRouteName="(home)">
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          animation: "shift",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: "Search",
          animation: "shift",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(generate)"
        options={{
          title: "What's Next?",
          animation: "shift",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="movie" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(watchlist)"
        options={{
          title: "Watchlist",
          animation: "shift",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;

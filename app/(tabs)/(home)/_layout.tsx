import React from "react";
import { Stack } from "expo-router";

function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="CategoryScreen" options={{ headerShown: false }} />
      <Stack.Screen name="GenreScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="MovieDetailsScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonDetailsScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default HomeStackLayout;

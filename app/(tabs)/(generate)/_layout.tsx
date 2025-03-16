import React from "react";
import { Stack } from "expo-router";

function GenerateStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="GenerateScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="GeneratedListScreen"
        options={{ headerShown: false }}
      />
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

export default GenerateStackLayout;

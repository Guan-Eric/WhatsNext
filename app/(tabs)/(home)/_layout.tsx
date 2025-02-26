import React from "react";
import { Stack } from "expo-router";

function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default HomeStackLayout;

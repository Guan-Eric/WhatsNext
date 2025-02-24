import React from "react";
import { Stack } from "expo-router";

function GenerateStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="GenerateScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default GenerateStackLayout;

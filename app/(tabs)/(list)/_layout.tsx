import React from "react";
import { Stack } from "expo-router";

function ListStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="TrendingScreen"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default ListStackLayout;

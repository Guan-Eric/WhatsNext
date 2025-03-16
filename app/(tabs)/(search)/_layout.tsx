import React from "react";
import { Stack } from "expo-router";

function SearchStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="SearchScreen"
        options={{ headerShown: false, gestureEnabled: false }}
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

export default SearchStackLayout;

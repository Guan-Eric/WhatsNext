import React from "react";
import { Stack } from "expo-router";

function ListStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="WatchlistScreen"
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
      <Stack.Screen name="MyListScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
    </Stack>
  );
}

export default ListStackLayout;

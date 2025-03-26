import React from "react";
import { Stack } from "expo-router";

function LoginStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "none",
          navigationBarHidden: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="signin"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default LoginStackLayout;

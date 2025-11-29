// app/(auth)/_layout.tsx - UPDATED
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

      {/* Individual Onboarding Screens */}
      <Stack.Screen
        name="onboarding1"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="onboarding2"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="onboarding3"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="onboarding4"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right",
        }}
      />

      {/* Paywall */}
      <Stack.Screen
        name="paywall"
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "slide_from_right",
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

import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases from "react-native-purchases";

function AppLayout() {
  useEffect(() => {
    // Initialize RevenueCat
    Purchases.configure({
      apiKey: Constants.expoConfig?.extra?.revenueCatApiKey || "your_api_key",
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default AppLayout;

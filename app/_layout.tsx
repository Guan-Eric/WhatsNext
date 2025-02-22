import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Roboto_700Bold, Roboto_400Regular } from "@expo-google-fonts/roboto";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const theme = createTheme({
  lightColors: {
    primary: "#3490de", // Primary blue
    secondary: "#f5a623", // Complementary orange
    background: "#ffffff", // White background for light mode
    white: "#f8f9fa", // Pure white
    black: "#222222", // Soft black for text
    grey0: "#f8f9fa", // Lightest grey
    grey1: "#e9ecef", // Light grey
    grey2: "#dee2e6", // Medium light grey
    grey3: "#ced4da", // Neutral grey
    grey4: "#adb5bd", // Darker grey
    grey5: "#6c757d", // Dark grey
    greyOutline: "#dcdcdc", // Outline grey
    searchBg: "#f1f3f5", // Light grey background for search
    success: "#28a745", // Green for success
    error: "#dc3545", // Red for errors
    warning: "#ffc107", // Yellow for warnings
    divider: "#e0e0e0", // Divider line color
  },
  mode: "light", // Default to dark mode
});

function AppLayout() {
  let [fontsLoaded, fontError] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default AppLayout;

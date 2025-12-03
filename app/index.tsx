// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, InteractionManager } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import Constants from "expo-constants";
import Purchases from "react-native-purchases";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      try {
        if (!user) {
          router.replace("/(auth)/welcome");
          setLoading(false);
          return;
        }

        // Check if user is in onboarding flow
        const isOnboarding = await AsyncStorage.getItem("@is_onboarding");
        if (isOnboarding === "true") {
          // Don't redirect, let onboarding flow handle navigation
          setLoading(false);
          return;
        }

        router.replace("/(tabs)/(home)/HomeScreen");
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/(auth)/welcome");
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatIos,
      });
      await checkAuth();
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#181818",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}

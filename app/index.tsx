// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, InteractionManager } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import Constants from "expo-constants";
import Purchases from "react-native-purchases";

export default function Index() {
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      try {
        if (!user) {
          // User not logged in → go to welcome
          InteractionManager.runAfterInteractions(() => {
            router.replace("/(auth)/welcome");
            setLoading(false);
          });
          return;
        }

        // User logged in → go to home
        InteractionManager.runAfterInteractions(() => {
          router.replace("/(tabs)/(home)/HomeScreen");
          setLoading(false);
        });
      } catch (error) {
        console.error("Auth check error:", error);
        InteractionManager.runAfterInteractions(() => {
          router.replace("/(auth)/welcome");
          setLoading(false);
        });
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

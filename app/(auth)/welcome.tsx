import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInAnonymous } from "@/backend/auth";

function WelcomeScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem("@has_seen_onboarding");
      setHasSeenOnboarding(seen === "true");
    } catch (e) {
      console.error("Error checking onboarding status:", e);
    }
  };

  const handleGetStarted = async () => {
    setLoading(true);

    // Sign in anonymously first
    const success = await signInAnonymous();

    if (!success) {
      alert("Failed to start. Please try again.");
      setLoading(false);
      return;
    }

    if (hasSeenOnboarding) {
      // User has seen onboarding before, skip to paywall
      router.replace("/(auth)/paywall");
    } else {
      // First time user, show onboarding
      try {
        await AsyncStorage.setItem("@has_seen_onboarding", "true");
      } catch (e) {
        console.error("Error saving onboarding status:", e);
      }
      router.replace("/(auth)/onboarding1");
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-background-dark items-center justify-around">
      <SafeAreaView className="flex-1 items-center justify-around w-full">
        <View className="items-center">
          <Image
            className="h-[150px] w-[250px]"
            resizeMode="contain"
            source={require("../../assets/logo.png")}
          />
          <Text className="text-6xl font-['Roboto_700Bold'] text-white">
            What’s Next?
          </Text>
          <Text className="text-xl text-white font-['Lato_400Regular'] mt-2">
            Never lose track of what's next.
          </Text>
        </View>

        <View className="w-full items-center px-8">
          {/* Get Started Button */}
          <Pressable
            className="bg-primary rounded-[20px] w-full max-w-[240px] h-[46px] items-center justify-center active:opacity-80"
            onPress={handleGetStarted}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-xl font-['Lato_400Regular']">
                Get Started
              </Text>
            )}
          </Pressable>

          <Text className="text-grey-dark-5 text-xs mt-4 text-center px-8">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;

import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Image, Text, Pressable } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WelcomeScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

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

  const handleSignUp = async () => {
    if (hasSeenOnboarding) {
      // User has seen onboarding before, skip to paywall or signup
      router.push("/(auth)/paywall");
    } else {
      // First time user, show onboarding
      try {
        await AsyncStorage.setItem("@has_seen_onboarding", "true");
      } catch (e) {
        console.error("Error saving onboarding status:", e);
      }
      router.push("/(auth)/onboarding1");
    }
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
            Watchfolio
          </Text>
          <Text className="text-xl text-white font-['Lato_400Regular'] mt-2">
            Never lose track of what's next.
          </Text>
        </View>

        <View className="w-full items-center px-8">
          {/* Sign Up Button */}
          <Pressable
            className="bg-primary rounded-[20px] w-full max-w-[240px] h-[46px] items-center justify-center active:opacity-80 mb-10"
            onPress={handleSignUp}
          >
            <Text className="text-white font-bold text-xl font-['Lato_400Regular']">
              Get Started
            </Text>
          </Pressable>

          {/* Sign In Section */}
          <View className="items-center">
            <Text className="text-gray-500 font-['Lato_400Regular'] text-base">
              Already have an account?
            </Text>
            <Pressable
              className="w-25 h-12 items-center justify-center active:opacity-60"
              onPress={() => router.push("/(auth)/signin")}
            >
              <Text className="text-primary font-['Lato_400Regular'] text-base">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default WelcomeScreen;

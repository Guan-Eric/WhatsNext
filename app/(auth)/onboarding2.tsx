import React from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Onboarding2() {
  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Skip Button */}
        <View className="flex-row justify-end px-6 pt-6">
          <Pressable onPress={() => router.push("/(auth)/paywall")}>
            <Text className="text-grey-dark-5 font-semibold text-base">
              Skip
            </Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          {/* Icon */}
          <View className="bg-grey-dark-1 rounded-full p-8 mb-8">
            <MaterialCommunityIcons name="robot" size={80} color="#f5a623" />
          </View>

          {/* Title */}
          <Text className="text-text-dark text-3xl font-bold text-center mb-4 px-4">
            AI-Powered Recommendations
          </Text>

          {/* Description */}
          <Text className="text-grey-dark-5 text-base text-center leading-6 mb-12 px-6">
            Get smart suggestions based on your mood, favorite genres, and
            viewing preferences
          </Text>

          {/* Progress Dots */}
          <View className="flex-row mb-12">
            <View className="w-2 h-2 rounded-full bg-grey-dark-3 mx-1" />
            <View className="w-8 h-2 rounded-full bg-primary mx-1" />
            <View className="w-2 h-2 rounded-full bg-grey-dark-3 mx-1" />
            <View className="w-2 h-2 rounded-full bg-grey-dark-3 mx-1" />
          </View>

          {/* Next Button */}
          <Pressable
            className="bg-primary rounded-[20px] h-14 w-full items-center justify-center active:opacity-80"
            onPress={() => router.push("/(auth)/onboarding3")}
          >
            <Text className="text-white font-bold text-lg">Next</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

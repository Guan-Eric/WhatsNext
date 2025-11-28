// app/(auth)/onboarding.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  Animated,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Onboarding data - customize these to match your app
const onboardingData = [
  {
    id: "1",
    title: "Discover Movies & TV Shows",
    description:
      "Explore trending content, popular picks, and personalized recommendations tailored just for you",
    icon: "movie-open",
    color: "#ffb400",
  },
  {
    id: "2",
    title: "AI-Powered Recommendations",
    description:
      "Get smart suggestions based on your mood, favorite genres, and viewing preferences",
    icon: "robot",
    color: "#f5a623",
  },
  {
    id: "3",
    title: "Track Your Watchlist",
    description:
      "Never forget what to watch next with organized watchlists and personalized viewing history",
    icon: "bookmark-multiple",
    color: "#ffb400",
  },
  {
    id: "4",
    title: "Stay Updated",
    description:
      "Get notifications about new releases, trending shows, and content you'll love",
    icon: "bell-ring",
    color: "#f5a623",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Move to next slide
        const nextSlide = currentSlide + 1;
        setCurrentSlide(nextSlide);
        scrollViewRef.current?.scrollTo({
          x: nextSlide * SCREEN_WIDTH,
          animated: true,
        });

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Last slide - go to paywall
      router.push("/(auth)/paywall");
    }
  };

  const handleSkip = () => {
    // Skip to paywall
    router.push("/(auth)/paywall");
  };

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          className="flex-1"
        >
          {onboardingData.map((item, index) => (
            <View
              key={item.id}
              style={{ width: SCREEN_WIDTH }}
              className="flex-1 items-center justify-center px-8"
            >
              <Animated.View
                style={{ opacity: fadeAnim }}
                className="items-center w-full"
              >
                {/* Icon Circle */}
                <View className="bg-grey-dark-1 rounded-full p-8 mb-8 shadow-lg">
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={80}
                    color={item.color}
                  />
                </View>

                {/* Title */}
                <Text className="text-text-dark text-3xl font-bold text-center mb-4 px-4">
                  {item.title}
                </Text>

                {/* Description */}
                <Text className="text-grey-dark-5 text-base text-center leading-6 mb-12 px-6">
                  {item.description}
                </Text>

                {/* Progress Dots */}
                <View className="flex-row mb-12">
                  {onboardingData.map((_, dotIndex) => (
                    <View
                      key={dotIndex}
                      className={`h-2 rounded-full mx-1 transition-all ${
                        dotIndex === index
                          ? "w-8 bg-primary"
                          : "w-2 bg-grey-dark-3"
                      }`}
                    />
                  ))}
                </View>

                {/* Buttons */}
                <View className="w-full px-8">
                  {/* Next/Get Started Button */}
                  <Pressable
                    className="bg-primary rounded-[20px] h-14 items-center justify-center mb-4 active:opacity-80 shadow-md"
                    onPress={handleNext}
                  >
                    <Text className="text-white font-bold text-lg">
                      {index === onboardingData.length - 1
                        ? "Get Started"
                        : "Next"}
                    </Text>
                  </Pressable>

                  {/* Skip Button - only show on first 3 screens */}
                  {index < onboardingData.length - 1 && (
                    <Pressable
                      className="h-14 items-center justify-center active:opacity-60"
                      onPress={handleSkip}
                    >
                      <Text className="text-grey-dark-5 font-semibold text-base">
                        Skip
                      </Text>
                    </Pressable>
                  )}
                </View>
              </Animated.View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

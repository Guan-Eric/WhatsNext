// app/(tabs)/(generate)/GenerateScreen.tsx - WITH PAYWALL LOGIC

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { GenerateStringList } from "@/backend/ai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Constants for free tier limits
const FREE_DAILY_LIMIT = 3;
const STORAGE_KEY = "@ai_generations";

export default function GenerateScreen() {
  const [genre, setGenre] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [releaseYear, setReleaseYear] = useState<
    "all-time" | "recent" | "classic"
  >("all-time");
  const [language, setLanguage] = useState<string>("");
  const [type, setType] = useState<"movie" | "tv">("movie");
  const [preference, setPreference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Paywall related state
  const [userPlan, setUserPlan] = useState<string>("free");
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [canGenerate, setCanGenerate] = useState<boolean>(true);

  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    checkUserPlanAndUsage();
  }, []);

  const checkUserPlanAndUsage = async () => {
    try {
      // Get user's plan
      const plan = (await AsyncStorage.getItem("@user_plan")) || "free";
      setUserPlan(plan);

      // If free user, check daily usage
      if (plan === "free") {
        const today = new Date().toDateString();
        const storageData = await AsyncStorage.getItem(STORAGE_KEY);

        if (storageData) {
          const { date, count } = JSON.parse(storageData);

          // Reset count if it's a new day
          if (date !== today) {
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ date: today, count: 0 })
            );
            setGenerationsUsed(0);
            setCanGenerate(true);
          } else {
            setGenerationsUsed(count);
            setCanGenerate(count < FREE_DAILY_LIMIT);
          }
        } else {
          // First time user
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: today, count: 0 })
          );
          setGenerationsUsed(0);
          setCanGenerate(true);
        }
      } else {
        // Premium/Lifetime users have unlimited access
        setCanGenerate(true);
      }
    } catch (error) {
      console.error("Error checking plan:", error);
      setCanGenerate(true); // Fail open
    }
  };

  const incrementGenerationCount = async () => {
    if (userPlan === "free") {
      try {
        const today = new Date().toDateString();
        const storageData = await AsyncStorage.getItem(STORAGE_KEY);

        if (storageData) {
          const { count } = JSON.parse(storageData);
          const newCount = count + 1;

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ date: today, count: newCount })
          );

          setGenerationsUsed(newCount);
          setCanGenerate(newCount < FREE_DAILY_LIMIT);
        }
      } catch (error) {
        console.error("Error incrementing count:", error);
      }
    }
  };

  async function handleGenerateMovies() {
    // Check if user can generate
    if (!canGenerate && userPlan === "free") {
      router.push("/(tabs)/(generate)/PaywallScreen");
      return;
    }

    try {
      setLoading(true);

      // Increment usage count for free users
      await incrementGenerationCount();

      const list = await GenerateStringList(
        genre,
        mood,
        releaseYear,
        language,
        type,
        preference
      );

      router.push({
        pathname: "/(tabs)/(generate)/GeneratedListScreen",
        params: { list: list, type: type },
      });
    } catch (error) {
      console.error("Error generating list", error);
    } finally {
      setLoading(false);
    }
  }

  const remainingGenerations = FREE_DAILY_LIMIT - generationsUsed;

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView
            style={{
              height: Platform.OS === "web" ? windowHeight : "auto",
            }}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          >
            <View className="flex-row items-center justify-between px-5">
              <Text className="text-text-dark text-3xl font-bold">
                What's Next?
              </Text>

              {/* Show usage indicator for free users */}
              {userPlan === "free" && (
                <Pressable
                  className="bg-grey-dark-1 rounded-full px-3 py-1.5 flex-row items-center"
                  onPress={() =>
                    router.push("/(tabs)/(generate)/PaywallScreen")
                  }
                >
                  <MaterialCommunityIcons
                    name="robot"
                    size={16}
                    color="#ffb400"
                  />
                  <Text className="text-primary text-xs font-bold ml-1">
                    {remainingGenerations}/{FREE_DAILY_LIMIT} left
                  </Text>
                </Pressable>
              )}

              {userPlan !== "free" && (
                <View className="bg-primary/20 rounded-full px-3 py-1.5 flex-row items-center">
                  <MaterialCommunityIcons
                    name="crown"
                    size={16}
                    color="#ffb400"
                  />
                  <Text className="text-primary text-xs font-bold ml-1">
                    {userPlan.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Warning banner if approaching limit */}
            {userPlan === "free" &&
              remainingGenerations <= 1 &&
              remainingGenerations > 0 && (
                <View className="mx-5 mt-4 bg-warning/20 border border-warning rounded-xl p-3">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="alert"
                      size={20}
                      color="#ffc107"
                    />
                    <Text className="text-warning font-semibold ml-2 flex-1">
                      Only {remainingGenerations} generation
                      {remainingGenerations > 1 ? "s" : ""} left today!
                    </Text>
                  </View>
                  <Pressable
                    className="mt-2"
                    onPress={() =>
                      router.push("/(tabs)/(generate)/PaywallScreen")
                    }
                  >
                    <Text className="text-primary text-sm underline">
                      Upgrade for unlimited →
                    </Text>
                  </Pressable>
                </View>
              )}

            {/* Genre Input */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-2">
                Genre
              </Text>
              <TextInput
                className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular']"
                placeholder="e.g. action, comedy, drama"
                placeholderTextColor="#6c757d"
                value={genre}
                onChangeText={setGenre}
              />
            </View>

            {/* Type Selection */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-3">
                Type
              </Text>
              <View className="flex-row">
                <Pressable
                  className={`flex-1 mr-2 rounded-xl p-3 border-2 ${
                    type === "movie"
                      ? "border-primary bg-primary/20"
                      : "border-grey-dark-2 bg-grey-dark-0"
                  }`}
                  onPress={() => setType("movie")}
                >
                  <View className="flex-row items-center justify-center">
                    <MaterialCommunityIcons
                      name="movie"
                      size={20}
                      color={type === "movie" ? "#ffb400" : "#6c757d"}
                    />
                    <Text
                      className={`ml-2 font-bold ${
                        type === "movie" ? "text-primary" : "text-grey-dark-5"
                      }`}
                    >
                      Movie
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  className={`flex-1 ml-2 rounded-xl p-3 border-2 ${
                    type === "tv"
                      ? "border-primary bg-primary/20"
                      : "border-grey-dark-2 bg-grey-dark-0"
                  }`}
                  onPress={() => setType("tv")}
                >
                  <View className="flex-row items-center justify-center">
                    <MaterialCommunityIcons
                      name="television"
                      size={20}
                      color={type === "tv" ? "#ffb400" : "#6c757d"}
                    />
                    <Text
                      className={`ml-2 font-bold ${
                        type === "tv" ? "text-primary" : "text-grey-dark-5"
                      }`}
                    >
                      TV Show
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Mood Input */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-2">
                Mood
              </Text>
              <TextInput
                className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular']"
                placeholder="e.g. relaxing, thrilling, thought-provoking"
                placeholderTextColor="#6c757d"
                value={mood}
                onChangeText={setMood}
              />
            </View>

            {/* Release Year */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-3">
                Release Year
              </Text>
              <View className="flex-row flex-wrap">
                {["all-time", "recent", "classic"].map((option) => (
                  <Pressable
                    key={option}
                    className={`mr-2 mb-2 rounded-full px-4 py-2 border ${
                      releaseYear === option
                        ? "border-primary bg-primary/20"
                        : "border-grey-dark-3 bg-grey-dark-0"
                    }`}
                    onPress={() => setReleaseYear(option as any)}
                  >
                    <Text
                      className={`font-semibold capitalize ${
                        releaseYear === option
                          ? "text-primary"
                          : "text-grey-dark-5"
                      }`}
                    >
                      {option.replace("-", " ")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Language Input */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-2">
                Language
              </Text>
              <TextInput
                className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular']"
                placeholder="e.g. English, Spanish, Korean"
                placeholderTextColor="#6c757d"
                value={language}
                onChangeText={setLanguage}
              />
            </View>

            {/* Other Preferences */}
            <View className="px-5 mt-5">
              <Text className="text-text-dark text-lg font-bold mb-2">
                Other Preferences
              </Text>
              <TextInput
                className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular']"
                placeholder="Any other preferences?"
                placeholderTextColor="#6c757d"
                value={preference}
                onChangeText={setPreference}
              />
            </View>

            {/* Generate Button */}
            <View className="px-5 mt-8">
              <Pressable
                className={`rounded-[20px] h-14 items-center justify-center ${
                  !canGenerate && userPlan === "free"
                    ? "bg-grey-dark-3"
                    : "bg-primary active:opacity-80"
                }`}
                onPress={handleGenerateMovies}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="robot"
                      size={20}
                      color="#fff"
                    />
                    <Text className="text-white font-bold text-lg ml-2">
                      {!canGenerate && userPlan === "free"
                        ? "Upgrade to Generate More"
                        : "Generate List"}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Upgrade prompt for free users */}
              {userPlan === "free" && (
                <Pressable
                  className="mt-4 items-center"
                  onPress={() =>
                    router.push("/(tabs)/(generate)/PaywallScreen")
                  }
                >
                  <Text className="text-grey-dark-5 text-sm">
                    Want unlimited generations?{" "}
                    <Text className="text-primary underline">Upgrade now</Text>
                  </Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

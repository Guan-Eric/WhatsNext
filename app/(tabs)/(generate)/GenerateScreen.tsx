import React, { useState, useEffect, useCallback } from "react";
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
import { router, useFocusEffect } from "expo-router";
import { GenerateStringList } from "@/backend/ai";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Purchases from "react-native-purchases";
import ToggleButton from "@/components/ToggleButton";

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
  const [canGenerate, setCanGenerate] = useState<boolean>(false);

  const windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    checkUserPlan();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkUserPlan();
    }, [])
  );

  const checkUserPlan = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (customerInfo.entitlements.active["Pro"]) {
        setCanGenerate(true);
      } else {
        router.push("/(tabs)/(generate)/PaywallScreen");
      }
    } catch (error) {
      console.error("Error checking plan:", error);
      setCanGenerate(false);
    }
  };

  async function handleGenerateMovies() {
    // Check if user can generate
    if (!canGenerate) {
      router.push("/(tabs)/(generate)/PaywallScreen");
      return;
    }

    try {
      setLoading(true);
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
            </View>
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
              <ToggleButton
                options={[
                  { value: "all-time", label: "All Time", icon: "infinity" },
                  { value: "recent", label: "Recent", icon: "calendar" },
                  {
                    value: "classic",
                    label: "Classic",
                    icon: "clock-time-four",
                  },
                ]}
                selectedValue={releaseYear}
                onValueChange={(value) => setReleaseYear(value as any)}
              />
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
                  !canGenerate
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
                      {!canGenerate ? "Upgrade to Generate" : "Generate List"}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BackButton: React.FC = () => {
  return (
    <Pressable onPress={() => router.back()} className="self-start">
      <View className="p-2">
        <Ionicons name="chevron-back" size={30} color="#000" />
      </View>
    </Pressable>
  );
};

export default BackButton;

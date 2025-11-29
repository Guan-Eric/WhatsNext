import React, { useState } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logOut } from "../../../backend/auth";
import { Href, router } from "expo-router";
import BackButton from "../../../components/BackButton";
import DeleteAccountModal from "@/components/modal/DeleteAccountModal";
import { deleteAccount, resetOnboarding } from "@/backend/user";
import { Ionicons } from "@expo/vector-icons";

function ProfileScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    setIsModalVisible(false);
    await deleteAccount();
    await resetOnboarding();
    router.replace("/(auth)/welcome");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your data will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logOut();
            await resetOnboarding();
            router.replace("/(auth)/welcome");
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#181818]">
      <SafeAreaView>
        <View className="flex-row">
          <BackButton />
          <Text className="text-3xl font-bold text-black dark:text-white">
            Profile
          </Text>
        </View>

        {[
          {
            title: "My List",
            route: "/(tabs)/(watchlist)/MyListScreen",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="rounded-2xl bg-grey-dark-0 border border-grey-0 dark:border-grey-dark-0 mx-3 my-2"
          >
            <Pressable
              onPress={() => router.push(item.route as Href)}
              className="flex-row items-center justify-between p-4"
            >
              <Text className="text-base font-bold text-black dark:text-white">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#000" />
            </Pressable>
          </View>
        ))}

        <View className="p-5 w-[200px] self-center">
          <Pressable
            className="rounded-2xl bg-grey-dark-2 py-3 items-center"
            onPress={handleLogout}
          >
            <Text className="font-bold text-black dark:text-white">
              Sign Out
            </Text>
          </Pressable>
        </View>

        <View className="mt-5 mb-5 p-5 w-[200px] self-center">
          <Pressable
            className="rounded-2xl bg-error py-3 items-center"
            onPress={() => setIsModalVisible(true)}
          >
            <Text className="font-bold text-white">Delete Account</Text>
          </Pressable>
        </View>

        <DeleteAccountModal
          modalVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onDeleteAccount={() => handleDeleteAccount()}
          onCancel={() => setIsModalVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
}

export default ProfileScreen;

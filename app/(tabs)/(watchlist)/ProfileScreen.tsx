import React, { useEffect, useState } from "react";
import { Text, View, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logOut } from "../../../backend/auth";
import { Href, router } from "expo-router";
import BackButton from "../../../components/BackButton";
import DeleteAccountModal from "@/components/modal/DeleteAccountModal";
import { deleteAccount, resetOnboarding } from "@/backend/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Purchases from "react-native-purchases";

function ProfileScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    checkUserPlan();
  }, []);

  const checkUserPlan = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (customerInfo.entitlements.active["Pro"]) {
        setIsPro(true);
      }
    } catch (error) {
      console.error("Error checking plan:", error);
      setIsPro(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsModalVisible(false);
    await deleteAccount();
    await resetOnboarding();
    router.replace("/(auth)/welcome");
  };

  const menuItems = [
    {
      title: "My List",
      subtitle: "Movies and shows you've watched",
      icon: "playlist-check",
      route: "/(tabs)/(watchlist)/MyListScreen",
      color: "#ffb400",
    },
    {
      title: "Watchlist",
      subtitle: "Content saved for later",
      icon: "bookmark-multiple",
      route: "/(tabs)/(watchlist)/WatchlistScreen",
      color: "#f5a623",
    },
  ];

  const accountItems = [
    {
      title: "App Settings",
      subtitle: "Notifications and preferences",
      icon: "cog",
      color: "#6c757d",
      onPress: () => {
        // Future: Navigate to settings
        Alert.alert(
          "Coming Soon",
          "Settings will be available in a future update"
        );
      },
    },
    {
      title: "Help & Support",
      subtitle: "Get help or send feedback",
      icon: "help-circle",
      color: "#6c757d",
      onPress: () => {
        Alert.alert("Support", "Contact us at: erictheguan@gmail.com");
      },
    },
  ];

  return (
    <View className="flex-1 bg-[#181818]">
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-4 mb-6">
            <Text className="text-[32px] font-bold text-white">Profile</Text>
          </View>

          {/* User Info Card */}
          <View className="mx-5 mb-6">
            <LinearGradient
              colors={["#ffb400", "#f5a623"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14 }}
            >
              <View className="flex-row items-center">
                <View className=" backdrop-blur-sm rounded-full p-4 mr-4">
                  <MaterialCommunityIcons
                    name="account"
                    size={40}
                    color="#fff"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold mb-1">
                    Anonymous User
                  </Text>
                  <Text className="text-white/80 text-sm">
                    {isPro ? "Premium Plan" : "Free Plan"} • Using Watchfolio
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* My Content Section */}
          <View className="px-5 mb-4">
            <Text className="text-white text-lg font-bold mb-3">
              My Content
            </Text>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(item.route as Href)}
                className="bg-grey-dark-1 rounded-2xl p-4 mb-3 active:opacity-80"
              >
                <View className="flex-row items-center">
                  <View
                    className="rounded-full p-3 mr-4"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color={item.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-grey-dark-5 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#6c757d"
                  />
                </View>
              </Pressable>
            ))}
          </View>

          {/* Account Section */}
          <View className="px-5 mb-4">
            <Text className="text-white text-lg font-bold mb-3">Account</Text>
            {accountItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
                className="bg-grey-dark-1 rounded-2xl p-4 mb-3 active:opacity-80"
              >
                <View className="flex-row items-center">
                  <View
                    className="rounded-full p-3 mr-4"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color={item.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-grey-dark-5 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#6c757d"
                  />
                </View>
              </Pressable>
            ))}
          </View>

          {/* Premium Upgrade Card (for free users) */}
          {isPro ?? (
            <View className="mx-5 mb-4">
              <Pressable
                onPress={() => router.push("/(tabs)/(generate)/PaywallScreen")}
                className="bg-gradient-to-r rounded-2xl overflow-hidden active:opacity-90"
              >
                <LinearGradient
                  colors={["#4f4f4f", "#2b2b2b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 14 }}
                >
                  <View className="flex-row items-center">
                    <View className="bg-primary/20 rounded-full p-3 mr-4">
                      <MaterialCommunityIcons
                        name="crown"
                        size={24}
                        color="#ffb400"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg mb-1">
                        Upgrade to Premium
                      </Text>
                      <Text className="text-grey-dark-5 text-sm">
                        Unlimited AI recommendations & more
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#ffb400"
                    />
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {/* Danger Zone Section */}
          <View className="px-5 mb-6">
            <Text className="text-white text-lg font-bold mb-3">
              Danger Zone
            </Text>
            {/* Delete Account Button */}
            <Pressable
              onPress={() => setIsModalVisible(true)}
              className="bg-error/10 rounded-2xl p-4 border-2 border-error active:opacity-80"
            >
              <View className="flex-row items-center justify-center">
                <MaterialCommunityIcons
                  name="delete-forever"
                  size={20}
                  color="#dc3545"
                />
                <Text className="text-error font-bold text-base ml-2">
                  Delete Account
                </Text>
              </View>
            </Pressable>
          </View>

          {/* App Info */}
          <View className="px-5 mb-8 items-center">
            <Text className="text-grey-dark-5 text-xs mb-1">
              What’s Next? v2.0.0
            </Text>
            <Text className="text-grey-dark-5 text-xs">
              Made with ❤️ for movie lovers
            </Text>
          </View>
        </ScrollView>

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

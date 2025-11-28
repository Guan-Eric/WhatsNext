// app/(auth)/signin.tsx - MIGRATED TO NATIVEWIND

import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { logIn } from "../../backend/auth";
import BackButton from "../../components/BackButton";
import AuthErrorModal from "@/components/modal/AuthErrorModal";

function SignInScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const signIn = async () => {
    setLoading(true);
    if (await logIn(email, password)) {
      setLoading(false);
      router.push({ pathname: "/(tabs)/(home)/HomeScreen" });
    } else {
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-dark">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <SafeAreaView className="flex-1">
          <BackButton />

          <View className="flex-1 items-center justify-center">
            {/* Logo & Title Section */}
            <View className="items-center pb-20">
              <Image
                resizeMode="contain"
                className="h-[100px] w-[250px]"
                source={require("../../assets/logo.png")}
              />
              <Text className="text-white text-4xl font-['Alata_400Regular'] self-center">
                Sign In
              </Text>
            </View>

            {/* Input Section */}
            <View className="pb-24">
              {/* Email Input */}
              <View className="w-64 mb-9">
                <Text className="text-white text-sm mb-2 font-['Alata_400Regular'] px-1">
                  E-mail
                </Text>
                <TextInput
                  className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Alata_400Regular'] text-sm"
                  onChangeText={onChangeEmail}
                  autoCapitalize="none"
                  placeholderTextColor="#6c757d"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View className="w-64">
                <Text className="text-white text-sm mb-2 font-['Alata_400Regular'] px-1">
                  Password
                </Text>
                <TextInput
                  className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Alata_400Regular'] text-sm"
                  onChangeText={onChangePassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholderTextColor="#6c757d"
                />
              </View>
            </View>

            {/* Sign In Button */}
            <Pressable
              className="bg-primary rounded-[20px] w-60 h-[42px] items-center justify-center active:opacity-80"
              onPress={signIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold font-['Alata_400Regular']">
                  Sign In
                </Text>
              )}
            </Pressable>

            {/* Sign Up Link */}
            <View className="items-center pt-5">
              <Text className="text-gray-500 font-['Alata_400Regular'] text-base">
                Don't have an account?
              </Text>
              <Pressable
                className="w-25 h-12 items-center justify-center active:opacity-60"
                onPress={() => router.push("/(auth)/signup")}
              >
                <Text className="text-primary font-['Alata_400Regular'] text-base">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>

          <AuthErrorModal
            modalVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            errorMessage="The email or password you entered is incorrect. Please try again."
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SignInScreen;

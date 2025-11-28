import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { register } from "../../backend/auth";
import BackButton from "../../components/BackButton";
import PasswordErrorModal from "../../components/modal/PasswordErrorModal";
import AuthErrorModal from "@/components/modal/AuthErrorModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordErrorModalVisible, setPasswordErrorModalVisible] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("free");

  const params = useLocalSearchParams();

  useEffect(() => {
    // Get plan from params or AsyncStorage
    const loadPlan = async () => {
      const planFromParams = params.plan as string;
      if (planFromParams) {
        setSelectedPlan(planFromParams);
      } else {
        const storedPlan = await AsyncStorage.getItem("@selected_plan");
        if (storedPlan) {
          setSelectedPlan(storedPlan);
        }
      }
    };
    loadPlan();
  }, [params]);

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      password.length < minLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar ||
      password !== confirmPassword
    ) {
      return false;
    }
    return true;
  };

  const signUp = async () => {
    setLoading(true);
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password, confirmPassword)) {
      setPasswordErrorModalVisible(true);
      setLoading(false);
      return;
    }

    if (await register(email, password)) {
      // Save selected plan to user profile
      await AsyncStorage.setItem("@user_plan", selectedPlan);

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
            {/* Logo & Title */}
            <View className="items-center pb-14">
              <Image
                className="h-[100px] w-[250px]"
                resizeMode="contain"
                source={require("../../assets/logo.png")}
              />
              <Text className="text-white text-4xl font-['Lato_400Regular'] self-center">
                Sign Up
              </Text>

              {/* Show selected plan */}
              {selectedPlan !== "free" && (
                <View className="bg-primary/20 rounded-full px-4 py-1 mt-2">
                  <Text className="text-primary text-xs font-bold">
                    {selectedPlan.toUpperCase()} PLAN
                  </Text>
                </View>
              )}
            </View>

            {/* Inputs */}
            <View className="pb-20">
              {/* Email */}
              <View className="w-64 mb-10">
                <Text className="text-white text-sm mb-2 font-['Lato_400Regular'] px-1">
                  E-mail
                </Text>
                <TextInput
                  className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular'] text-sm"
                  placeholder="e.g. johnsmith@email.com"
                  value={email}
                  onChangeText={onChangeEmail}
                  autoCapitalize="none"
                  placeholderTextColor="#6c757d"
                  keyboardType="email-address"
                />
                {emailError && (
                  <Text className="text-error text-xs mt-1">{emailError}</Text>
                )}
              </View>

              {/* Password */}
              <View className="w-64 mb-10">
                <Text className="text-white text-sm mb-2 font-['Lato_400Regular'] px-1">
                  Password
                </Text>
                <TextInput
                  className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular'] text-sm"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholderTextColor="#6c757d"
                />
              </View>

              {/* Confirm Password */}
              <View className="w-64">
                <Text className="text-white text-sm mb-2 font-['Lato_400Regular'] px-1">
                  Confirm Password
                </Text>
                <TextInput
                  className="bg-grey-dark-0 text-text-dark rounded-[10px] px-3 h-[42px] font-['Lato_400Regular'] text-sm"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholderTextColor="#6c757d"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <Pressable
              className="bg-primary rounded-[20px] w-60 h-[42px] items-center justify-center active:opacity-80"
              onPress={signUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold font-['Lato_400Regular']">
                  Sign Up
                </Text>
              )}
            </Pressable>

            {/* Sign In Link */}
            <View className="items-center pt-5">
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

          <PasswordErrorModal
            modalVisible={passwordErrorModalVisible}
            onClose={() => setPasswordErrorModalVisible(false)}
            minLength={8}
          />
          <AuthErrorModal
            modalVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            errorMessage="An account with this email address already exists. Please use a different email or log in."
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SignUpScreen;

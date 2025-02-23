import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Input } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { register } from "../../backend/auth";
import BackButton from "../../components/BackButton";
import PasswordErrorModal from "../../components/modal/PasswordErrorModal";
import AuthErrorModal from "@/components/modal/AuthErrorModal";

function SignUpScreen() {
  const [email, onChangeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordErrorModalVisible, setPasswordErrorModalVisible] =
    useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    username,
    name,
    primaryHeight,
    secondaryHeight,
    weight,
    heightIsMetric,
    weightIsMetric,
  } = useLocalSearchParams();

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
      setLoading(false);
    } else {
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <BackButton />
            <View style={styles.content}>
              <View style={{ alignItems: "center", paddingBottom: 60 }}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/images/icon.png")}
                />
                <Text style={styles.titleText}>Sign Up</Text>
              </View>
              <View style={{ paddingBottom: 90 }}>
                <Input
                  inputContainerStyle={styles.inputRoundedContainer}
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  label="E-mail"
                  placeholder="e.g. johnsmith@email.com"
                  value={email}
                  onChangeText={(email) => onChangeEmail(email)}
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                  inputStyle={styles.inputText}
                  errorMessage={emailError}
                />
                <View style={{ paddingTop: 40 }}>
                  <Input
                    inputContainerStyle={styles.inputRoundedContainer}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    label="Password"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    inputStyle={styles.inputText}
                  />
                </View>
                <View style={{ paddingTop: 40 }}>
                  <Input
                    inputContainerStyle={styles.inputRoundedContainer}
                    containerStyle={styles.inputContainer}
                    style={styles.input}
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(confirmPassword) =>
                      setConfirmPassword(confirmPassword)
                    }
                    secureTextEntry={true}
                    autoCapitalize="none"
                    placeholderTextColor="gray"
                    inputStyle={styles.inputText}
                  />
                </View>
              </View>
              {loading ? (
                <Button buttonStyle={styles.signUpButton} loading />
              ) : (
                <Button
                  buttonStyle={styles.signUpButton}
                  title="Sign Up"
                  onPress={signUp}
                />
              )}
              <View style={{ alignItems: "center", paddingTop: 20 }}>
                <Text style={styles.baseText}>Already have an account?</Text>
                <Button
                  type="clear"
                  titleStyle={styles.signIn}
                  buttonStyle={styles.signInButton}
                  title="Sign In"
                  onPress={() => router.push("/(auth)/signin")}
                />
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
              errorMessage={
                "An account with this email address already exists. Please use a different email or log in."
              }
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    resizeMode: "contain",
    height: 100,
    width: 250,
    alignSelf: "center",
  },
  baseText: {
    fontFamily: "Lato_400Regular",
    color: "gray",
    fontSize: 16,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Lato_400Regular",
  },
  signUpButton: {
    fontFamily: "Lato_400Regular",
    borderRadius: 20,
    width: 240,
    height: 42,
  },
  signInButton: {
    width: 100,
  },
  signIn: { fontFamily: "Lato_400Regular", fontSize: 16 },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  inputContainer: {
    width: 254,
    height: 42,
    borderRadius: 10,
  },
  inputText: {
    color: "#f8f9fa",
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "#1f1f1f",
  },
});

export default SignUpScreen;

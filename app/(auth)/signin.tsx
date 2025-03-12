import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Icon, Input } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
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
    if (await logIn(email, password)) setLoading(false);
    else {
      setIsModalOpen(true);
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <BackButton />
          <View style={styles.content}>
            <View style={{ alignItems: "center", paddingBottom: 84 }}>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require("../../assets/logo.png")}
              />
              <Text style={styles.titleText}>Sign In</Text>
            </View>
            <View style={{ paddingBottom: 96 }}>
              <Input
                inputStyle={{ color: "#f8f9fa" }}
                inputContainerStyle={styles.inputRoundedContainer}
                containerStyle={styles.inputContainer}
                style={styles.input}
                label="E-mail"
                onChangeText={(email) => onChangeEmail(email)}
                autoCapitalize="none"
              />
              <View style={{ paddingTop: 35 }}>
                <Input
                  inputStyle={{ color: "#f8f9fa" }}
                  inputContainerStyle={styles.inputRoundedContainer}
                  containerStyle={styles.inputContainer}
                  style={styles.input}
                  label="Password"
                  onChangeText={(password) => onChangePassword(password)}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>
            </View>
            {loading ? (
              <Button buttonStyle={styles.signInButton} loading />
            ) : (
              <Button
                buttonStyle={styles.signInButton}
                title="Sign In"
                onPress={signIn}
              />
            )}
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <Text style={styles.baseText}>Already have an account?</Text>
              <Button
                type="clear"
                titleStyle={styles.signUp}
                buttonStyle={styles.signUpButton}
                title="Sign Up"
                onPress={() => router.push("/(auth)/signup")}
              />
            </View>
          </View>
          <AuthErrorModal
            modalVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            errorMessage={
              "The email or password you entered is incorrect. Please try again."
            }
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 100,
    width: 250,
    alignSelf: "center",
  },
  baseText: {
    fontFamily: "Alata_400Regular",
    color: "gray",
    fontSize: 16,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 40,
    color: "white",
    fontFamily: "Alata_400Regular",
  },
  signInButton: {
    fontFamily: "Alata_400Regular",
    borderRadius: 20,
    width: 240,
    height: 42,
  },
  signUpButton: {
    width: 100,
  },
  signUp: { fontFamily: "Alata_400Regular", fontSize: 16 },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Alata_400Regular",
    fontSize: 14,
  },
  inputContainer: {
    width: 254,
    height: 42,
    borderRadius: 10,
  },
  inputText: {
    color: "white",
    fontFamily: "Alata_400Regular",
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
export default SignInScreen;

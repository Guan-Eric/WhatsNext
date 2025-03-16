import React from "react";
import { Button } from "@rneui/themed";
import { SafeAreaView, View, Image, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              height: 150,
              width: 250,
            }}
            resizeMode="contain"
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.logoText}>Watchfolio</Text>
          <Text style={styles.sloganText}>
            Never lose track of what's next.
          </Text>
        </View>
        <View>
          <Button
            size="lg"
            buttonStyle={styles.signUpButton}
            title="Sign Up"
            onPress={() => router.push("/(auth)/signup")}
          />

          <View style={{ alignItems: "center", paddingTop: 40 }}>
            <Text style={styles.baseText}>Already have an account?</Text>

            <Button
              type="clear"
              buttonStyle={styles.signInButton}
              titleStyle={{ fontFamily: "Lato_400Regular", fontSize: 15 }}
              title="Sign In"
              onPress={() => router.push("/(auth)/signin")}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sloganText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Lato_400Regular",
  },
  logoText: {
    fontSize: 64,
    fontFamily: "Roboto_700Bold",
    color: "white",
  },
  baseText: {
    fontFamily: "Lato_400Regular",
    color: "gray",
    fontSize: 15,
  },
  signUpButton: {
    fontFamily: "Lato_400Regular",
    fontSize: 20,
    borderRadius: 20,
    width: 240,
    height: 46,
  },
  signInButton: { width: 100 },
});
export default WelcomeScreen;

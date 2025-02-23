import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TrendingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
  },
  text: {
    fontSize: 24,
    color: "#e5e5e5",
    fontFamily: "Roboto_700Bold",
  },
});

export default TrendingScreen;

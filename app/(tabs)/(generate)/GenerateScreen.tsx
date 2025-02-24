import React, { Ref, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, CheckBox, Input, Slider, useTheme } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../../components/BackButton";
import { router } from "expo-router";

export default function GenerateScreen() {
  const [genre, setGenre] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [releaseYear, setReleaseYear] = useState<
    "all-time" | "recent" | "classic"
  >("all-time");
  const [language, setLanguage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  async function handleGenerateMovies() {}
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.title, { color: theme.colors.black }]}>
                What's Next?
              </Text>
            </View>
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Genre"
              placeholder="e.g. action, comedy, drama"
              value={genre}
              onChangeText={setGenre}
            />
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 10,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Mood"
              placeholder="e.g. relaxing, thrilling, thought-provoking"
              value={mood}
              onChangeText={(text) => setMood(text)}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.black }]}>
              Release Year
            </Text>
            <View style={styles.checkboxRow}>
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={releaseYear === "all-time"}
                title={"All-Time"}
                onIconPress={() => {
                  setReleaseYear("all-time");
                }}
              />
              <CheckBox
                textStyle={{ color: theme.colors.black }}
                checked={releaseYear === "recent"}
                title={"Recent"}
                onIconPress={() => {
                  setReleaseYear("recent");
                }}
              />

              <CheckBox
                textStyle={{ color: theme.colors.black }}
                containerStyle={styles.checkboxContainer}
                checked={releaseYear === "classic"}
                title={"Classic"}
                onIconPress={() => {
                  setReleaseYear("classic");
                }}
              />
            </View>
            <Input
              labelStyle={[
                styles.sectionTitle,
                {
                  paddingLeft: 0,
                  marginTop: 0,
                  color: theme.colors.black,
                  marginBottom: 5,
                },
              ]}
              inputStyle={{ color: theme.colors.black }}
              inputContainerStyle={[
                styles.inputRoundedContainer,
                { backgroundColor: theme.colors.grey0 },
              ]}
              containerStyle={styles.inputContainer}
              style={styles.input}
              label="Language"
              value={language}
              onChangeText={setLanguage}
            />

            <Button
              titleStyle={styles.buttonTitle}
              disabled={loading}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                width: 200,
                borderRadius: 20,
                alignSelf: "center",
              }}
              title="Generate Movie Lists"
              onPress={handleGenerateMovies}
              loading={loading}
              containerStyle={styles.buttonContainer}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Lato_700Bold",
    paddingLeft: 20,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  planContainer: {
    marginTop: 30,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    height: 42,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkboxContainer: { width: "28%" },
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  buttonTitle: {
    fontFamily: "Lato_700Bold",
  },
});

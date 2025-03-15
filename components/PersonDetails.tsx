import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import BackButton from "./BackButton";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { fetchCast } from "@/backend/person";
import { router } from "expo-router";
import PersonCard from "./cards/PersonCard";

interface PersonDetailsProps {
  personId: string;
  profilePath: string;
  theme: any;
  tab: "(generate)" | "(home)" | "(watchlist)";
}

const PersonDetails: React.FC<PersonDetailsProps> = ({
  personId,
  profilePath,
  theme,
  tab,
}) => {
  const screenWidth = Dimensions.get("screen").width;
  const [person, setPerson] = useState<Person>();

  const fetchPersonDetails = async () => {
    //setPerson(await fetchCast(personId));
  };

  useEffect(() => {
    fetchPersonDetails();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView>
        <View>
          <View
            style={[
              styles.imageContainer,
              {
                width: screenWidth,
                height: screenWidth * 0.9,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            <Image
              source={{ uri: profilePath }}
              style={[
                styles.poster,
                {
                  width: screenWidth,
                  height: screenWidth * 1.5,
                  top: 0,
                },
              ]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[theme.colors.background, "transparent"]}
              style={styles.gradientTop}
            />
            {/* Bottom Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientBottom}
            />
            {/* Left Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientLeft}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
            />
            {/* Right Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientRight}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.colors.black }]}>
          {person?.name}
        </Text>

        <Text style={[styles.description, { color: theme.colors.black }]}>
          {person?.biography}
        </Text>
        {/* 
        {person?.known_for && person.known_for.length > 0 ? (
          <Text style={[styles.subtitle, { color: theme.colors.black }]}>
            Known For
          </Text>
        ) : null}

        <FlatList
          data={person?.known_for}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            item.poster_path != null ? (
              <View style={{ flexDirection: "column" }}>
                <PersonCard
                  personId={item?.id}
                  profilePath={item?.poster_path as string}
                  width={140}
                  height={210}
                  tab={tab}
                />
                <Text
                  style={{
                    color: theme.colors.black,
                    textAlign: "center",
                    flexWrap: "wrap",
                    paddingBottom: 10,
                  }}
                >
                  {item.title || item.name}
                </Text>
              </View>
            ) : null
          }
        /> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? 42
        : StatusBar.currentHeight !== undefined
        ? StatusBar.currentHeight + 12
        : 12,
    left: 0,
    zIndex: 1,
  },
  buttonsContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? 40
        : StatusBar.currentHeight !== undefined
        ? StatusBar.currentHeight + 10
        : 10,
    right: 0,
    zIndex: 1,
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative",
  },
  poster: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust height for the blur effect
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust height for the blur effect
  },
  gradientLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 50, // Adjust width for the blur effect
  },
  gradientRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 50, // Adjust width for the blur effect
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default PersonDetails;

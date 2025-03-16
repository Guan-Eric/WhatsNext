import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface MovieCardProps {
  personId: number;
  profilePath: string;
  width: number;
  height: number;
  theme: any;
  name: string;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const PersonCard: React.FC<MovieCardProps> = ({
  personId,
  profilePath,
  width,
  height,
  theme,
  name,
  tab,
}) => {
  return (
    <Button
      type="clear"
      onPress={() =>
        router.push({
          pathname: `/(tabs)/${tab}/PersonDetailsScreen`,
          params: {
            personId: personId,
            profilePath: profilePath,
          },
        })
      }
    >
      <Image
        source={{ uri: profilePath }}
        style={[styles.poster, { width: width, height: height }]}
      />
      {name != null ? (
        <>
          <LinearGradient
            colors={["transparent", theme.colors.background]}
            style={styles.gradientBottom}
          />
          <Text
            style={{
              position: "absolute",
              color: theme.colors.black,
              textAlign: "center",
              flexWrap: "wrap",
              paddingBottom: 10,
              bottom: 10,
            }}
          >
            {name}
          </Text>
        </>
      ) : null}
    </Button>
  );
};

const styles = StyleSheet.create({
  poster: {
    borderRadius: 10,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust height for the blur effect
  },
});

export default PersonCard;

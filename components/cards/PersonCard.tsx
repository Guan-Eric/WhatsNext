import React from "react";
import { Image, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { router } from "expo-router";

interface MovieCardProps {
  personId: number;
  profilePath: string;
  width: number;
  height: number;
  tab: "(generate)" | "(home)" | "(watchlist)";
}

const PersonCard: React.FC<MovieCardProps> = ({
  personId,
  profilePath,
  width,
  height,
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
    </Button>
  );
};

const styles = StyleSheet.create({
  poster: {
    borderRadius: 10,
  },
});

export default PersonCard;

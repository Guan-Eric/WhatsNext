import React from "react";
import { Image, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { router } from "expo-router";

interface MovieCardProps {
  person: Person;
  posterPath: string;
  width: number;
  height: number;
  tab: "(generate)" | "(home)" | "(watchlist)";
}

const PersonCard: React.FC<MovieCardProps> = ({
  person,
  posterPath,
  width,
  height,
  tab,
}) => {
  return (
    <Button
      type="clear"
      onPress={() =>
        router.push({
          pathname: `/(tabs)/${tab}/MovieDetailsScreen`,
          params: {
            personId: person.id,
            posterPath: posterPath,
          },
        })
      }
    >
      <Image
        source={{ uri: posterPath }}
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

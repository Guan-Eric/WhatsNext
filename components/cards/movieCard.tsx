import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";

interface MovieCardProps {
  movie: Movie;
  posterPath: string;
  theme: any;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, posterPath, theme }) => {
  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.grey0,
          borderColor: theme.colors.grey0,
        },
      ]}
    >
      <Image source={{ uri: posterPath }} style={styles.poster} />
      <Text style={[styles.title, { color: theme.colors.black }]}>
        {movie.title}
      </Text>
      <View style={styles.genresContainer}>
        {movie.genres?.map((genre, index) => (
          <Text key={index} style={styles.genre}>
            {genre.name}
          </Text>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
  },
  poster: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  genre: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
    margin: 2,
  },
});

export default MovieCard;

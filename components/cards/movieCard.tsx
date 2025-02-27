import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import ThreeDotsModal from "../modal/ThreeDotsModal";

interface MovieCardProps {
  movie: Movie;
  posterPath: string;
  theme: any;
  options: ModalOptions[];
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  posterPath,
  theme,
  options,
}) => {
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
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: posterPath }} style={styles.poster} />
        <View style={{ marginLeft: 10, justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              width: "86%",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.title, { color: theme.colors.black }]}>
              {movie.title}
            </Text>
            <ThreeDotsModal options={options} theme={theme} />
          </View>
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre, index) => (
              <Text
                key={index}
                style={[
                  styles.genre,
                  {
                    backgroundColor: theme.colors.grey1,
                    color: theme.colors.grey4,
                  },
                ]}
              >
                {genre.name}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    borderRadius: 20,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: 205,
    overflow: "hidden",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: 200,
    overflow: "hidden",
  },
  genre: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
    margin: 2,
  },
});

export default MovieCard;

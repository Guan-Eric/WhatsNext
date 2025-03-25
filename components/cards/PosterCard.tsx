import React from "react";
import { Image, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { fetchHDMoviePoster } from "@/backend/movie";

interface MovieCardProps {
  movie: Movie | TVShow;
  posterPath: string;
  width: number;
  height: number;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const PosterCard: React.FC<MovieCardProps> = ({
  movie,
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
            movieId: movie.id,
            posterPath: fetchHDMoviePoster(movie?.poster_path as string),
            type: movie.hasOwnProperty("title") ? "movie" : "tv",
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

export default PosterCard;

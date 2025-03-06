import React from "react";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import MovieDetails from "@/components/MovieDetails";

function MovieDetailsScreen() {
  const { theme } = useTheme();
  const { movieId, posterPath, type } = useLocalSearchParams();

  return (
    <MovieDetails
      theme={theme}
      movieId={movieId as string}
      posterPath={posterPath as string}
      type={type as "movie" | "tv"}
    />
  );
}

export default MovieDetailsScreen;

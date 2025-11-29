import React from "react";
import { useLocalSearchParams } from "expo-router";
import MovieDetails from "@/components/MovieDetails";

function MovieDetailsScreen() {
  const { movieId, posterPath, type } = useLocalSearchParams();

  return (
    <MovieDetails
      movieId={movieId as string}
      posterPath={posterPath as string}
      type={type as "movie" | "tv"}
      tab={"(watchlist)"}
    />
  );
}

export default MovieDetailsScreen;

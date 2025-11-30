import React from "react";
import { Image, Pressable } from "react-native";
import { router } from "expo-router";
import { fetchHDMoviePoster } from "@/backend/movie";
import { Movie, TVShow } from "../types";

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
    <Pressable
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
      className="ml-4 my-4"
    >
      <Image
        source={{ uri: posterPath }}
        className="rounded-lg"
        style={{ width: width, height: height }}
      />
    </Pressable>
  );
};

export default PosterCard;

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import ThreeDotsModal from "../modal/ThreeDotsModal";
import { router } from "expo-router";
import { fetchHDMoviePoster } from "@/backend/movie";
import { Movie, TVShow, ModalOptions } from "../types";

interface MovieCardProps {
  movie: Movie | TVShow;
  posterPath: string;
  options: ModalOptions[];
  tab: "(generate)" | "(home)" | "(watchlist)";
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  posterPath,
  options,
  tab,
}) => {
  return (
    <Pressable
      className="mx-4 mt-4"
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
      <View className="rounded-2xl w-full bg-grey-dark-0 border border-grey-0 dark:border-grey-dark-0">
        <View className="flex-row p-3">
          <Image
            source={{ uri: posterPath }}
            className="w-[100px] h-[150px] rounded-lg"
          />

          <View className="ml-2.5 justify-between flex-1">
            <View className="flex-row items-center mb-5 justify-between">
              <Text className="text-lg font-bold flex-wrap flex-1 mr-2 text-black dark:text-white">
                {movie?.hasOwnProperty("title")
                  ? (movie as Movie)?.title
                  : (movie as TVShow)?.name}
              </Text>
              <ThreeDotsModal options={options} />
            </View>

            <View className="flex-row flex-wrap">
              {movie.genres?.map((genre, index) => (
                <Text
                  key={index}
                  className="rounded-md px-1.5 py-1 m-0.5 bg-grey-dark-1 text-grey-4 dark:text-grey-dark-4"
                >
                  {genre.name}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default MovieCard;

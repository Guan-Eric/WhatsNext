import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { FetchMovieList } from "@/backend/ai";
import BackButton from "@/components/BackButton";
import Carousel from "react-native-reanimated-carousel";
import GeneratedMovieCard from "@/components/cards/GeneratedMovieCard";
import { fetchMoviePoster } from "@/backend/movie";
import { Movie, TVShow } from "@/components/types";

export default function GenerateScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<Movie[] | TVShow[]>([]);
  const { list, type } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  const renderItem = ({ item }: { item: Movie | TVShow }) => (
    <GeneratedMovieCard
      movie={item}
      posterPath={fetchMoviePoster(item.poster_path as string)}
      type={type as "movie" | "tv"}
      tab={"(generate)"}
    />
  );

  useEffect(() => {
    const fetchMovies = async () => {
      setMovieList(
        await FetchMovieList(
          (list as string).split(","),
          type as "movie" | "tv"
        )
      );
      setLoading(false);
    };
    setLoading(true);
    fetchMovies();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-[#181818]">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center">
          <BackButton />
          <Text className="text-3xl font-bold text-black dark:text-white">
            What's Next?
          </Text>
        </View>
        <Carousel
          autoPlayInterval={2000}
          data={
            type == "movie" ? (movieList as Movie[]) : (movieList as TVShow[])
          }
          height={screenHeight}
          loop={false}
          pagingEnabled={true}
          snapEnabled={true}
          width={screenWidth}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 65,
          }}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </View>
  );
}

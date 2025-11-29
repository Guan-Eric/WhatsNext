import {
  fetchMoviePoster,
  fetchMoviesFromGenre,
  fetchTVShowsFromGenre,
} from "@/backend/movie";
import BackButton from "@/components/BackButton";
import PosterCard from "@/components/cards/PosterCard";
import { Movie, TVShow } from "@/components/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Dimensions, Platform } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const GenreScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const { genreId, genreName, selectedIndex } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;
  const windowHeight = Dimensions.get("window").height;

  const fetchMoviesAndTVShows = async () => {
    setMovies((await fetchMoviesFromGenre(genreId as string, 10)) as Movie[]);
    setTVShows(
      (await fetchTVShowsFromGenre(genreId as string, 10)) as TVShow[]
    );
  };

  useEffect(() => {
    fetchMoviesAndTVShows();
  }, []);

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView>
        <View className="flex-row items-center">
          <BackButton />
          <Text className="text-text-dark text-[32px] font-bold">
            {genreName}
          </Text>
        </View>

        {selectedIndex === "0" ? (
          <FlatList
            style={{
              marginBottom: 80,
              height: Platform.OS === "web" ? windowHeight : undefined,
            }}
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <PosterCard
                movie={item}
                posterPath={fetchMoviePoster(item.poster_path as string)}
                width={screenWidth / 3 - 20}
                height={(screenWidth / 3 - 20) * 1.5}
                tab={"(home)"}
              />
            )}
          />
        ) : (
          <FlatList
            style={{ marginBottom: 40 }}
            data={tvShows}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <PosterCard
                movie={item}
                posterPath={fetchMoviePoster(item.poster_path as string)}
                width={screenWidth / 3 - 20}
                height={(screenWidth / 3 - 20) * 1.5}
                tab={"(home)"}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default GenreScreen;

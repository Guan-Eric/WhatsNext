import {
  deleteFromWatchlist,
  fetchMoviePoster,
  fetchMoviesFromWatchlist,
} from "@/backend/movie";
import MovieCard from "@/components/cards/MovieCard";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Movie, TVShow } from "@/components/types";
import ToggleButton from "@/components/ToggleButton";

const WatchlistScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const windowHeight = Dimensions.get("window").height;

  const fetchMoviesAndTVShows = async () => {
    setMovies((await fetchMoviesFromWatchlist("movie")) as Movie[]);
    setTVShows((await fetchMoviesFromWatchlist("tv")) as TVShow[]);
  };

  useEffect(() => {
    fetchMoviesAndTVShows();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMoviesAndTVShows();
    }, [])
  );

  const options = (id: number) => [
    {
      title: "Remove from list",
      onPress: async () => {
        await deleteFromWatchlist(id.toString());
        await fetchMoviesAndTVShows();
      },
      containerStyle: { backgroundColor: "#dc3545" },
    },
  ];

  return (
    <View className="flex-1 bg-[#181818]">
      <SafeAreaView>
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold pl-5 text-black dark:text-white">
            Watchlist
          </Text>
          <Pressable
            onPress={() => {
              router.push({ pathname: "/(tabs)/(watchlist)/ProfileScreen" });
            }}
            className="pr-5 p-2"
          >
            <Ionicons name="person" size={28} color="#f8f9fa" />
          </Pressable>
        </View>
        {/* Button Group */}
        <View className="ml-4">
          <ToggleButton
            options={[
              { value: "0", label: "Movies", icon: "movie" },
              { value: "1", label: "TV Shows", icon: "television" },
            ]}
            selectedValue={selectedIndex.toString()}
            onValueChange={(value) => setSelectedIndex(Number(value))}
            size="sm"
          />
        </View>
        <ScrollView
          style={{
            height: Platform.OS === "web" ? windowHeight : "auto",
          }}
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          {selectedIndex == 0
            ? movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  posterPath={fetchMoviePoster(movie?.poster_path as string)}
                  options={options(movie.id)}
                  tab="(watchlist)"
                />
              ))
            : tvShows.map((tvShow) => (
                <MovieCard
                  key={tvShow.id}
                  movie={tvShow}
                  posterPath={fetchMoviePoster(tvShow?.poster_path as string)}
                  options={options(tvShow.id)}
                  tab="(watchlist)"
                />
              ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WatchlistScreen;

import {
  fetchMoviePoster,
  fetchMoviesFromMyList,
  fetchMoviesFromWatchlist,
} from "@/backend/movie";
import MovieCard from "@/components/cards/MovieCard";
import TVShowCard from "@/components/cards/TVShowCard";
import { ButtonGroup, Tab, useTheme } from "@rneui/themed";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";

const WatchlistScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme } = useTheme();

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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Text style={[styles.title, { color: theme.colors.black }]}>
          Watchlist
        </Text>
        <ScrollView style={{ marginBottom: 40 }}>
          <ButtonGroup
            containerStyle={{
              width: 200,
              height: 30,
              backgroundColor: theme.colors.grey0,
              borderWidth: 0,
              borderRadius: 10,
            }}
            buttons={["Movie", "TV Show"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
          />
          {selectedIndex == 0
            ? movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  posterPath={fetchMoviePoster(movie?.poster_path as string)}
                  theme={theme}
                  options={[]}
                />
              ))
            : tvShows.map((tvShow) => (
                <TVShowCard
                  key={-tvShow.id}
                  tvShow={tvShow}
                  posterPath={fetchMoviePoster(tvShow?.poster_path as string)}
                  theme={theme}
                  options={[]}
                />
              ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 20,
  },
});

export default WatchlistScreen;

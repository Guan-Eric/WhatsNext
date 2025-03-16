import {
  deleteFromMyList,
  fetchMoviePoster,
  fetchMoviesFromMyList,
} from "@/backend/movie";
import { fetchCast } from "@/backend/person";
import BackButton from "@/components/BackButton";
import MovieCard from "@/components/cards/MovieCard";
import { ButtonGroup, useTheme } from "@rneui/themed";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
} from "react-native";

const MyListScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const windowHeight = Dimensions.get("window").height;
  const { theme } = useTheme();

  const fetchMoviesAndTVShows = async () => {
    setMovies((await fetchMoviesFromMyList("movie")) as Movie[]);
    setTVShows((await fetchMoviesFromMyList("tv")) as TVShow[]);
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
        await deleteFromMyList(id.toString());
        await fetchMoviesAndTVShows();
      },
      containerStyle: { backgroundColor: theme.colors.error },
    },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            My List
          </Text>
        </View>
        <ScrollView
          style={{
            height: Platform.OS === "web" ? windowHeight : "auto",
          }}
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
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
                  options={options(movie.id)}
                  tab="(watchlist)"
                />
              ))
            : tvShows.map((tvShow) => (
                <MovieCard
                  key={tvShow.id}
                  movie={tvShow}
                  posterPath={fetchMoviePoster(tvShow?.poster_path as string)}
                  theme={theme}
                  options={options(tvShow.id)}
                  tab="(watchlist)"
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
  },
});

export default MyListScreen;

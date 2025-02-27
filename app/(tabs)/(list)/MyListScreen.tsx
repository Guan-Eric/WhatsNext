import { fetchMoviePoster, fetchMoviesFromMyList } from "@/backend/movie";
import MovieCard from "@/components/cards/MovieCard";
import { useTheme } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";

const MyListScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesList = (await fetchMoviesFromMyList("movie")) as Movie[];
      setMovies(moviesList);
    };

    fetchMovies();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <Text style={[styles.title, { color: theme.colors.black }]}>
          My List
        </Text>
        <ScrollView style={{ marginBottom: 40 }}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              posterPath={fetchMoviePoster(movie?.poster_path as string)}
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

export default MyListScreen;

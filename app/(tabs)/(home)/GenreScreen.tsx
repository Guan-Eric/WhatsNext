import {
  fetchMoviePoster,
  fetchMoviesFromGenre,
  fetchTVShowsFromGenre,
} from "@/backend/movie";
import BackButton from "@/components/BackButton";
import PosterCard from "@/components/cards/PosterCard";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const MyListScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const { theme } = useTheme();
  const { genreId, genreName, selectedIndex } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;
  const windowHeight = Dimensions.get("window").height;

  const fetchMoviesAndTVShows = async () => {
    setMovies((await fetchMoviesFromGenre(genreId as string)) as Movie[]);
    setTVShows((await fetchTVShowsFromGenre(genreId as string)) as TVShow[]);
  };

  useEffect(() => {
    fetchMoviesAndTVShows();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {genreName}
          </Text>
        </View>
        {selectedIndex == "0" ? (
          <FlatList
            style={{
              marginBottom: 80,
              height: Platform.OS === "web" ? windowHeight : "auto",
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

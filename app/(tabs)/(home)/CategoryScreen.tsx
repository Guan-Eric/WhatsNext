import {
  fetchMoviePoster,
  fetchMoviesFromCategory,
  fetchTVShowsFromCategory,
} from "@/backend/movie";
import BackButton from "@/components/BackButton";
import PosterCard from "@/components/cards/PosterCard";
import { ButtonGroup, useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const MyListScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme } = useTheme();
  const { category } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;

  const fetchMoviesAndTVShows = async () => {
    setMovies((await fetchMoviesFromCategory(category as string)) as Movie[]);
    setTVShows(
      (await fetchTVShowsFromCategory(category as string)) as TVShow[]
    );
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
            {category}
          </Text>
        </View>
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
        {selectedIndex == 0 ? (
          <FlatList
            style={{ marginBottom: 80 }}
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
            style={{ marginBottom: 80 }}
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

import {
  fetchMoviePoster,
  fetchMoviesFromCategory,
  fetchTVShowsFromCategory,
} from "@/backend/movie";
import BackButton from "@/components/BackButton";
import PosterCard from "@/components/cards/PosterCard";
import ToggleButton from "@/components/ToggleButton";
import { Movie, TVShow } from "@/components/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const CategoryScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { category } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;
  const windowHeight = Dimensions.get("window").height;

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
    <View className="flex-1 bg-background-dark">
      <SafeAreaView>
        {/* Header */}
        <View className="flex-row items-center">
          <BackButton />
          <Text className="text-text-dark text-[32px] font-bold">
            {category}
          </Text>
        </View>

        {/* Button Group */}
        <ToggleButton
          options={[
            { value: "0", label: "Movies", icon: "movie" },
            { value: "1", label: "TV Shows", icon: "television" },
          ]}
          selectedValue={selectedIndex.toString()}
          onValueChange={(value) => setSelectedIndex(Number(value))}
        />

        {/* Content */}
        {selectedIndex === 0 ? (
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

export default CategoryScreen;

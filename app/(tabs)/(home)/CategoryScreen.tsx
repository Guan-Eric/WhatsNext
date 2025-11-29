import {
  fetchMoviePoster,
  fetchMoviesFromCategory,
  fetchTVShowsFromCategory,
} from "@/backend/movie";
import BackButton from "@/components/BackButton";
import PosterCard from "@/components/cards/PosterCard";
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
        <View className="flex-row bg-grey-dark-0 rounded-[10px] w-[200px] h-[30px] overflow-hidden ml-5 mb-2">
          {["Movie", "TV Show"].map((button, index) => (
            <Pressable
              key={index}
              className={`flex-1 items-center justify-center ${
                selectedIndex === index ? "bg-primary" : ""
              }`}
              onPress={() => setSelectedIndex(index)}
            >
              <Text
                className={`text-sm font-['Lato_400Regular'] ${
                  selectedIndex === index
                    ? "text-white font-bold"
                    : "text-text-dark"
                }`}
              >
                {button}
              </Text>
            </Pressable>
          ))}
        </View>

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

import React, { Ref, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Button, CheckBox, Input, Slider, useTheme } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import { FetchMovieList, GenerateStringList } from "@/backend/ai";
import BackButton from "@/components/BackButton";
import Carousel from "react-native-reanimated-carousel";
import GeneratedMovieCard from "@/components/cards/GeneratedMovieCard";
import { fetchMoviePoster } from "@/backend/movie";

export default function GenerateScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieList, setMovieList] = useState<Movie[] | TVShow[]>([]);
  const { theme } = useTheme();
  const { list, type } = useLocalSearchParams();
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  const renderItem = ({ item }: { item: Movie | TVShow }) => (
    <GeneratedMovieCard
      movie={item}
      posterPath={fetchMoviePoster(item.poster_path as string)}
      theme={theme}
      type={type as "movie" | "tv"}
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
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            What's Next?
          </Text>
        </View>
        <Carousel
          containerStyle={{ marginTop: -30 }}
          autoPlayInterval={2000}
          data={
            type == "movie" ? (movieList as Movie[]) : (movieList as TVShow[])
          }
          height={screenHeight * 0.8}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Lato_700Bold",
    paddingLeft: 20,
  },
  input: {
    borderColor: "white",
    flex: 1,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
  planContainer: {
    marginTop: 30,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    height: 42,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputText: {
    color: "white",
    fontFamily: "Lato_400Regular",
    fontSize: 12,
  },
  inputRoundedContainer: {
    marginTop: 2,
    paddingLeft: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  checkboxRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  checkboxContainer: { width: "28%" },
  buttonContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  buttonTitle: {
    fontFamily: "Lato_700Bold",
  },
});

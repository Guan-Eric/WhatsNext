import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  Pressable,
} from "react-native";
import {
  deleteFromMyList,
  deleteFromWatchlist,
  fetchDetails,
  fetchWatchProviders,
  isAlreadySeen,
  isWatchlist,
  saveToMyList,
  saveToWatchlist,
} from "@/backend/movie";
import { fetchGenres } from "@/backend/genre";
import BackButton from "./BackButton";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import RatingModal from "./modal/RatingModal";
import { fetchCast } from "@/backend/person";
import PersonCard from "./cards/PersonCard";
import WatchProviderModal from "./modal/WatchProviderModal";
import { Ionicons } from "@expo/vector-icons";
import { Movie, TVShow, Genre, Person, WatchProvider } from "./types";

interface MovieDetailsProps {
  movieId: string;
  type: "movie" | "tv";
  posterPath: string;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieId,
  type,
  posterPath,
  tab,
}) => {
  const screenWidth = Dimensions.get("screen").width;
  const [movie, setMovie] = useState<Movie | TVShow>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [cast, setCast] = useState<Person[]>([]);
  const [isModelVisible, setIsModalVisible] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<boolean>(false);
  const [myList, setMyList] = useState<boolean>(false);
  const [watchModal, setWatchModal] = useState<boolean>(false);
  const [providers, setProviders] = useState<Record<string, WatchProvider[]>>(
    {}
  );

  const fetchMovieDetails = async () => {
    setMovie(await fetchDetails(movieId, type));
    setGenres(await fetchGenres(type));
    setWatchlist(await isWatchlist(movieId));
    setMyList(await isAlreadySeen(movieId));
    setCast(await fetchCast(Number(movieId), type));
    setProviders(await fetchWatchProviders(movieId, type, "US"));
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const getGenreNames = (genreIds: number[]) => {
    return genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name)
      .join(", ");
  };

  const topPosition =
    Platform.OS === "ios" ? 42 : (StatusBar.currentHeight || 0) + 12;
  const buttonTopPosition =
    Platform.OS === "ios" ? 40 : (StatusBar.currentHeight || 0) + 10;

  return (
    <View className="flex-1 bg-[#181818]">
      <ScrollView>
        <View>
          <View
            className="relative overflow-hidden"
            style={{
              width: screenWidth,
              height: screenWidth * 0.9,
            }}
          >
            <Image
              source={{ uri: posterPath }}
              className="absolute left-0 right-0 top-0"
              style={{
                width: screenWidth,
                height: screenWidth * 1.5,
              }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["#ffffff", "transparent"]}
              className="absolute top-0 left-0 right-0 h-[50px]"
            />
            <LinearGradient
              colors={["transparent", "#ffffff"]}
              className="absolute bottom-0 left-0 right-0 h-[100px]"
            />
            <LinearGradient
              colors={["transparent", "#ffffff"]}
              className="absolute top-0 left-0 bottom-0 w-[50px]"
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
            />
            <LinearGradient
              colors={["transparent", "#ffffff"]}
              className="absolute top-0 right-0 bottom-0 w-[50px]"
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>

          <View className="absolute left-0 z-10" style={{ top: topPosition }}>
            <BackButton />
          </View>

          <View
            className="absolute right-0 z-10 flex-row"
            style={{ top: buttonTopPosition }}
          >
            <Pressable
              onPress={() => {
                if (movie) {
                  if (watchlist) {
                    deleteFromWatchlist(movie.id.toString());
                    setWatchlist(false);
                  } else {
                    saveToWatchlist(movie.id.toString(), type);
                    setWatchlist(true);
                  }
                }
              }}
              className="rounded-full p-2 bg-grey-dark-1/50"
            >
              <Ionicons
                name={watchlist ? "bookmark" : "bookmark-outline"}
                size={24}
                color="#f8f9fa"
              />
            </Pressable>
          </View>
        </View>

        {movie?.hasOwnProperty("title") ? (
          <>
            <Text className="text-3xl font-bold my-2.5 text-center flex-wrap text-black dark:text-white">
              {(movie as Movie)?.title}
            </Text>
            <Text className="text-center flex-wrap text-black dark:text-white">
              {(movie as Movie)?.release_date.slice(0, 4) +
                " • " +
                getGenreNames(
                  (movie as Movie)?.genres.map((genre) => genre.id)
                ) +
                " • " +
                (Math.floor((movie as Movie)?.runtime / 60) +
                  "h " +
                  ((movie as Movie)?.runtime % 60) +
                  "m")}
            </Text>
          </>
        ) : movie?.hasOwnProperty("name") ? (
          <>
            <Text className="text-3xl font-bold my-2.5 text-center flex-wrap text-black dark:text-white">
              {(movie as TVShow)?.name}
            </Text>
            <Text className="text-center flex-wrap text-black dark:text-white">
              {getGenreNames(
                (movie as TVShow)?.genres.map((genre) => genre.id)
              ) +
                " • " +
                (movie as TVShow)?.number_of_seasons +
                " season" +
                ((movie as TVShow)?.number_of_seasons > 1 ? "s" : "")}
            </Text>
          </>
        ) : null}

        <View className="flex-row self-center">
          <Pressable
            onPress={() => setWatchModal(true)}
            className="w-[150px] self-center mt-2.5 rounded-2xl mx-2.5 py-3 items-center bg-primary-dark"
          >
            <Text className="text-white font-semibold">Watch Now</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (myList) {
                deleteFromMyList(movieId);
                setMyList(false);
              } else {
                setIsModalVisible(true);
              }
            }}
            className="w-[150px] self-center mt-2.5 rounded-2xl mx-2.5 py-3 items-center flex-row justify-center bg-grey-dark-1"
          >
            {myList ? (
              <Ionicons name="checkmark" size={20} color="#28a745" />
            ) : (
              <Text className="text-black dark:text-white">Already Seen?</Text>
            )}
          </Pressable>
        </View>

        <Text className="text-base mx-5 my-2.5 text-center text-black dark:text-white">
          {movie?.overview}
        </Text>

        {cast?.length > 0 ? (
          <Text className="text-2xl font-bold pl-2.5 text-black dark:text-white">
            Cast
          </Text>
        ) : null}

        <FlatList
          data={cast}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            item.profile_path != null ? (
              <View className="flex-col">
                <PersonCard
                  personId={item?.id}
                  profilePath={item?.profile_path as string}
                  width={140}
                  height={210}
                  tab={tab}
                  name={item?.name}
                />
              </View>
            ) : null
          }
        />
      </ScrollView>

      <RatingModal
        modalVisible={isModelVisible}
        onClose={() => setIsModalVisible(false)}
        save={(rating: number) => {
          if (movie) {
            saveToMyList(movie.id.toString(), rating, type);
          }
          setIsModalVisible(false);
          setMyList(true);
        }}
      />

      <WatchProviderModal
        modalVisible={watchModal}
        onClose={() => setWatchModal(false)}
        providers={providers}
      />
    </View>
  );
};

export default MovieDetails;

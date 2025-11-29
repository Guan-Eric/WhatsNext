import React, { useState } from "react";
import { View, Text, Image, Dimensions, Pressable } from "react-native";
import {
  deleteFromMyList,
  deleteFromWatchlist,
  saveToMyList,
  saveToWatchlist,
} from "@/backend/movie";
import RatingModal from "../modal/RatingModal";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Movie, TVShow } from "../types";

interface MovieCardProps {
  movie: Movie | TVShow;
  posterPath: string;
  type: "movie" | "tv";
  tab: "(generate)" | "(home)" | "(list)" | "(watchlist)";
}

const GeneratedMovieCard: React.FC<MovieCardProps> = ({
  movie,
  posterPath,
  type,
}) => {
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [myList, setMyList] = useState(false);
  const screenWidth = Dimensions.get("screen").width;

  return (
    <View className="rounded-2xl bg-grey-dark-1 border border-grey-1 dark:border-grey-dark-1">
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/(tabs)/(generate)/MovieDetailsScreen`,
            params: {
              movieId: movie.id,
              posterPath: posterPath,
              type: movie.hasOwnProperty("title") ? "movie" : "tv",
            },
          });
        }}
      >
        <Image
          source={{ uri: posterPath }}
          className="self-center rounded-lg"
          style={{
            width: screenWidth * 0.84,
            height: screenWidth * 0.84 * 1.5,
          }}
        />

        <Text className="text-lg font-bold mt-2.5 text-black dark:text-white">
          {"title" in movie ? movie.title : movie.name}
        </Text>

        <View className="flex-row flex-wrap mt-1">
          {movie.genres?.map((genre, index) => (
            <Text
              key={index}
              className="bg-gray-700 text-black dark:text-white rounded-md px-1.5 py-1 m-0.5"
            >
              {genre.name}
            </Text>
          ))}
        </View>

        <View className="pt-2.5 flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              if (myList) {
                deleteFromMyList(movie.id.toString());
                setMyList(false);
              } else {
                setIsModalVisible(true);
              }
            }}
            className="w-[150px] self-center rounded-2xl py-2 items-center bg-grey-dark-1"
          >
            {myList ? (
              <Ionicons name="checkmark" size={20} color="#28a745" />
            ) : (
              <Text className="text-black dark:text-white">Already Seen?</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              if (watchlist) {
                deleteFromWatchlist(movie.id.toString());
                setWatchlist(false);
              } else {
                saveToWatchlist(movie.id.toString(), type);
                setWatchlist(true);
              }
            }}
            className="p-2 bg-grey-dark-1"
          >
            <Ionicons
              name={watchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#000"
            />
          </Pressable>
        </View>

        <RatingModal
          modalVisible={isModelVisible}
          onClose={() => setIsModalVisible(false)}
          save={(rating: number) => {
            saveToMyList(movie.id.toString(), rating, type);
            setIsModalVisible(false);
            setMyList(true);
          }}
        />
      </Pressable>
    </View>
  );
};

export default GeneratedMovieCard;

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
    <View className="rounded-2xl bg-grey-dark-1 border border-primary p-4">
      <Pressable
        onPress={() => {
          router.push({
            pathname: `/(tabs)/(generate)/MovieDetailsScreen`,
            params: {
              movieId: movie.id,
              posterPath: posterPath,
              type: "title" in movie ? "movie" : "tv",
            },
          });
        }}
      >
        <Image
          source={{ uri: posterPath }}
          className="self-center rounded-xl mt-4"
          style={{
            width: screenWidth * 0.85,
            height: screenWidth * 0.85 * 1.45,
          }}
        />

        <Text className="text-xl font-semibold mt-4 ml-4 text-text-dark">
          {"title" in movie ? movie.title : movie.name}
        </Text>

        <View className="flex-row flex-wrap mt-2 ml-4">
          {movie.genres?.map((genre, index) => (
            <Text
              key={index}
              className="bg-grey-dark-2 text-text-dark rounded-lg px-2 py-1 mr-2 mb-2 text-xs"
            >
              {genre.name}
            </Text>
          ))}
        </View>

        <View className="flex-row items-center justify-between mt-4 px-4">
          {/* Already Seen Button */}
          <Pressable
            onPress={() => {
              if (myList) {
                deleteFromMyList(movie.id.toString());
                setMyList(false);
              } else {
                setIsModalVisible(true);
              }
            }}
            className="w-[150px] rounded-2xl py-2 items-center bg-grey-dark-2 border border-primary"
          >
            {myList ? (
              <Ionicons name="checkmark" size={20} color="#28a745" />
            ) : (
              <Text className="text-primary text-sm">Already Seen?</Text>
            )}
          </Pressable>

          {/* Watchlist Button */}
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
            className="p-3 bg-grey-dark-2 rounded-2xl"
          >
            <Ionicons
              name={watchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color={watchlist ? "#ffb400" : "#ffb400"}
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

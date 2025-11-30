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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Movie, TVShow } from "../types";
import { LinearGradient } from "expo-linear-gradient";

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
    <View className="flex-1 px-4">
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
        className="bg-grey-dark-1 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Poster Image with Gradient Overlay */}
        <View className="relative">
          <Image
            source={{ uri: posterPath }}
            className="w-full rounded-t-3xl"
            style={{
              height: screenWidth * 1.1,
            }}
            resizeMode="cover"
          />

          {/* Bottom Gradient for text readability */}
          <LinearGradient
            colors={["transparent", "rgba(24, 24, 24, 0.95)"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          {/* Bookmark Icon on Poster */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              if (watchlist) {
                deleteFromWatchlist(movie.id.toString());
                setWatchlist(false);
              } else {
                saveToWatchlist(movie.id.toString(), type);
                setWatchlist(true);
              }
            }}
            className="absolute top-4 right-4 bg-grey-dark-0/80 backdrop-blur-sm rounded-full p-3"
          >
            <Ionicons
              name={watchlist ? "bookmark" : "bookmark-outline"}
              size={28}
              color="#ffb400"
            />
          </Pressable>

          {/* Rating Badge */}
          {movie.vote_average && (
            <View className="absolute top-4 left-4 bg-grey-dark-0/90 backdrop-blur-sm rounded-full px-3 py-2 flex-row items-center">
              <MaterialCommunityIcons name="star" size={16} color="#ffb400" />
              <Text className="text-white font-bold ml-1">
                {movie.vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View className="p-5">
          {/* Title */}
          <Text
            className="text-2xl font-bold text-white mb-2"
            numberOfLines={2}
          >
            {"title" in movie ? movie.title : movie.name}
          </Text>

          {/* Release Year & Type */}
          <View className="flex-row items-center mb-3">
            <View className="bg-primary/20 rounded-full px-3 py-1 mr-2">
              <Text className="text-primary text-xs font-bold">
                {"title" in movie ? "MOVIE" : "TV SHOW"}
              </Text>
            </View>
            {"release_date" in movie && movie.release_date && (
              <Text className="text-grey-dark-5 text-sm">
                {movie.release_date.slice(0, 4)}
              </Text>
            )}
            {"first_air_date" in movie && movie.first_air_date && (
              <Text className="text-grey-dark-5 text-sm">
                {movie.first_air_date.slice(0, 4)}
              </Text>
            )}
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap mb-4">
            {movie.genres?.slice(0, 3).map((genre, index) => (
              <View
                key={index}
                className="bg-grey-dark-2 rounded-lg px-3 py-1.5 mr-2 mb-2"
              >
                <Text className="text-grey-dark-5 text-xs font-medium">
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          {movie.overview && (
            <Text
              className="text-grey-dark-5 text-sm leading-5 mb-4"
              numberOfLines={3}
            >
              {movie.overview}
            </Text>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            {/* Already Seen Button */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                if (myList) {
                  deleteFromMyList(movie.id.toString());
                  setMyList(false);
                } else {
                  setIsModalVisible(true);
                }
              }}
              className={`flex-1 rounded-2xl py-3.5 items-center justify-center ${
                myList
                  ? "bg-success/20 border-2 border-success"
                  : "bg-grey-dark-2 border-2 border-grey-dark-3"
              }`}
            >
              {myList ? (
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                  <Text className="text-success font-bold ml-2">Watched</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="eye-check-outline"
                    size={20}
                    color="#adb5bd"
                  />
                  <Text className="text-grey-dark-5 font-semibold ml-2">
                    Mark as Seen
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Info Button */}
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
              className="bg-primary rounded-2xl px-6 py-3.5 items-center justify-center"
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color="#fff"
              />
            </Pressable>
          </View>
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

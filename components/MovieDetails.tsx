import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Button } from "@rneui/themed";
import { fetchDetails } from "@/backend/movie";
import { fetchGenres } from "@/backend/genre";
import BackButton from "./BackButton";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";

interface MovieDetailsProps {
  movieId: string;
  type: "movie" | "tv";
  posterPath: string;
  theme: any;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieId,
  type,
  posterPath,
  theme,
}) => {
  const screenWidth = Dimensions.get("screen").width;
  const [movie, setMovie] = useState<Movie | TVShow>();
  const [genres, setGenres] = useState<Genre[]>([]);

  const fetchMovieDetails = async () => {
    setMovie(await fetchDetails(movieId, type));
    setGenres(await fetchGenres(type));
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView>
        <View>
          {/* Image Container */}
          <View
            style={[
              styles.imageContainer,
              {
                width: screenWidth,
                height: screenWidth * 0.9,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            {/* Image */}
            <Image
              source={{ uri: posterPath }}
              style={[
                styles.poster,
                {
                  width: screenWidth,
                  height: screenWidth * 1.5,
                  top: 0,
                },
              ]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[theme.colors.background, "transparent"]}
              style={styles.gradientTop}
            />
            {/* Bottom Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientBottom}
            />
            {/* Left Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientLeft}
              start={{ x: 1, y: 0.5 }}
              end={{ x: 0, y: 0.5 }}
            />
            {/* Right Gradient */}
            <LinearGradient
              colors={["transparent", theme.colors.background]}
              style={styles.gradientRight}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>
        </View>
        {movie?.hasOwnProperty("title") ? (
          <>
            <Text style={{ color: theme.colors.black }}>
              {(movie as Movie)?.title}
            </Text>
            <Text style={{ color: theme.colors.black }}>
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
            <Text style={{ color: theme.colors.black }}>
              {(movie as TVShow)?.name}
            </Text>
            <Text style={{ color: theme.colors.black }}>
              {getGenreNames(
                (movie as TVShow)?.genres.map((genre) => genre.id)
              ) +
                " • " +
                (movie as TVShow)?.number_of_seasons +
                " seasons"}
            </Text>
          </>
        ) : null}
        <Text style={{ color: theme.colors.black }}>{movie?.overview}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  poster: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50, // Adjust height for the blur effect
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust height for the blur effect
  },
  gradientLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 50, // Adjust width for the blur effect
  },
  gradientRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 50, // Adjust width for the blur effect
  },
});

export default MovieDetails;

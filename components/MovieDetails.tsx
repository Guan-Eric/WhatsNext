import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Button, CheckBox, Icon } from "@rneui/themed";
import {
  deleteFromMyList,
  deleteFromWatchlist,
  fetchDetails,
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
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [myList, setMyList] = useState(false);

  const fetchMovieDetails = async () => {
    setMovie(await fetchDetails(movieId, type));
    setGenres(await fetchGenres(type));
    setWatchlist(await isWatchlist(movieId));
    setMyList(await isAlreadySeen(movieId));
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
          <View style={styles.buttonsContainer}>
            <CheckBox
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
              containerStyle={{
                backgroundColor: `${theme.colors.grey1}80`,
                borderRadius: 50,
              }}
              checked={watchlist}
              uncheckedIcon={<Icon name="bookmark-outline" />}
              checkedIcon={<Icon name="bookmark" />}
            />
          </View>
        </View>
        {movie?.hasOwnProperty("title") ? (
          <>
            <Text style={[styles.title, { color: theme.colors.black }]}>
              {(movie as Movie)?.title}
            </Text>
            <Text
              style={{
                color: theme.colors.black,
                textAlign: "center",
                flexWrap: "wrap",
              }}
            >
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
            <Text style={[styles.title, { color: theme.colors.black }]}>
              {(movie as TVShow)?.name}
            </Text>
            <Text
              style={{
                color: theme.colors.black,
                textAlign: "center",
                flexWrap: "wrap",
              }}
            >
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
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <Button
            title="Watch Now"
            buttonStyle={{
              width: 150,
              alignSelf: "center",
              marginTop: 10,
              borderRadius: 20,
              marginHorizontal: 10,
            }}
          />
          <Button
            title={myList ? "" : "Already Seen?"}
            buttonStyle={{
              width: 150,
              alignSelf: "center",
              marginTop: 10,
              borderRadius: 20,
              marginHorizontal: 10,
              backgroundColor: theme.colors.grey1,

              alignItems: "center", // Center the content
            }}
            onPress={() => {
              if (myList) {
                deleteFromMyList(movieId);
                setMyList(false);
              } else {
                setIsModalVisible(true);
              }
            }}
            icon={
              myList ? (
                <Icon name={"check"} color={theme.colors.success} />
              ) : undefined
            }
          />
        </View>
        <Text style={[styles.description, { color: theme.colors.black }]}>
          {movie?.overview}
        </Text>
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
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? 42
        : StatusBar.currentHeight !== undefined
        ? StatusBar.currentHeight + 12
        : 12,
    left: 0,
    zIndex: 1,
  },
  buttonsContainer: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? 40
        : StatusBar.currentHeight !== undefined
        ? StatusBar.currentHeight + 10
        : 10,
    right: 0,
    zIndex: 1,
    flexDirection: "row",
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    flexWrap: "wrap",
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default MovieDetails;

import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Card } from "@rneui/themed";
import { saveToMyList, saveToWatchlist } from "@/backend/movie";
import RatingModal from "../modal/RatingModal";

interface MovieCardProps {
  movie: Movie | TVShow;
  posterPath: string;
  theme: any;
  type: "movie" | "tv";
}

const GeneratedMovieCard: React.FC<MovieCardProps> = ({
  movie,
  posterPath,
  theme,
  type,
}) => {
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [listDisabled, setListDisabled] = useState(false);
  const [watchDisabled, setWatchDisabled] = useState(false);

  return (
    <Card
      containerStyle={[
        styles.card,
        {
          backgroundColor: theme.colors.grey1,
          borderColor: theme.colors.grey1,
        },
      ]}
    >
      <Image source={{ uri: posterPath }} style={styles.poster} />
      <Text style={[styles.title, { color: theme.colors.black }]}>
        {"title" in movie ? movie.title : movie.name}
      </Text>
      <View style={styles.genresContainer}>
        {movie.genres?.map((genre, index) => (
          <Text key={index} style={styles.genre}>
            {genre.name}
          </Text>
        ))}
      </View>
      <View
        style={{
          marginTop: 10,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "space-between",
        }}
      >
        <Button
          disabled={watchDisabled}
          title={"Add to Watchlist"}
          buttonStyle={{ borderRadius: 30 }}
          onPress={() => {
            saveToWatchlist(movie.id.toString(), type);
            setListDisabled(false);
            setWatchDisabled(true);
          }}
        />
        <Button
          disabled={listDisabled}
          title={"Already seen?"}
          buttonStyle={{ borderRadius: 30 }}
          onPress={() => setIsModalVisible(true)}
        />
      </View>
      <RatingModal
        modalVisible={isModelVisible}
        onClose={() => setIsModalVisible(false)}
        save={(rating: number) => {
          saveToMyList(movie.id.toString(), rating, type);
          setIsModalVisible(false);
          setListDisabled(true);
          setWatchDisabled(false);
        }}
        theme={theme}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
  },
  poster: {
    width: "100%",
    height: "82%",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  genre: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 5,
    margin: 2,
  },
});

export default GeneratedMovieCard;

import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Button, Card, CheckBox, Icon } from "@rneui/themed";
import {
  deleteFromMyList,
  deleteFromWatchlist,
  saveToMyList,
  saveToWatchlist,
} from "@/backend/movie";
import RatingModal from "../modal/RatingModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MovieCardProps {
  movie: Movie | TVShow;
  posterPath: string;
  theme: any;
  type: "movie" | "tv";
  tab: "(generate)" | "(home)" | "(list)" | "(watchlist)";
}

const GeneratedMovieCard: React.FC<MovieCardProps> = ({
  movie,
  posterPath,
  theme,
  type,
}) => {
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [myList, setMyList] = useState(false);
  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

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
      <Image
        source={{ uri: posterPath }}
        style={[
          styles.poster,
          { width: screenWidth * 0.84, height: screenWidth * 0.84 * 1.5 },
        ]}
      />
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
          paddingTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          title={myList ? "" : "Already Seen?"}
          type="clear"
          titleStyle={{ color: theme.colors.black }}
          buttonStyle={{
            width: 150,
            alignSelf: "center",
            borderRadius: 20,
            backgroundColor: theme.colors.grey1,
          }}
          onPress={() => {
            if (myList) {
              deleteFromMyList(movie.id.toString());
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
        <CheckBox
          onPress={() => {
            if (watchlist) {
              deleteFromWatchlist(movie.id.toString());
              setWatchlist(false);
            } else {
              saveToWatchlist(movie.id.toString(), type);
              setWatchlist(true);
            }
          }}
          containerStyle={{ backgroundColor: theme.colors.grey1 }}
          checked={watchlist}
          uncheckedIcon={<Icon name="bookmark-outline" />}
          checkedIcon={<Icon name="bookmark" />}
        />
      </View>
      <RatingModal
        modalVisible={isModelVisible}
        onClose={() => setIsModalVisible(false)}
        save={(rating: number) => {
          saveToMyList(movie.id.toString(), rating, type);
          setIsModalVisible(false);
          setMyList(true);
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
    alignSelf: "center",
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

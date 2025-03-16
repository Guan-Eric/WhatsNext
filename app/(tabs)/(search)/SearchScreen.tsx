import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { Avatar, SearchBar, useTheme } from "@rneui/themed";
import BackButton from "../../../components/BackButton";
import { fetchMoviePoster, multiSearch } from "@/backend/movie";
import PersonCard from "@/components/cards/PersonCard";
import PosterCard from "@/components/cards/PosterCard";

function SearchScreen() {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("screen").width;

  const fetchResults = async () => {
    setResults(await multiSearch(search));
  };

  useEffect(() => {
    fetchResults();
  }, [search]);

  const renderItem = ({ item }: { item: Movie | TVShow | Person }) => {
    if ("title" in item) {
      return (
        <PosterCard
          movie={item as Movie}
          posterPath={fetchMoviePoster((item as Movie).poster_path as string)}
          width={screenWidth / 3 - 20}
          height={(screenWidth / 3 - 20) * 1.5}
          tab={"(search)"}
        />
      );
    } else if ("profile_path" in item) {
      return (
        <PersonCard
          personId={(item as Person)?.id}
          profilePath={fetchMoviePoster(
            (item as Person).profile_path as string
          )}
          width={screenWidth / 3 - 20}
          height={(screenWidth / 3 - 20) * 1.5}
          tab={"(search)"}
          theme={theme}
          name={item?.name}
        />
      );
    } else if ("name" in item) {
      return (
        <PosterCard
          movie={item as TVShow}
          posterPath={fetchMoviePoster((item as TVShow).poster_path as string)}
          width={screenWidth / 3 - 20}
          height={(screenWidth / 3 - 20) * 1.5}
          tab={"(search)"}
        />
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <SafeAreaView>
          <Text
            style={{
              color: theme.colors.black,
              fontFamily: "Lato_700Bold",
              fontSize: 32,
              fontWeight: "bold",
              paddingLeft: 20,
            }}
          >
            Search
          </Text>

          <SearchBar
            containerStyle={{
              backgroundColor: theme.colors.background,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputContainerStyle={{
              borderRadius: 10,
            }}
            placeholder="Type Here..."
            onChangeText={(text) => setSearch(text)}
            onClear={() => setSearch("")}
            value={search}
          />
          <FlatList
            style={{ marginBottom: 80 }}
            numColumns={3}
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderItem({ item }) || null}
          />
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default SearchScreen;

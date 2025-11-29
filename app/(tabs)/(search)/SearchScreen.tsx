import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { fetchMoviePoster, multiSearch } from "@/backend/movie";
import PersonCard from "@/components/cards/PersonCard";
import PosterCard from "@/components/cards/PosterCard";
import { Ionicons } from "@expo/vector-icons";
import { Movie, TVShow, Person } from "@/components/types";

function SearchScreen() {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<(Movie | TVShow | Person)[]>([]);
  const screenWidth = Dimensions.get("screen").width;
  const windowHeight = Dimensions.get("window").height;

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
    <View className="flex-1 bg-[#181818]">
      <SafeAreaView>
        <Text className="text-black dark:text-white font-bold text-3xl pl-5">
          Search
        </Text>

        {/* Search Bar */}
        <View className="bg-[#181818] px-3 py-2">
          <View className="flex-row items-center bg-grey-dark-0 rounded-lg px-3 h-12">
            <Ionicons
              name="search"
              size={20}
              color="#6c757d"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 text-black dark:text-white"
              placeholder="Type Here..."
              placeholderTextColor="#6c757d"
              onChangeText={(text) => setSearch(text)}
              value={search}
            />
            {search.length > 0 && (
              <Ionicons
                name="close-circle"
                size={20}
                color="#6c757d"
                onPress={() => setSearch("")}
              />
            )}
          </View>
        </View>

        <FlatList
          className="mb-[100px]"
          style={{
            height: Platform.OS === "web" ? windowHeight : "auto",
          }}
          numColumns={3}
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderItem({ item }) || null}
        />
      </SafeAreaView>
    </View>
  );
}

export default SearchScreen;

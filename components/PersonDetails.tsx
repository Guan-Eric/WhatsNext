import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  SafeAreaView,
} from "react-native";
import BackButton from "./BackButton";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { fetchCast, fetchKnownFor, fetchPersonDetails } from "@/backend/person";
import { router } from "expo-router";
import PersonCard from "./cards/PersonCard";
import MovieCard from "./cards/MovieCard";
import PosterCard from "./cards/PosterCard";

interface PersonDetailsProps {
  personId: number;
  profilePath: string;
  theme: any;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const PersonDetails: React.FC<PersonDetailsProps> = ({
  personId,
  profilePath,
  theme,
  tab,
}) => {
  const screenWidth = Dimensions.get("screen").width;
  const [person, setPerson] = useState<Person>();
  const [knownFor, setKnownFor] = useState<(Movie | TVShow)[]>([]);

  const fetchPerson = async () => {
    setPerson(await fetchPersonDetails(personId));
    setKnownFor(await fetchKnownFor(personId));
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <ScrollView>
          <View>
            <BackButton />
            <Image
              source={{ uri: profilePath }}
              style={{
                alignSelf: "center",
                width: 140,
                height: 210,
                borderRadius: 20,
              }}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: theme.colors.black }]}>
            {person?.name}
          </Text>
          {knownFor?.length > 0 ? (
            <Text style={[styles.subtitle, { color: theme.colors.black }]}>
              Known For
            </Text>
          ) : null}
          <FlatList
            data={knownFor}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              item.poster_path != null ? (
                <View style={{ flexDirection: "column" }}>
                  <PosterCard
                    movie={item}
                    posterPath={item?.poster_path as string}
                    width={140}
                    height={210}
                    tab={tab}
                  />
                  <Text
                    style={{
                      color: theme.colors.black,
                      textAlign: "center",
                      flexWrap: "wrap",
                      paddingBottom: 10,
                    }}
                  >
                    {"title" in item ? item.title : item.name}
                  </Text>
                </View>
              ) : null
            }
          />
          <Text style={[styles.subtitle, { color: theme.colors.black }]}>
            Biography
          </Text>
          <Text style={[styles.description, { color: theme.colors.black }]}>
            {person?.biography}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default PersonDetails;

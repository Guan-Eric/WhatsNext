import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, SafeAreaView } from "react-native";
import BackButton from "./BackButton";
import { ScrollView } from "react-native-gesture-handler";
import { fetchKnownFor, fetchPersonDetails } from "@/backend/person";
import PosterCard from "./cards/PosterCard";
import { Person, Movie, TVShow } from "./types";

interface PersonDetailsProps {
  personId: number;
  profilePath: string;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const PersonDetails: React.FC<PersonDetailsProps> = ({
  personId,
  profilePath,
  tab,
}) => {
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
    <View className="flex-1 bg-[#181818]">
      <SafeAreaView>
        <ScrollView>
          <View>
            <BackButton />
            <Image
              source={{ uri: profilePath }}
              className="self-center w-[140px] h-[210px] rounded-2xl"
              resizeMode="contain"
            />
          </View>

          <Text className="text-3xl font-bold my-2.5 text-center flex-wrap text-black dark:text-white">
            {person?.name}
          </Text>

          {knownFor?.length > 0 ? (
            <Text className="text-2xl font-bold pl-5 text-black dark:text-white">
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
                <View className="flex-col">
                  <PosterCard
                    movie={item}
                    posterPath={item?.poster_path as string}
                    width={140}
                    height={210}
                    tab={tab}
                  />
                  <Text className="text-center flex-wrap pb-2.5 text-black dark:text-white">
                    {"title" in item ? item.title : item.name}
                  </Text>
                </View>
              ) : null
            }
          />

          <Text className="text-2xl font-bold pl-5 text-black dark:text-white">
            Biography
          </Text>

          <Text className="text-base mx-5 my-2.5 text-center text-black dark:text-white">
            {person?.biography}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PersonDetails;

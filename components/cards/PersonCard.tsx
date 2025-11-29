import React from "react";
import { Image, Text, Pressable, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface MovieCardProps {
  personId: number;
  profilePath: string;
  width: number;
  height: number;
  name: string;
  tab: "(generate)" | "(home)" | "(watchlist)" | "(search)";
}

const PersonCard: React.FC<MovieCardProps> = ({
  personId,
  profilePath,
  width,
  height,
  name,
  tab,
}) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: `/(tabs)/${tab}/PersonDetailsScreen`,
          params: {
            personId: personId,
            profilePath: profilePath,
          },
        })
      }
    >
      <View className="relative">
        <Image
          source={{ uri: profilePath }}
          className="rounded-lg"
          style={{ width: width, height: height }}
        />
        {name != null ? (
          <>
            <LinearGradient
              colors={["transparent", "#ffffff"]}
              className="absolute bottom-0 left-0 right-0 h-[100px]"
            />
            <Text className="absolute text-center flex-wrap pb-2.5 bottom-2.5 text-black dark:text-white">
              {name}
            </Text>
          </>
        ) : null}
      </View>
    </Pressable>
  );
};

export default PersonCard;

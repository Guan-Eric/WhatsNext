import { fetchGenres } from "@/backend/genre";
import {
  fetchMoviePoster,
  fetchNowPlaying,
  fetchOnTheAir,
  fetchPopular,
  fetchTrending,
} from "@/backend/movie";
import { getUser, updateTermsCondition } from "@/backend/user";
import PosterCard from "@/components/cards/PosterCard";
import TermsConditionModal from "@/components/modal/TermsConditionModal";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Movie, TVShow, Genre } from "@/components/types";

const HomeScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [onTheAirTVShows, setOnTheAirTVShows] = useState<TVShow[]>([]);
  const [termsCondition, setTermsCondition] = useState<boolean>(false);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const windowHeight = Dimensions.get("window").height;

  const fetchMoviesAndTVShows = async () => {
    setPopularMovies((await fetchPopular("movie", 2)) as Movie[]);
    setPopularTVShows((await fetchPopular("tv", 2)) as TVShow[]);
    setNowPlayingMovies((await fetchNowPlaying(2)) as Movie[]);
    setOnTheAirTVShows((await fetchOnTheAir(2)) as TVShow[]);
    setMovieGenres((await fetchGenres("movie")) as Genre[]);
    setTrendingMovies((await fetchTrending("movie", "week", 2)) as Movie[]);
    setTrendingTVShows((await fetchTrending("tv", "week", 2)) as TVShow[]);
    setTVGenres((await fetchGenres("tv")) as Genre[]);
  };

  const handleTermsCondition = () => {
    updateTermsCondition();
    setTermsCondition(false);
  };

  const getTermsCondition = async () => {
    const user = await getUser(FIREBASE_AUTH.currentUser.uid);
    setTermsCondition(user ? user.showTermsCondition : false);
  };

  useEffect(() => {
    fetchMoviesAndTVShows();
    getTermsCondition();
  }, []);

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView>
        <ScrollView
          style={{ height: Platform.OS === "web" ? windowHeight : undefined }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header with Title and Button Group */}
          <View className="flex-row items-center justify-between px-5">
            <Text className="text-text-dark text-[32px] font-bold">Home</Text>

            {/* Button Group */}
            <View className="flex-row bg-grey-dark-0 rounded-[10px] w-[200px] h-[30px] overflow-hidden">
              {["Movie", "TV Show"].map((button, index) => (
                <Pressable
                  key={index}
                  className={`flex-1 items-center justify-center ${
                    selectedIndex === index ? "bg-primary" : ""
                  }`}
                  onPress={() => setSelectedIndex(index)}
                >
                  <Text
                    className={`text-sm font-['Lato_400Regular'] ${
                      selectedIndex === index
                        ? "text-white font-bold"
                        : "text-text-dark"
                    }`}
                  >
                    {button}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Genres Section */}
          <Text className="text-text-dark text-2xl font-bold pl-5 mt-4">
            Genres
          </Text>

          {selectedIndex === 0 ? (
            <FlatList
              data={movieGenres}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(movie) => movie.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(home)/GenreScreen",
                      params: {
                        genreId: item.id,
                        genreName: item.name,
                        selectedIndex: selectedIndex,
                      },
                    })
                  }
                  className="bg-grey-dark-1 rounded-[20px] px-4 py-2 ml-2 my-1 active:opacity-80"
                >
                  <Text className="text-text-dark font-['Lato_400Regular']">
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          ) : (
            <FlatList
              data={tvGenres}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(tv) => tv.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(home)/GenreScreen",
                      params: {
                        genreId: item.id,
                        genreName: item.name,
                        selectedIndex: selectedIndex,
                      },
                    })
                  }
                  className="bg-grey-dark-1 rounded-[20px] px-4 py-2 ml-2 my-1 active:opacity-80"
                >
                  <Text className="text-text-dark font-['Lato_400Regular']">
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}

          {/* Most Popular Section */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/CategoryScreen",
                params: { category: "Most Popular" },
              })
            }
            className="flex-row items-center self-start pl-2 active:opacity-60"
          >
            <Text className="text-text-dark text-2xl font-bold pl-2">
              Most Popular
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#f8f9fa"
            />
          </Pressable>

          {selectedIndex === 0 ? (
            <FlatList
              data={popularMovies}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(movie) => movie.id.toString()}
              renderItem={({ item }) => (
                <PosterCard
                  posterPath={fetchMoviePoster(item.poster_path as string)}
                  movie={item}
                  width={140}
                  height={210}
                  tab={"(home)"}
                />
              )}
            />
          ) : (
            <FlatList
              data={popularTVShows}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(tv) => tv.id.toString()}
              renderItem={({ item }) => (
                <PosterCard
                  posterPath={fetchMoviePoster(item.poster_path as string)}
                  movie={item}
                  width={140}
                  height={210}
                  tab={"(home)"}
                />
              )}
            />
          )}

          {/* Trending Section */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/CategoryScreen",
                params: { category: "Trending" },
              })
            }
            className="flex-row items-center self-start pl-2 active:opacity-60"
          >
            <Text className="text-text-dark text-2xl font-bold pl-2">
              Trending
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#f8f9fa"
            />
          </Pressable>

          {selectedIndex === 0 ? (
            <FlatList
              data={trendingMovies}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(movie) => movie.id.toString()}
              renderItem={({ item }) => (
                <PosterCard
                  posterPath={fetchMoviePoster(item.poster_path as string)}
                  movie={item}
                  width={140}
                  height={210}
                  tab={"(home)"}
                />
              )}
            />
          ) : (
            <FlatList
              data={trendingTVShows}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(tv) => tv.id.toString()}
              renderItem={({ item }) => (
                <PosterCard
                  posterPath={fetchMoviePoster(item.poster_path as string)}
                  movie={item}
                  width={140}
                  height={210}
                  tab={"(home)"}
                />
              )}
            />
          )}

          {/* Now Playing / On The Air Section */}
          {selectedIndex === 0 ? (
            <>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(home)/CategoryScreen",
                    params: { category: "Now" },
                  })
                }
                className="flex-row items-center self-start pl-2 active:opacity-60"
              >
                <Text className="text-text-dark text-2xl font-bold pl-2">
                  Now Playing
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#f8f9fa"
                />
              </Pressable>
              <FlatList
                data={nowPlayingMovies}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(movie) => movie.id.toString()}
                renderItem={({ item }) => (
                  <PosterCard
                    posterPath={fetchMoviePoster(item.poster_path as string)}
                    movie={item}
                    width={140}
                    height={210}
                    tab={"(home)"}
                  />
                )}
              />
            </>
          ) : (
            <>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(home)/CategoryScreen",
                    params: { category: "Now" },
                  })
                }
                className="flex-row items-center self-start pl-2 active:opacity-60"
              >
                <Text className="text-text-dark text-2xl font-bold pl-2">
                  On The Air
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#f8f9fa"
                />
              </Pressable>
              <FlatList
                data={onTheAirTVShows}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(tv) => tv.id.toString()}
                renderItem={({ item }) => (
                  <PosterCard
                    posterPath={fetchMoviePoster(item.poster_path as string)}
                    movie={item}
                    width={140}
                    height={210}
                    tab={"(home)"}
                  />
                )}
              />
            </>
          )}
        </ScrollView>
        <TermsConditionModal
          modalVisible={termsCondition}
          onClose={handleTermsCondition}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

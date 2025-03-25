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
import { ButtonGroup, useTheme, Button, Icon } from "@rneui/themed";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";

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
  const { theme } = useTheme();

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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
        <ScrollView
          style={{
            height: Platform.OS === "web" ? windowHeight : "auto",
          }}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.title, { color: theme.colors.black }]}>
              Home
            </Text>
            <ButtonGroup
              containerStyle={{
                width: 200,
                height: 30,
                backgroundColor: theme.colors.grey0,
                borderWidth: 0,
                borderRadius: 10,
              }}
              buttons={["Movie", "TV Show"]}
              selectedIndex={selectedIndex}
              onPress={(value) => {
                setSelectedIndex(value);
              }}
            />
          </View>
          <Text style={[styles.genreTitle, { color: theme.colors.black }]}>
            Genres
          </Text>
          {selectedIndex == 0 ? (
            <FlatList
              data={movieGenres}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(movie) => movie.id.toString()}
              renderItem={({ item }) => (
                <Button
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
                  buttonStyle={{
                    backgroundColor: theme.colors.grey1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    marginLeft: 10,
                    marginVertical: 5,
                  }}
                  titleStyle={{ color: theme.colors.black }}
                  title={item.name}
                />
              )}
            />
          ) : (
            <FlatList
              data={tvGenres}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(tv) => tv.id.toString()}
              renderItem={({ item }) => (
                <Button
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
                  buttonStyle={{
                    backgroundColor: theme.colors.grey1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    marginLeft: 10,
                    marginVertical: 5,
                  }}
                  titleStyle={{ color: theme.colors.black }}
                  title={item.name}
                />
              )}
            />
          )}
          <Button
            type="clear"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/CategoryScreen",
                params: { category: "Most Popular" },
              })
            }
            buttonStyle={{ alignSelf: "flex-start" }}
            title="Most Popular"
            titleStyle={[styles.subtitle, { color: theme.colors.black }]}
            iconRight
            icon={<Icon name="chevron-right" />}
          />
          {selectedIndex == 0 ? (
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
          <Button
            type="clear"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/CategoryScreen",
                params: { category: "Trending" },
              })
            }
            buttonStyle={{ alignSelf: "flex-start" }}
            title="Trending"
            titleStyle={[styles.subtitle, { color: theme.colors.black }]}
            iconRight
            icon={<Icon name="chevron-right" />}
          />
          {selectedIndex == 0 ? (
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
          {selectedIndex == 0 ? (
            <>
              <Button
                type="clear"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(home)/CategoryScreen",
                    params: { category: "Now" },
                  })
                }
                buttonStyle={{ alignSelf: "flex-start" }}
                title="Now Playing"
                titleStyle={[styles.subtitle, { color: theme.colors.black }]}
                iconRight
                icon={<Icon name="chevron-right" />}
              />
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
              <Button
                type="clear"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(home)/CategoryScreen",
                    params: { category: "Now" },
                  })
                }
                buttonStyle={{ alignSelf: "flex-start" }}
                title="On The Air"
                titleStyle={[styles.subtitle, { color: theme.colors.black }]}
                iconRight
                icon={<Icon name="chevron-right" />}
              />
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
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  genreTitle: { fontSize: 24, fontWeight: "bold", paddingLeft: 20 },
});

export default HomeScreen;

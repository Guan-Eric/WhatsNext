import { fetchGenres } from "@/backend/genre";
import {
  fetchMoviePoster,
  fetchNowPlaying,
  fetchOnTheAir,
  fetchPopular,
  fetchTrending,
} from "@/backend/movie";
import PosterCard from "@/components/cards/PosterCard";
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
} from "react-native";

const HomeScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [onTheAirTVShows, setOnTheAirTVShows] = useState<TVShow[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const { theme } = useTheme();

  const fetchMoviesAndTVShows = async () => {
    setPopularMovies((await fetchPopular("movie")) as Movie[]);
    setPopularTVShows((await fetchPopular("tv")) as TVShow[]);
    setNowPlayingMovies((await fetchNowPlaying()) as Movie[]);
    setOnTheAirTVShows((await fetchOnTheAir()) as TVShow[]);
    setMovieGenres((await fetchGenres("movie")) as Genre[]);
    setTVGenres((await fetchGenres("tv")) as Genre[]);
  };

  const fetchTrendingMoviesAndTVShows = async () => {
    setTrendingMovies((await fetchTrending("movie", "week")) as Movie[]);
    setTrendingTVShows((await fetchTrending("tv", "week")) as TVShow[]);
  };

  useEffect(() => {
    fetchMoviesAndTVShows();
    fetchTrendingMoviesAndTVShows();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView>
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
        <ScrollView style={{ marginBottom: 40 }}>
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
                titleStyle={[
                  styles.subtitle,
                  { color: theme.colors.black, paddingLeft: 0 },
                ]}
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
  },
  genreTitle: { fontSize: 24, fontWeight: "bold", paddingLeft: 10 },
});

export default HomeScreen;

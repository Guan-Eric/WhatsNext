import { fetchMovieDetails, fetchMoviePoster } from "@/backend/movie";
import MovieCard from "@/components/cards/movieCard";
import { useState, useEffect } from "react";
import { Text, View, Image } from "react-native";

export default function Index() {
  const [movieDetails, setMovieDetails] = useState<Movie>();
  const [moviePoster, setMoviePoster] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await fetchMovieDetails(551); // Replace 1 with the desired movie ID
      setMoviePoster(fetchMoviePoster(details?.poster_path));
      setMovieDetails(details);
      console.log("here" + details?.poster_path);
    };

    fetchDetails();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MovieCard
        title={movieDetails?.title || "Unknown Title"}
        posterPath={moviePoster}
        genres={movieDetails?.genres || []}
      />
    </View>
  );
}

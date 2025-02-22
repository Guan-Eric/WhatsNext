import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchMovieDetails(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

export function fetchMoviePoster(path: string): string {
  try {
    return `${POSTER_URL}${path}`;
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return "";
  }
}

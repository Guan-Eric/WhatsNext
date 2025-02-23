import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchDetails(movieId: number, mediaType: "movie" | "tv") {
  const url = `${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}`;

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

export async function fetchTrending(
  mediaType: "movie" | "tv",
  timeWindow: "day" | "week"
) {
  const url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results; // Array of trending movies or TV shows
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return [];
  }
}

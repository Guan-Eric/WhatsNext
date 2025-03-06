import Constants from "expo-constants";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Constants.expoConfig?.extra?.tmdbApiKey}`,
  },
};
export async function fetchGenres(type: "movie" | "tv"): Promise<Genre[]> {
  try {
    const url = `https://api.themoviedb.org/3/genre/${type}/list`;
    const response = await fetch(url, options);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres from API:", error);
    throw error;
  }
}

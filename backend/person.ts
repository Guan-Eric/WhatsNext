import Constants from "expo-constants";
import { fetchMoviePoster } from "./movie";

const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/original";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Constants.expoConfig?.extra?.tmdbApiKey}`,
  },
};

export async function fetchPersonDetails(id: number): Promise<Person> {
  try {
    const response = await fetch(`${BASE_URL}/person/${id}`, options);
    const personData = (await response.json()) as Person;
    return personData;
  } catch (error) {
    console.error("Error fetching person details", error);
    throw error;
  }
}

export async function fetchCast(
  id: number,
  type: "movie" | "tv"
): Promise<Person[]> {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}/credits`, options);
    const creditsData = await response.json();
    const filteredCast = creditsData.cast.map(
      async ({
        id,
        profile_path,
      }: {
        id: number;
        profile_path: string | null;
      }) => ({
        id,
        poster: profile_path ? await fetchMoviePoster(profile_path) : null,
      })
    );
    console.log(filteredCast);
    return filteredCast;
  } catch (error) {
    console.error("Error fetching cast details", error);
    throw error;
  }
}

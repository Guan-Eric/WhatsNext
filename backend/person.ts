import Constants from "expo-constants";

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
      ({
        id,
        name,
        profile_path,
      }: {
        id: number;
        name: String;
        profile_path: string | null;
      }) => ({
        id,
        name,
        profile_path: profile_path ? POSTER_URL + profile_path : null,
      })
    );
    return filteredCast;
  } catch (error) {
    console.error("Error fetching cast details", error);
    throw error;
  }
}

export async function fetchKnownFor(id: number): Promise<(Movie | TVShow)[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${id}/combined_credits`,
      options
    );
    const creditsData = await response.json();
    const knownFor = creditsData.cast.map(
      ({
        id,
        title,
        name,
        poster_path,
        media_type,
      }: {
        id: number;
        title?: string;
        name?: string;
        poster_path: string | null;
        media_type: "movie" | "tv";
      }) => ({
        id,
        title: title || name,
        poster_path: poster_path ? POSTER_URL + poster_path : null,
        type: media_type == "movie" ? "movie" : "tv",
      })
    );
    return knownFor as (Movie | TVShow)[];
  } catch (error) {
    console.error("Error fetching known for details", error);
    throw error;
  }
}

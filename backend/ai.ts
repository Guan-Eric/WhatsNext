import { FIRESTORE_DB } from "@/firebaseConfig";
import Constants from "expo-constants";
import { collection, getDocs } from "firebase/firestore";
import OpenAI from "openai";
import {
  fetchDetails,
  fetchMoviesFromMyList,
  fetchMoviesFromWatchlist,
} from "./movie";

const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;
const openai = new OpenAI({
  organization: Constants.expoConfig?.extra?.openaiOrganizationId,
  project: Constants.expoConfig?.extra?.openaiProjectId,
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
  dangerouslyAllowBrowser: true,
});

export async function GenerateStringList(
  genre: string,
  mood: string,
  releaseYear: string,
  language: string,
  type: "movie" | "tv",
  preference: string
): Promise<string[]> {
  const maxRetries = 3;
  let attempts = 0;
  let watchlist = await fetchMoviesFromWatchlist(type);
  let myList = await fetchMoviesFromMyList(type);

  while (attempts < maxRetries) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a ${
              type === "movie" ? "movie" : "TV Show"
            } List Generator who suggests personalized ${
              type === "movie" ? "movies" : "TV Shows"
            } based on user preferences.`,
          },
          {
            role: "user",
            content: `
                Create a list of ${
                  type === "movie" ? "movies" : "TV shows"
                } for a user interested in ${genre || "any genre"} and ${
              mood || "any mood"
            } from the ${releaseYear || "any release year"} era, speaking ${
              language || "any language"
            }, who prefers ${type === "movie" ? "movies" : "TV Shows"}${
              preference.length > 0
                ? " and other preferences: " + preference + "."
                : ". " +
                  `The user's list of watched ${
                    type === "movie" ? "movies" : "TV shows"
                  } and their personal ratings: ${myList
                    .map((item) => {
                      return type === "movie"
                        ? (item as Movie).title + ": " + item.rating + "/5"
                        : (item as TVShow).name + ": " + item.rating + "/5";
                    })
                    .join(", ")} and they're list of ${
                    type === "movie" ? "movies" : "TV shows"
                  } they want to watch: ${watchlist
                    .map((item) => {
                      return type === "movie"
                        ? (item as Movie).title
                        : (item as TVShow).name;
                    })
                    .join(", ")}`
            }
                
                Respond in a string array of ${
                  type === "movie" ? "movie" : "TV Show"
                } names
                `,
          },
        ],
        temperature: 0.7,
      });

      const content =
        response.choices[0].message?.content || "No plan generated.";
      const cleanedJSON = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/(\r\n|\n|\r)/gm, "");
      const list = JSON.parse(cleanedJSON);
      return list;
    } catch (error) {
      attempts++;
      console.error(
        `Error generating list (attempt ${attempts}/${maxRetries}):`,
        error
      );
      if (attempts === maxRetries) {
        throw new Error(
          "Failed to generate list after multiple attempts. Please try again later."
        );
      }
      throw error;
    }
  }
  throw Error;
}

export async function FetchMovieList(
  list: string[],
  type: "movie" | "tv"
): Promise<Movie[] | TVShow[]> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  try {
    if (type === "movie") {
      const result: Movie[] = [];
      for (const title of list) {
        const url = `https://api.themoviedb.org/3/search/movie?query=${title}`;
        const response = await fetch(url, options);
        const data = await response.json();
        if (data.results.length > 0) {
          const id = data.results[0].id;
          const details = await fetchDetails(id, type);
          if (details) {
            result.push(details as Movie);
          }
        }
      }
      return result;
    } else {
      const result: TVShow[] = [];
      for (const title of list) {
        const url = `https://api.themoviedb.org/3/search/tv?query=${title}`;
        const response = await fetch(url, options);
        const data = await response.json();
        if (data.results.length > 0) {
          const id = data.results[0].id;
          const details = await fetchDetails(id, type);
          if (details) {
            result.push(details as TVShow);
          }
        }
      }
      return result;
    }
  } catch (error) {
    console.error("Error Creating Movie/TV Show List", error);
    throw error;
  }
}

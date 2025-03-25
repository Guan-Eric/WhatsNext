import { FIRESTORE_DB, FIREBASE_AUTH } from "@/firebaseConfig";
import Constants from "expo-constants";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Constants.expoConfig?.extra?.tmdbApiKey}`,
  },
};

export async function fetchDetails(
  movieId: string,
  mediaType: "movie" | "tv"
): Promise<Movie | TVShow | undefined> {
  const url = `${BASE_URL}/${mediaType}/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data as Movie | TVShow;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return undefined;
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

export function fetchHDMoviePoster(path: string): string {
  try {
    return `https://image.tmdb.org/t/p/original${path}`;
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return "";
  }
}

export async function fetchTrending(
  mediaType: "movie" | "tv",
  timeWindow: "day" | "week",
  pages: number
): Promise<Movie[] | TVShow[]> {
  const trending: Movie[] | TVShow[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      const castPromises = data.results.map(async (item: Movie | TVShow) => {
        const details = await fetchDetails(item.id.toString(), mediaType);
        return details && details.poster_path ? details : null;
      });
      const resultsWithCast = await Promise.all(castPromises);
      trending.push(...resultsWithCast.filter((item) => item !== null));
    }
    return trending;
  } catch (error) {
    console.error("Error fetching trending content:", error);
    throw error;
  }
}

export async function fetchPopular(
  mediaType: "movie" | "tv",
  pages: number
): Promise<Movie[] | TVShow[]> {
  const popular: Movie[] | TVShow[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/${mediaType}/popular?page=${page}`;
      const response = await fetch(url, options);
      const data = await response.json();
      const castPromises = data.results.map(async (item: Movie | TVShow) => {
        const details = await fetchDetails(item.id.toString(), mediaType);
        return details && details.poster_path ? details : null;
      });
      const resultsWithCast = await Promise.all(castPromises);
      popular.push(...resultsWithCast.filter((item) => item !== null));
    }
    return popular;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function fetchNowPlaying(pages: number): Promise<Movie[]> {
  const nowPlaying: Movie[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/movie/now_playing?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      const castPromises = data.results.map(async (item: Movie | TVShow) => {
        const details = await fetchDetails(item.id.toString(), "movie");
        return details && details.poster_path ? details : null;
      });
      const resultsWithCast = await Promise.all(castPromises);
      nowPlaying.push(...resultsWithCast.filter((item) => item !== null));
    }
    return nowPlaying;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function fetchOnTheAir(pages: number): Promise<TVShow[]> {
  const onTheAir: TVShow[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/tv/on_the_air?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      const castPromises = data.results.map(async (item: Movie | TVShow) => {
        const details = await fetchDetails(item.id.toString(), "tv");
        return details && details.poster_path ? details : null;
      });
      const resultsWithCast = await Promise.all(castPromises);
      onTheAir.push(...resultsWithCast.filter((item) => item !== null));
    }
    return onTheAir;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function saveToMyList(
  id: string,
  rating: number,
  type: "movie" | "tv"
): Promise<boolean> {
  try {
    await setDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH?.currentUser?.uid}/MyList/${id}`
      ),
      { rating: rating, type: type }
    );
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

export async function saveToWatchlist(id: string, type: "movie" | "tv") {
  try {
    await setDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH?.currentUser?.uid}/Watchlist/${id}`
      ),
      { type: type }
    );
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

export async function deleteFromMyList(id: string): Promise<boolean> {
  try {
    await deleteDoc(
      doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH?.currentUser?.uid}/MyList/${id}`)
    );
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
}

export async function deleteFromWatchlist(id: string) {
  try {
    await deleteDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH?.currentUser?.uid}/Watchlist/${id}`
      )
    );
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
}

export async function fetchMoviesFromMyList(
  type: "movie" | "tv"
): Promise<Movie[] | TVShow[]> {
  try {
    const myListCollectionRef = collection(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser?.uid}/MyList`
    );
    if (type == "movie") {
      const movieListSnapshot = await getDocs(
        query(myListCollectionRef, where("type", "==", "movie"))
      );
      const list: Movie[] = [];
      for (const movieSnapshot of movieListSnapshot.docs) {
        const movie = (await fetchDetails(movieSnapshot.id, type)) as Movie;
        movie.rating = movieSnapshot.data().rating;
        list.push(movie);
      }
      return list;
    } else {
      const tvListSnapshot = await getDocs(
        query(myListCollectionRef, where("type", "==", "tv"))
      );
      const list: TVShow[] = [];
      for (const tvSnapshot of tvListSnapshot.docs) {
        const tv = (await fetchDetails(tvSnapshot.id, type)) as TVShow;
        tv.rating = tvSnapshot.data().rating;
        list.push(tv);
      }
      return list;
    }
  } catch (error) {
    console.error("Error fetching My List", error);
    throw error;
  }
}

export async function fetchMoviesFromWatchlist(
  type: "movie" | "tv"
): Promise<Movie[] | TVShow[]> {
  try {
    const myListCollectionRef = collection(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser?.uid}/Watchlist`
    );
    if (type == "movie") {
      const movieListSnapshot = await getDocs(
        query(myListCollectionRef, where("type", "==", "movie"))
      );
      const list: Movie[] = [];
      for (const movieSnapshot of movieListSnapshot.docs) {
        const movie = (await fetchDetails(movieSnapshot.id, type)) as Movie;
        list.push(movie);
      }
      return list;
    } else {
      const tvListSnapshot = await getDocs(
        query(myListCollectionRef, where("type", "==", "tv"))
      );
      const list: TVShow[] = [];
      for (const tvSnapshot of tvListSnapshot.docs) {
        const tv = (await fetchDetails(tvSnapshot.id, type)) as TVShow;
        list.push(tv);
      }
      return list;
    }
  } catch (error) {
    console.error("Error fetching My List", error);
    throw error;
  }
}

export async function isAlreadySeen(id: string): Promise<boolean> {
  try {
    const myListDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser?.uid}/MyList/${id}`
    );
    const docSnapshot = await getDoc(myListDocRef);
    return docSnapshot.exists();
  } catch (error) {
    console.error("Error checking if already seen", error);
    throw error;
  }
}

export async function isWatchlist(id: string): Promise<boolean> {
  try {
    const watchlistDocRef = doc(
      FIRESTORE_DB,
      `Users/${FIREBASE_AUTH.currentUser?.uid}/Watchlist/${id}`
    );
    const docSnapshot = await getDoc(watchlistDocRef);
    return docSnapshot.exists();
  } catch (error) {
    console.error("Error checking if in watchlist", error);
    throw error;
  }
}

export async function fetchMoviesFromCategory(
  category: string
): Promise<Movie[]> {
  const movies =
    category === "Most Popular"
      ? await fetchPopular("movie", 10)
      : category === "Trending"
      ? await fetchTrending("movie", "week", 10)
      : await fetchNowPlaying(10);
  return movies as Movie[];
}

export async function fetchTVShowsFromCategory(
  category: string
): Promise<TVShow[]> {
  const tvShows =
    category === "Most Popular"
      ? await fetchPopular("tv", 10)
      : category === "Trending"
      ? await fetchTrending("tv", "week", 10)
      : await fetchOnTheAir(10);
  return tvShows as TVShow[];
}

export async function fetchMoviesFromGenre(
  genreId: string,
  pages: number
): Promise<Movie[]> {
  const movies: Movie[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/discover/movie?page=${page}&with_genres=${genreId}`;
      const response = await fetch(url, options);
      const data = await response.json();
      movies.push(...data.results);
    }
    return movies;
  } catch (error) {
    console.error("Error discovering movies by genre:", error);
    throw error;
  }
}

export async function fetchTVShowsFromGenre(
  genreId: string,
  pages: number
): Promise<TVShow[]> {
  const tvShows: TVShow[] = [];
  try {
    for (let page = 1; page <= pages; page++) {
      const url = `${BASE_URL}/discover/tv?page=${page}&with_genres=${genreId}`;
      const response = await fetch(url, options);
      const data = await response.json();
      tvShows.push(...data.results);
    }
    return tvShows;
  } catch (error) {
    console.error("Error discovering movies by genre:", error);
    throw error;
  }
}

export async function multiSearch(
  search: string
): Promise<(Movie | TVShow | Person)[]> {
  const response = await fetch(
    `${BASE_URL}/search/multi?query=${search}`,
    options
  );
  const data = await response.json();
  return data.results.filter(
    (item: Movie | TVShow | Person) =>
      (item as Movie).poster_path ||
      (item as TVShow).poster_path ||
      (item as Person).profile_path
  ) as (Movie | TVShow | Person)[];
}

export async function fetchWatchProviders(
  id: string,
  type: "movie" | "tv",
  region: string = "US" // Default to US if no region provided
): Promise<{ [category: string]: WatchProvider[] }> {
  try {
    const response = await fetch(
      `${BASE_URL}/${type}/${id}/watch/providers`,
      options
    );
    const data = await response.json();

    // Check if region data exists
    if (!data.results || !data.results[region]) {
      console.log(`No provider data found for region: ${region}`);
      return {};
    }

    const regionData = data.results[region];
    const result: { [category: string]: WatchProvider[] } = {};

    // Get all categories: flatrate (streaming), rent, buy, free, ads, etc.
    const categories = ["flatrate", "rent", "buy", "free"];

    categories.forEach((category) => {
      if (regionData[category] && regionData[category].length > 0) {
        result[category] = regionData[category].map((provider: any) => ({
          provider_id: provider.provider_id,
          provider_name: provider.provider_name,
          logo_path: provider.logo_path
            ? `${POSTER_URL}${provider.logo_path}`
            : null,
          display_priority: provider.display_priority,
        }));
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return {};
  }
}

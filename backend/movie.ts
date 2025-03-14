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
const POSTER_URL = "https://image.tmdb.org/t/p/original";
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

export async function fetchTrending(
  mediaType: "movie" | "tv",
  timeWindow: "day" | "week"
): Promise<Movie[] | TVShow[]> {
  const trending: Movie[] | TVShow[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      trending.push(...data.results);
    }
    return trending;
  } catch (error) {
    console.error("Error fetching trending content:", error);
    throw error;
  }
}

export async function fetchPopular(
  mediaType: "movie" | "tv"
): Promise<Movie[] | TVShow[]> {
  const popular: Movie[] | TVShow[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.themoviedb.org/3/${mediaType}/popular?page=${page}`;
      const response = await fetch(url, options);
      const data = await response.json();
      popular.push(...data.results);
    }
    return popular;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function fetchNowPlaying(): Promise<Movie[]> {
  const nowPlaying: Movie[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.themoviedb.org/3/movie/now_playing?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      nowPlaying.push(...(data.results as Movie[]));
    }
    return nowPlaying;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

export async function fetchOnTheAir(): Promise<TVShow[]> {
  const OnTheAir: TVShow[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.themoviedb.org/3/tv/on_the_air?page=${page}`;

      const response = await fetch(url, options);
      const data = await response.json();
      OnTheAir.push(...(data.results as TVShow[]));
    }
    return OnTheAir;
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
      ? await fetchPopular("movie")
      : category === "Trending"
      ? await fetchTrending("movie", "week")
      : await fetchNowPlaying();
  return movies as Movie[];
}

export async function fetchTVShowsFromCategory(
  category: string
): Promise<TVShow[]> {
  const tvShows =
    category === "Most Popular"
      ? await fetchPopular("tv")
      : category === "Trending"
      ? await fetchTrending("tv", "week")
      : await fetchOnTheAir();
  return tvShows as TVShow[];
}

export async function fetchMoviesFromGenre(genreId: string): Promise<Movie[]> {
  const movies: Movie[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.themoviedb.org/3/discover/movie?page=${page}&with_genres=${genreId}`;
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
  genreId: string
): Promise<TVShow[]> {
  const tvShows: TVShow[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `https://api.themoviedb.org/3/discover/tv?page=${page}&with_genres=${genreId}`;
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

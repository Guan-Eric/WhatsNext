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
} from "firebase/firestore";

const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchDetails(
  movieId: number,
  mediaType: "movie" | "tv"
): Promise<Movie | TVShow | undefined> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
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
    await deleteDoc(
      doc(
        FIRESTORE_DB,
        `Users/${FIREBASE_AUTH?.currentUser?.uid}/Watchlist/${id}`
      )
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
    await deleteDoc(
      doc(FIRESTORE_DB, `Users/${FIREBASE_AUTH?.currentUser?.uid}/MyList/${id}`)
    );
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
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
        const movie = (await fetchDetails(
          Number(movieSnapshot.id),
          type
        )) as Movie;
        console.log(movie?.title);
        list.push(movie);
      }
      return list;
    } else {
      const tvListSnapshot = await getDocs(
        query(myListCollectionRef, where(type, "==", "tv"))
      );
      const list: TVShow[] = [];
      for (const tvSnapshot of tvListSnapshot.docs) {
        const tv = tvSnapshot.data() as TVShow;
        list.push(tv);
      }
      return list;
    }
  } catch (error) {
    console.error("Error fetching My List", error);
    return [];
  }
}

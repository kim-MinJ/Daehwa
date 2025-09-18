// src/store/movieStore.ts
import { create } from "zustand";
import { openDB, IDBPDatabase } from "idb";
import { Movie } from "@/types/movie";
import { saveMoviesToDB, getMoviesFromDB } from "@/utils/indexedDB";

interface MovieState {
  movies: Movie[];
  allMovies: Movie[];
  loading: boolean;
  page: number;
  totalPages: number | null;
  fetchPage: (page?: number, limit?: number, isBackground?: boolean) => Promise<Movie[]>;
  fetchAllHybrid: () => Promise<Movie[]>;
  setMovies: (movies: Movie[]) => void;
}

const DB_NAME = "MovieDB";
const STORE_NAME = "movies";
const DB_VERSION = 3;

let dbInstance: IDBPDatabase<any> | null = null;

async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "movieIdx" });
        console.log("IndexedDB: objectStore 생성됨");
      }
    },
  });
  return dbInstance;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  allMovies: [],
  loading: false,
  page: 0,
  totalPages: null,

  fetchPage: async (page = 0, limit = 50, isBackground = false) => {
    try {
      if (!isBackground) set({ loading: true });

      const res = await fetch(`/api/searchMovie?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const raw = await res.json();

      const data: Movie[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.content)
        ? raw.content
        : [];

      const combined = [...get().allMovies, ...data];
      const uniqueMovies = Array.from(
        new Map(combined.map((m) => [m.movieIdx, m])).values()
      );

      set({ allMovies: uniqueMovies });
      if (!isBackground) set({ movies: data });

      if (uniqueMovies.length > 0) await saveMoviesToDB(uniqueMovies);

      return data;
    } catch (err) {
      console.error("fetchPage error:", err);
      return [];
    } finally {
      if (!isBackground) set({ loading: false });
    }
  },

  fetchAllHybrid: async () => {
    const limit = 500;
    let page = 0;

    const cached = await getMoviesFromDB();
    if (cached.length > 0) {
      set({ allMovies: cached, movies: cached.slice(0, limit) });
      page = Math.floor(cached.length / limit) + 1;
      console.log("IndexedDB에서 캐시 불러옴:", cached.length, "개 영화");
    }

    (async () => {
      while (true) {
        const batch = await get().fetchPage(page, limit, true);
        if (!batch || batch.length === 0) break;
        page++;
      }
      console.log("백그라운드 전체 fetch 완료! 총 영화 수:", get().allMovies.length);
    })();

    return get().allMovies;
  },

  setMovies: (movies) => set({ movies }),
}));

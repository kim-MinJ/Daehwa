// src/store/movieStore.ts
import { create } from "zustand";
import { Movie } from "@/types/movie";
import { DB } from "@/utils/indexedDB";
import { MovieState, GetMoviesOptions } from "@/types/movieStore"; // 분리된 타입 import

let uiAbortController: AbortController | null = null;
let bgAbortController: AbortController | null = null;

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  allMovies: [],
  loading: false,
  isBackgroundFetched: false,
  isBackgroundFetching: false,

  setMovies: (movies) => {
    const filtered = movies.filter(m => m.posterPath && m.title);
    const uniqueMovies = Array.from(new Map(filtered.map(m => [m.movieIdx, m])).values());
    set({ movies: uniqueMovies });
  },

  getMovieFromDB: async (movieId: number) => {
    const all = await DB.movies.getAll();
    return all.find((m) => m.movieIdx === movieId) ?? null;
  },

  getMoviesFromDB: async ({
    query = "",
    years,
    genres,
    offset = 0,
    limit = 20,
    countOnly = false,
  }: GetMoviesOptions = {}) => {
    const all: Movie[] = await DB.movies.getAll();
    let filtered = all;

    if (query) filtered = filtered.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
    if (years && years.length > 0)
      filtered = filtered.filter(m => m.releaseDate && years.includes(m.releaseDate.split("-")[0]));
    if (genres && genres.length > 0)
      filtered = filtered.filter(m => m.genres && m.genres.some(g => genres.includes(g)));

    if (countOnly) return filtered.length;

    return Array.from(new Map(filtered.slice(offset, offset + limit).map(m => [m.movieIdx, m])).values());
  },

  // 🔹 첫 페이지 fetch: poster와 title 없는 영화 제외
  fetchFirstPage: async (limit = 20) => {
    set({ loading: true });
    if (uiAbortController) uiAbortController.abort();
    uiAbortController = new AbortController();

    try {
      const res = await fetch(`/api/searchMovie?page=0&limit=${limit}`, {
        signal: uiAbortController.signal,
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const raw = await res.json();
      let data: Movie[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.content)
        ? raw.content
        : [];

      // 🔹 poster/title 없는 영화 제거
      data = data.filter(m => m.posterPath && m.title);

      const uniqueData = Array.from(new Map(data.map(m => [m.movieIdx, m])).values());
      set({ movies: uniqueData });
      if (uniqueData.length > 0) await DB.movies.save(uniqueData);
      return uniqueData;
    } catch (err: any) {
      if (err.name === "AbortError") console.log("fetchFirstPage 취소됨");
      else console.error("fetchFirstPage error:", err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 백그라운드 전체 fetch: poster/title 없는 영화 제거
  fetchAllBackground: async () => {
    if (get().isBackgroundFetched || get().isBackgroundFetching) return;
    set({ isBackgroundFetching: true });
    bgAbortController = new AbortController();
    const signal = bgAbortController.signal;

    const limit = 500;
    let page = 0;

    (async () => {
      try {
        while (!signal.aborted) {
          const res = await fetch(`/api/searchMovie?page=${page}&limit=${limit}`, { signal });
          if (!res.ok) break;

          const raw = await res.json();
          let batch: Movie[] = Array.isArray(raw)
            ? raw
            : Array.isArray(raw.content)
            ? raw.content
            : [];

          // 🔹 poster/title 없는 영화 제거
          batch = batch.filter(m => m.posterPath && m.title);
          if (!batch.length) break;

          const combined = [...get().allMovies, ...batch];
          const uniqueMovies = Array.from(new Map(combined.map(m => [m.movieIdx, m])).values());
          set({ allMovies: uniqueMovies });
          await DB.movies.save(uniqueMovies);

          page++;
        }
        console.log("백그라운드 전체 fetch 완료! 총 영화 수:", get().allMovies.length);
        set({ isBackgroundFetched: true });
      } catch (err: any) {
        if (err.name === "AbortError") console.log("백그라운드 fetch 중단됨");
        else console.error(err);
      } finally {
        set({ isBackgroundFetching: false });
        bgAbortController = null;
      }
    })();
  },

  stopBackgroundFetch: () => {
    if (bgAbortController) {
      bgAbortController.abort();
      bgAbortController = null;
      set({ isBackgroundFetching: false });
      console.log("백그라운드 fetch 중단됨");
    }
  },
}));

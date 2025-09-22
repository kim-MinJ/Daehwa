import { create } from "zustand";
import { Movie } from "@/types/movie";
import { DB } from "@/utils/indexedDB";
import { MovieState, GetMoviesOptions } from "@/types/movieStore";

let uiAbortController: AbortController | null = null;
let bgAbortController: AbortController | null = null;

// 🔹 유효한 영화만 필터링
function filterValidMovies(movies: Movie[]) {
  return movies.filter(m => m.posterPath && m.title && m.backdropPath);
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  allMovies: [],
  loading: false,
  isBackgroundFetched: false,
  isBackgroundFetching: false,

  setMovies: (movies) => {
    const uniqueMovies = Array.from(
      new Map(filterValidMovies(movies).map(m => [m.movieIdx, m])).values()
    );
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

    return Array.from(
      new Map(filtered.slice(offset, offset + limit).map(m => [m.movieIdx, m])).values()
    );
  },

  // 🔹 최신 영화 첫 페이지 (전역용)
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
      let data: Movie[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];
      const uniqueData = Array.from(
        new Map(filterValidMovies(data).map(m => [m.movieIdx, m])).values()
      );

      // 전역 상태 갱신
      set({ movies: uniqueData });

      // 캐시 저장
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

  // 🔹 이번주 인기 영화 (메인페이지 전용, 전역 상태 & 캐시 건드리지 않음)
  fetchWeeklyMovies: async (limit = 20) => {
    try {
      const res = await fetch(`/api/temporary?page=0&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const raw = await res.json();
      let data: Movie[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];

      return filterValidMovies(data);
    } catch (err) {
      console.error("fetchWeeklyMovies error:", err);
      return [];
    }
  },

  // 🔹 추억의 영화 API (랜덤 처리, 메인페이지용)
  fetchNostalgicMovies: async () => {
    try {
      const res = await fetch(`/api/nostalgicMovies`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const raw = await res.json();
      let data: Movie[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];
      return filterValidMovies(data);
    } catch (err) {
      console.error("fetchNostalgicMovies error:", err);
      return [];
    }
  },

  // 🔹 전체 백그라운드 fetch
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
          let batch: Movie[] = Array.isArray(raw) ? raw : Array.isArray(raw.content) ? raw.content : [];
          batch = filterValidMovies(batch);
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

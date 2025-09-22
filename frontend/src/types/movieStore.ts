// src/types/movieStore.ts
import { Movie } from "./movie";

// DB나 fetch 옵션
export interface GetMoviesOptions {
  query?: string;
  years?: string[];
  genres?: string[];
  offset?: number;
  limit?: number;
  countOnly?: boolean;
  signal?: AbortSignal;
}

// Zustand store 상태 타입
export interface MovieState {
  movies: Movie[];           // UI용 첫 페이지 데이터
  allMovies: Movie[];        // 전체 영화 데이터 (백그라운드)
  loading: boolean;          // UI fetch 중 로딩 상태
  isBackgroundFetched: boolean;
  isBackgroundFetching: boolean;

  setMovies: (movies: Movie[]) => void;
  getMovieFromDB: (movieId: number) => Promise<Movie | null>;
  getMoviesFromDB: (options?: GetMoviesOptions) => Promise<Movie[] | number>;
  fetchFirstPage: (limit?: number) => Promise<Movie[]>;
  fetchWeeklyMovies: (limit?: number) => Promise<Movie[]>;
  fetchNostalgicMovies: (limit?: number) => Promise<Movie[]>;
  fetchAllBackground: () => void;
  stopBackgroundFetch: () => void;
}

// 영화 API
export interface MovieStore {
  // 🔹 최신 영화 (첫 페이지 전용, 최신순)
  fetchFirstPage: (limit?: number) => Promise<Movie[]>;

  // 🔹 이번주 인기 영화 API
  fetchWeeklyMovies: () => Promise<Movie[]>;

  // 🔹 추억의 영화 API
  fetchNostalgicMovies: () => Promise<Movie[]>;

  // 🔹 전체 백그라운드 fetch → IndexedDB + store 업데이트
  fetchAllBackground: () => Promise<void>;
}
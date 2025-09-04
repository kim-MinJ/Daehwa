import { api } from "@/lib/api";

export async function fetchMovie(id: number) {
  const { data } = await api.get(`/movies/${id}`);
  return data;
}

export async function fetchCredits(id: number) {
  const { data } = await api.get(`/movies/${id}/credits`);
  return data; // { cast, crew }
}

export async function fetchSimilar(id: number, page = 1) {
  const { data } = await api.get(`/movies/${id}/similar`, { params: { page } });
  return data.results ?? [];
}

export async function fetchVideos(id: number) {
  const { data } = await api.get(`/movies/${id}/videos`);
  return data.results ?? []; // YouTube key, type: "Trailer"
}

export async function searchMovies(q: string, page = 1) {
  const { data } = await api.get(`/search/movies`, { params: { query: q, page, include_adult: false } });
  return data.results ?? [];

  
}
// src/types/movie.ts
export type TrailerItem = { id: string | number; name: string; url: string; thumbnail?: string; };
export type SimilarMovie = { id: number; title: string; posterUrl?: string; rating?: number; year?: string; };
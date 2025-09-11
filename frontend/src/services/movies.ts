export type Movie = {
  movieIdx: number;
  id: number;
  title: string;
  overview: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres?: string[];
  runtime?: number;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  posterPath?: string;
  

};

export async function fetchMovieById(id: number) {
  const res = await fetch(`/api/movies/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
export async function fetchMovieByTmdbId(tmdbId: number) {
  const res = await fetch(`/api/movies?tmdbId=${tmdbId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
export async function fetchMovieList(params?: { page?: number; size?: number; q?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.size) query.append("size", String(params.size));
  if (params?.q) query.append("q", params.q);
  const res = await fetch(`/api/movies/list?${query}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json() as Promise<Movie[]>;
}
export async function fetchSimilar(id: number) {
  const res = await fetch(`/api/movies/${id}/similar`); // ✅ 상대경로 (프록시 타게)
  if (res.status === 404) return [];                     // ✅ 엔드포인트 없으면 빈 배열
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json() as Promise<Movie[]>;
}

export async function fetchCredits(id: number) {
  const res = await fetch(`/api/movies/${id}/credits`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json(); // 타입은 필요 시 정의
}
type Query = { q?: string; page?: number; size?: number; sort?: "latest" | "rating" };

export async function fetchMovies(query: Query = {}, token?: string) {
  const params = new URLSearchParams();

  // page는 보통 0-based라서 보정
  const pageIdx = Math.max(0, (query.page ?? 1) - 1);
  params.set("page", String(pageIdx));

  // size 기본값
  params.set("size", String(query.size ?? 20));

  if (query.q) params.set("q", query.q);

  // ✅ Spring 형식으로 변환
  if (query.sort === "latest") params.append("sort", "releaseDate,desc");
  if (query.sort === "rating") params.append("sort", "voteAverage,desc");

  // ✅ 목록 엔드포인트로 변경
  const url = `/api/movies/list?${params.toString()}`;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
  return res.json();
}
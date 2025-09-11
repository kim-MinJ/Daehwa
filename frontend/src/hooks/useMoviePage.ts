// src/hooks/useMoviePage.ts
import { useEffect, useState } from "react";

/** 훅이 반환하는 표준 형태 (TMDB-like) */
export type MovieDetail = {
  id?: number;
  title?: string;
  overview?: string;
  runtime?: number;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ name: string }>;
};
export type Person = {
  id?: number;
  name?: string;
  job?: string;
  department?: string;
  character?: string;
  profile_path?: string;
};
export type Credits = { cast: Person[]; crew: Person[] };

type State = {
  loading: boolean;
  error: string | null;
  movie: MovieDetail | null;
  credits: Credits | null;
  similar: MovieDetail[];
  trailers: any[];
};

/** 절대 URL → path 로 정규화 (TMDB 이미지 함수와 호환) */
const toPath = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) {
    try {
      const url = new URL(u);
      return url.pathname; // /t/p/w500/xxx.jpg
    } catch { return u; }
  }
  return u;
};

/** 백엔드 → TMDB-like 매핑 */
const mapMovie = (m: any): MovieDetail => ({
  id: m?.movieIdx ?? m?.id,
  title: m?.title,
  overview: m?.overview ?? m?.description ?? "",
  runtime: m?.runtime ?? 0,
  poster_path: toPath(m?.posterPath ?? m?.posterUrl ?? m?.poster_path),
  release_date: m?.releaseDate ?? m?.release_date ?? "",
  vote_average: typeof m?.voteAverage === "number" ? m?.voteAverage : (m?.vote_average ?? 0),
  vote_count: m?.voteCount ?? m?.vote_count ?? 0,
  genres: Array.isArray(m?.genres)
    ? m.genres.map((g: any) => (typeof g === "string" ? { name: g } : g))
    : m?.genre ? [{ name: m.genre }] : [],
});
const mapPerson = (p: any): Person => ({
  id: p?.id,
  name: p?.name,
  job: p?.job,
  department: p?.department,
  character: p?.character,
  profile_path: toPath(p?.profilePath ?? p?.profile_path ?? p?.profileUrl),
});

/** 안전 fetch: 여러 엔드포인트를 순차 시도 */
async function safeGet(urls: string[]) {
  for (const u of urls) {
    try {
      const r = await fetch(u);
      if (r.ok) return await r.json();
    } catch {}
  }
  throw new Error("fetch failed");
}

export function useMoviePage(id: number): State {
  const [state, setState] = useState<State>({
    loading: true, error: null, movie: null, credits: null, similar: [], trailers: [],
  });

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    let alive = true;

    (async () => {
      try {
        setState(s => ({ ...s, loading: true, error: null }));

        // 상세
        const detailRaw = await safeGet([
          `/api/movies/${id}`,
          `/api/movies/info/${id}`,
          `/api/movies/${id}`,
        ]);
        const movie = mapMovie(detailRaw);

        // 크레딧
        let credits: Credits = { cast: [], crew: [] };
        try {
          const cr = await safeGet([
            `/api/movies/${id}/credits`,
            `/api/movies/${id}/credits`,
          ]);
          credits = {
            cast: Array.isArray(cr?.cast) ? cr.cast.map(mapPerson) : [],
            crew: Array.isArray(cr?.crew) ? cr.crew.map(mapPerson) : [],
          };
        } catch {}

        // 비슷한 영화
        let similar: MovieDetail[] = [];
        try {
          const sr = await safeGet([
            `/api/movies/${id}/similar`,
            `/api/movies/${id}/similar`,
          ]);
          const arr = Array.isArray(sr) ? sr : (Array.isArray(sr?.content) ? sr.content : []);
          similar = arr.map(mapMovie);
        } catch {}

        // 예고편/영상
        let trailers: any[] = [];
        try {
          const vr = await safeGet([
            `/api/movies/${id}/videos`,
            `/api/movies/${id}/videos`,
          ]);
          trailers = Array.isArray(vr?.results) ? vr.results : (Array.isArray(vr) ? vr : []);
        } catch {}

        if (!alive) return;
        setState({ loading: false, error: null, movie, credits, similar, trailers });
      } catch (e: any) {
        if (!alive) return;
        setState({ loading: false, error: e?.message ?? "load error", movie: null, credits: null, similar: [], trailers: [] });
      }
    })();

    return () => { alive = false; };
  }, [id]);

  return state;
}

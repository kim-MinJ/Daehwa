// src/hooks/useMoviePage.ts
import { useEffect, useState } from "react";
import { useError } from "./ErrorContext";

export const genreMap: Record<string, string> = {
  Action: '액션',
  Adventure: '모험',
  Animation: '애니메이션',
  Comedy: '코미디',
  Crime: '범죄',
  Documentary: '다큐멘터리',
  Drama: '드라마',
  Family: '가족',
  Fantasy: '판타지',
  History: '역사',
  Horror: '공포',
  Music: '음악',
  Mystery: '미스터리',
  Romance: '로맨스',
  'Science Fiction': 'SF',
  'TV Movie': 'TV 영화',
  Thriller: '스릴러',
  War: '전쟁',
  Western: '서부극',
};

export type MovieDetail = {
  id?: number;
  title?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: Array<{ name: string }>;
};

export type CastPerson = {
  id: number;
  name: string;
  character: string;
  department?: string;
  profile_path?: string;
};

export type CrewPerson = {
  id: number;
  name: string;
  job: string;
  department?: string;
  profile_path?: string;
};

export type Credits = {
  cast: CastPerson[];
  crew: CrewPerson[];
};

type State = {
  loading: boolean;
  error: string | null;
  movie: MovieDetail | null;
  credits: Credits | null;
  similar: MovieDetail[];
  trailers: any[];
};

const toPath = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) {
    try {
      const url = new URL(u);
      return url.pathname;
    } catch { return u; }
  }
  return u;
};

const mapMovie = (m: any): MovieDetail => ({
  id: m?.movieIdx ?? m?.id,
  title: m?.title,
  overview: m?.overview ?? m?.description ?? "",
  poster_path: toPath(m?.posterPath ?? m?.posterUrl ?? m?.poster_path),
  release_date: m?.releaseDate ?? m?.release_date ?? "",
  vote_average: typeof m?.voteAverage === "number" ? m.voteAverage : (m?.vote_average ?? 0),
  vote_count: m?.voteCount ?? m?.vote_count ?? 0,
  genres: Array.isArray(m?.genres)
    ? m.genres.map((g: any) => (typeof g === "string" ? { name: g } : g))
    : m?.genre ? [{ name: m.genre }] : [],
});

const mapPerson = (p: any): CastPerson | CrewPerson => ({
  id: p?.id,
  name: p?.name,
  job: p?.job,
  department: p?.department,
  character: p?.character,
  profile_path: toPath(p?.profilePath ?? p?.profile_path ?? p?.profileUrl),
});

async function safeGet(urls: string[]) {
  for (const u of urls) {
    try {
      const r = await fetch(u);
      if (r.ok) return await r.json();
    } catch {}
  }
  throw new Error("fetch failed");
}

export function useMoviePage(id: number) {
  const { throwError } = useError(); // ErrorContext 사용
  const [state, setState] = useState<State>({
  loading: true,
  error: null,
  movie: null,
  credits: null,
  similar: [] as MovieDetail[],
  trailers: [] as any[],
});

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    let alive = true;

    (async () => {
      try {
        setState(s => ({ ...s, loading: true, error: null }));

        const detailRaw = await safeGet([
          `/api/movie/${id}`,
          `/api/movies/info/${id}`,
        ]);

        if (!detailRaw) throw new Error("영화 정보를 찾을 수 없습니다.");

        const movie = mapMovie(detailRaw);

        let credits = { cast: [], crew: [] };
        try {
          const cr = await safeGet([`/api/movies/${id}/credits`]);
          credits = {
            cast: Array.isArray(cr?.cast) ? cr.cast.map(mapPerson) : [],
            crew: Array.isArray(cr?.crew) ? cr.crew.map(mapPerson) : [],
          };
        } catch {}

        let similar: MovieDetail[] = [];
        try {
          const sr = await safeGet([`/api/movies/${id}/similar`]);
          const arr = Array.isArray(sr) ? sr : (Array.isArray(sr?.content) ? sr.content : []);
          similar = arr.map(mapMovie);
        } catch {}

        let trailers: any[] = [];
        try {
          const vr = await safeGet([`/api/movies/${id}/videos`]);
          trailers = Array.isArray(vr?.results) ? vr.results : (Array.isArray(vr) ? vr : []);
        } catch {}

        if (!alive) return;
        setState({ loading: false, error: null, movie, credits, similar, trailers });
      } catch (e: any) {
        if (!alive) return;
        // 🔥 에러 발생 시 ErrorPage로 이동
        throwError(e?.message ?? "영화 정보를 가져올 수 없습니다.", 500);
      }
    })();

    return () => { alive = false; };
  }, [id, throwError]);

  return state;
}

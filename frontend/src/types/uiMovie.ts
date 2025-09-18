// src/types/uiMovie.ts
import { Movie } from "./movie";

export interface UiMovie {
  id: number;
  title: string;
  poster: string;
  year: number;
  genre: string;
  rating: number;
  description: string;
  releaseDate: string | null;
  rank?: number;
  adult?: boolean;       // 원본 adult 그대로 사용
  adultText?: string;    // UI에서 보여줄 문구
}

/**
 * DB Movie를 UiMovie로 변환
 */
export const mapToUiMovie = (m: Movie): UiMovie => {
  const releaseYear = m.releaseDate ? Number(m.releaseDate.slice(0, 4)) : 0;
  const genreString = m.genres?.length ? m.genres.join(", ") : "기타";

  return {
    id: m.movieIdx,
    title: m.title?.trim() || "제목 없음",
    poster: m.posterPath || "",
    year: releaseYear,
    genre: genreString,
    rating: m.voteAverage ?? 0,
    description: m.overview?.trim() || "",
    releaseDate: m.releaseDate ?? null,
    rank: m.rank,
    adult: m.adult,
    adultText: m.adult ? "청소년 관람불가" : "",
  };
};

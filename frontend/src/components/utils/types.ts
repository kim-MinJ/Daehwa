export type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin'| 'main'| 'login'| 'mypage';

export interface Comment {
  commentIdx: number;
  userId: string;
  reviewIdx: number;
  content: string;
  createdAt: string;
  updateAt: string;
  isBlind: 0 | 1;
}

export interface Vote {
  id: string;
  movieTitle: string;
  voter: string;
  voteCount: number;
  status: "active" | "inactive";
}

export type UiMovie = {
  id: string | number;
  title: string;
  poster: string;
  backdropPath: string;
  year: number;
  genres: string[];
  rating: number;
  description?: string;
  releaseDate?: string | null;

  popularity?: number;   // TMDB 등에 흔히 존재
  voteCount?: number;    // 없으면 rating로 대체
};


export const KEYWORD_ACTIONS: Record<string, "feeling" | "button"> = {
  "슬퍼": "feeling",
  "우울": "feeling",
  "기뻐": "feeling",
  "설레": "feeling",
  "추천": "button",
  "추천해줘": "button",
};
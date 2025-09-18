// src/types/movie.ts

export interface Movie {
  movieIdx: number;
  tmdbMovieId?: number;
  title: string;
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  genres?: string[];
  popularity?: number;
  voteAverage?: number;
  voteCount?: number;
  adult?: boolean;
  rank?: number;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job?: string;
}

export interface Trailer {
  id: string;          // videoIdx를 string으로 변환해서 사용
  title: string;       // video의 title
  type: string;        // videoType
  url: string;         // videoUrl
  thumbnail: string;   // thumbnailUrl
}

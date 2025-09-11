export interface Movie {
  id: string;
  title: string;
  titleEn?: string;
  year: number;
  genre: string[];
  rating: number;
  poster: string;
  director: string;
  cast: string[];
  plot: string;
  duration: number;
  country: string;
  releaseDate: string;
  reviews?: Review[];
  boxOfficeRank?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
}

export interface TrendingMovie extends Movie {
  trendRank: number;
  trendChange: 'up' | 'down' | 'new' | 'same';
}
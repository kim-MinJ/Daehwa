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
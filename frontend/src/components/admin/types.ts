// src/types.ts

// --- 페이지 타입 ---
export type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin';

// --- 유저 타입 ---
export interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive' | 'banned';
  reviewCount: number;
}

// --- 리뷰 타입 ---
export interface Review {
  id: string;
  movieTitle: string;
  username: string;
  rating: number; // 1~5
  content: string;
  date: string; // YYYY-MM-DD
  status: 'approved' | 'pending' | 'rejected';
}

// --- 게시글 타입 ---
export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string; // YYYY-MM-DD
  views: number;
  status: 'published' | 'draft' | 'deleted';
}

// --- 공지사항 타입 ---
export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string; // YYYY-MM-DD
  isImportant: boolean;
  status: 'published' | 'draft';
}

// --- 투표 타입 ---
export interface Vote {
  id: string;
  movieTitle: string;
  voter: string;
  voteCount: number;
  status: 'active' | 'inactive';
}

// --- AdminPage Props ---
export interface AdminPageProps {
  onNavigation: (page: Page) => void;
  onBack: () => void;
}

// --- 새 공지 작성 상태 타입 ---
export interface NewNotice {
  title: string;
  content: string;
  isImportant: boolean;
}

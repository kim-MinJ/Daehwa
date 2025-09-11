// src/types.ts

// --- 페이지 타입 ---
export type Page = 'home' | 'movies' | 'ranking' | 'reviews' | 'movie-detail' | 'search' | 'admin';

// --- 유저 타입 ---
export interface User {
  id: string; // userId와 매칭
  username: string;
  status: "active" | "inactive" | "banned";
  regDate: string; // ISO 문자열, 백엔드 LocalDateTime → string으로 변환
}

// --- 리뷰 타입 ---
export interface Review {
  reviewIdx: number;
  movieIdx: number;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updateAt: string;
  isBlind: number;
}

export interface Movie {
  id: number;
  title: string;
}

// --- 댓글 타입 ---
export interface Comment {
  commentIdx: number;
  userId: string;      // 작성자 ID
  reviewIdx: number;   // 연결된 리뷰 ID
  content: string;
  createdAt: string;   // ISO 문자열
  updateAt: string;    // ISO 문자열
  isBlind: number;     // 0=정상, 1=블라인드 (백엔드에 없으면 기본 0)
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

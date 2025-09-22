import { create } from "zustand";
import axios from "axios";

export interface Bookmark { bookmarkIdx: number; movieIdx: number; title?: string; posterPath?: string; }
export interface Review { reviewIdx: number; movieIdx: number; content: string; rating: number; createdAt: string; updateAt: string; movieTitle?: string; }
export interface Comment { commentIdx: number; reviewIdx: number; content: string; createdAt: string; updateAt: string; }
export interface Movie { movieIdx: number; title: string; posterPath?: string; }

interface MyPageState {
  bookmarks: Bookmark[];
  reviews: Review[];
  comments: Comment[];
  recommendMovies: Movie[];
  loading: boolean;
  error: string | null;

  fetchBookmarks: (token: string) => Promise<void>;
  fetchReviews: (token: string) => Promise<void>;
  fetchComments: (token: string) => Promise<void>;
  fetchRecommendMovies: (token: string) => Promise<void>;
  fetchAllData: (token: string) => Promise<void>;
  fetchMyPageData: (token: string) => Promise<void>; // alias

  toggleBookmark: (movieIdx: number, token: string) => Promise<void>;
  isBookmarked: (movieIdx: number) => boolean; // 추가

  updateUsername: (username: string, token: string) => Promise<void>;
  updatePassword: (current: string, newPw: string, token: string) => Promise<void>;
  deleteAccount: (token: string) => Promise<void>;
  grantAdmin: (adminCode: string, token: string) => Promise<string>;
}

export const useMyPageStore = create<MyPageState>((set, get) => ({
  bookmarks: [],
  reviews: [],
  comments: [],
  recommendMovies: [],
  loading: false,
  error: null,

  fetchBookmarks: async (token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("/api/bookmarks", { headers: authHeader });
      set({ bookmarks: res.data });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "북마크 불러오기 실패" });
    }
  },

  fetchReviews: async (token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("/api/reviews/myreview", { headers: authHeader });
      set({ reviews: res.data });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "리뷰 불러오기 실패" });
    }
  },

  fetchComments: async (token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("/api/review/mycomments", { headers: authHeader });
      set({ comments: res.data });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "댓글 불러오기 실패" });
    }
  },

  fetchRecommendMovies: async (token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("/api/movies/popular", { headers: authHeader, params: { count: 40 } });
      const shuffled = [...res.data].sort(() => 0.5 - Math.random());
      set({ recommendMovies: shuffled.slice(0, 12) });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || "추천 영화 불러오기 실패" });
    }
  },

  fetchAllData: async (token) => {
    set({ loading: true, error: null });
    await Promise.all([
      get().fetchBookmarks(token),
      get().fetchReviews(token),
      get().fetchComments(token),
      get().fetchRecommendMovies(token),
    ]);
    set({ loading: false });
  },

  fetchMyPageData: (token) => get().fetchAllData(token), // alias

  toggleBookmark: async (movieIdx, token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    const existing = get().bookmarks.find(b => b.movieIdx === movieIdx);
    try {
      if (existing) {
        await axios.delete(`/api/bookmarks/${existing.bookmarkIdx}`, { headers: authHeader });
        set({ bookmarks: get().bookmarks.filter(b => b.movieIdx !== movieIdx) });
      } else {
        await axios.post("/api/bookmarks", null, { headers: authHeader, params: { movieIdx } });
        await get().fetchBookmarks(token);
      }
    } catch (err) {
      console.error(err);
    }
  },

  isBookmarked: (movieIdx: number) => get().bookmarks.some(b => b.movieIdx === movieIdx), // 추가

  updateUsername: async (username, token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    await axios.put("/api/users/update", { username }, { headers: authHeader });
  },

  updatePassword: async (current, newPw, token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    await axios.put("/api/users/password", { currentPassword: current, newPassword: newPw }, { headers: authHeader });
  },

  deleteAccount: async (token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    await axios.delete("/api/users/me", { headers: authHeader });
    set({ bookmarks: [], reviews: [], comments: [], recommendMovies: [] });
  },

  grantAdmin: async (adminCode, token) => {
    const authHeader = { Authorization: `Bearer ${token}` };
    const res = await axios.put("/api/admin/grant", null, { headers: authHeader, params: { adminCode } });
    return res.data.message;
  },
}));

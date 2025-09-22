// src/context/ApiContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { User, Review, Comment, Vote, Movie } from "../components/adminPage/types";

interface ApiContextValue {
  users: User[];
  reviews: Review[];
  comments: Comment[];
  movies: Movie[];
  votes: Vote[];
  fetchUsers: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  fetchComments: () => Promise<void>;
  fetchMovies: () => Promise<void>;
  fetchVotes: () => Promise<void>;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const authHeader = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  const fetchUsers = async () => {
    if (!token) return;
    const res = await api.get("/users", { headers: authHeader });
    setUsers(res.data);
  };

  const fetchReviews = async () => {
    if (!token) return;
    const res = await api.get("/reviews", { headers: authHeader });
    setReviews(res.data);
  };

  const fetchComments = async () => {
    if (!token) return;
    const res = await api.get("/review/comments", { headers: authHeader });
    setComments(res.data);
  };

  const fetchMovies = async () => {
    if (!token) return;
    const res = await api.get("/movie/all", { headers: authHeader });
    setMovies(res.data);
  };

  const fetchVotes = async () => {
    if (!token) return;
    const res = await api.get("/vs/movievote", { headers: authHeader });
    setVotes(res.data);
  };

  // 초기 데이터 한번 로딩
  useEffect(() => {
    fetchUsers();
    fetchReviews();
    fetchComments();
    fetchMovies();
    fetchVotes();
  }, [token]);

  return (
    <ApiContext.Provider
      value={{ users, reviews, comments, movies, votes, fetchUsers, fetchReviews, fetchComments, fetchMovies, fetchVotes }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}

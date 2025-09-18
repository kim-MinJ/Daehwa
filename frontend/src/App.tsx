// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDB } from "@/utils/indexedDB";
import { useMovieStore } from "@/store/movieStore";
import { useCreditsStore } from "@/store/creditsStore";
import { useTrailersStore } from "@/store/trailersStore";
import { useScrollStore } from "@/store/scrollStore";
import { useBackspaceNavigate } from "@/hooks/useBackspaceNavigate";

import Header from "./components/public/Header";
import Footer from "./components/public/Footer";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/DetailPage";
import RankingPage from "./pages/RankingPage";
import ReviewPage from "./pages/ReviewPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";

function AppContent() {
  const location = useLocation();
  const fetchFirstPage = useMovieStore((state) => state.fetchFirstPage);
  const fetchAllBackground = useMovieStore((state) => state.fetchAllBackground);

  const movies = useMovieStore((state) => state.movies);

  const creditsStore = useCreditsStore();
  const trailersStore = useTrailersStore();

  const scrollStore = useScrollStore();
  const [loading, setLoading] = useState(true);

  // 🔹 앱 초기화
  useEffect(() => {
    const initApp = async () => {
      await getDB();

      // 1️⃣ UI용 첫 페이지만 fetch → 메인페이지 바로 렌더링 가능
      await fetchFirstPage(50);
      setLoading(false);

      // 2️⃣ 백그라운드 전체 fetch (비동기)
      fetchAllBackground();

      const allMovies = useMovieStore.getState().allMovies;
      const movieIds = allMovies.map((m) => m.movieIdx);

      creditsStore.fetchAllBackground(movieIds);
      trailersStore.fetchAllBackground(movieIds);
    };
    initApp();
  }, []);

  // 🔹 페이지 이동 시 백그라운드 fetch 유지
  useEffect(() => {
    fetchAllBackground();

    const allMovies = useMovieStore.getState().allMovies;
    const movieIds = allMovies.map((m) => m.movieIdx);

    creditsStore.fetchAllBackground(movieIds);
    trailersStore.fetchAllBackground(movieIds);
  }, [location.pathname]);

  // 🔹 스크롤 복원
  useEffect(() => {
    const pos = scrollStore.getScroll(location.pathname);
    window.scrollTo(0, pos);
  }, [location.pathname]);

  // 🔹 스크롤 위치 저장
  useEffect(() => {
    const handleScroll = () => scrollStore.setScroll(location.pathname, window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // 🔹 렌더링 조건: 첫 페이지 데이터만 있으면 렌더링
  if (loading || movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">영화 데이터 로딩중...</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="*" element={<MainPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/reviews" element={<ReviewPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}

export default function App() {
  useBackspaceNavigate();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <AppContent />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

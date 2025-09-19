// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDB } from "@/utils/indexedDB";
import { useMovieStore } from "@/store/movieStore";
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
  const scrollStore = useScrollStore();

  // 🔹 loading은 UI용 첫 페이지 fetch만 기다림
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ UI용 첫 페이지 fetch
    fetchFirstPage(20).then(() => setLoading(false));

    // 2️⃣ IndexedDB 초기화는 백그라운드
    getDB().then(() => console.log("IndexedDB ready")).catch(console.error);
  }, []);

  // 🔹 페이지 이동 시 스크롤 복원
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

  if (loading) {
    // Skeleton UI는 MainPage에서 처리하므로 최소 로딩 스피너
    return <MainPage />;
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

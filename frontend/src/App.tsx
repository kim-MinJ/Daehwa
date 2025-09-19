// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

  // 🔹 앱 시작 시 UI용 첫 페이지 fetch & IndexedDB 백그라운드 초기화
  useEffect(() => {
    // IndexedDB 초기화는 백그라운드로 진행
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

  // 🔹 UI 렌더링은 바로 MainPage → Skeleton은 MainPage 내부 처리
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
        <main className="flex-grow relative">
          <AppContent />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

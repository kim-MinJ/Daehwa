import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import RankingPage from "./pages/RankingPage";
import ReviewPage from "./pages/ReviewPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import ChatBot from "./components/ChatBot";
import DetailReviewPage from "./pages/DetailReviewPage";
import ErrorProvider from "./hooks/ErrorContext";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <main className="relative">
            <Routes>
              {/* 메인 페이지 */}
              <Route path="/" element={<Navigate to="/main" replace />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movies/:id" element={<MovieDetailPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/reviews" element={<ReviewPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/movies/:id/review" element={<DetailReviewPage />} />

              {/* 에러 페이지 */}
              <Route path="/error" element={<ErrorPage />} />

              {/* 존재하지 않는 경로는 에러 페이지로 */}
              <Route path="*" element={<Navigate to="/error" replace />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </ErrorProvider>
    </BrowserRouter>
  );
}

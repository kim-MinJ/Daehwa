import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
// import MovieDetailPage from "./pages/MovieDetailPage";
// import RankingPage from "./pages/RankingPage";
import ReviewPage from "./pages/ReviewPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import  MyPage from "./pages/MyPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="relative">
          <Routes>
            <Route path="*" element={<MainPage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* <Route path="/movie/:id" element={<MovieDetailPage />} /> */}
            {/* <Route path="/ranking" element={<RankingPage />} /> */}
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}


// import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import { LoginPage } from "./pages/LoginPage";
// import { MyPage } from "./pages/MyPage";
// import { AdminPage } from "./pages/AdminPage";
// import MainPage from "./pages/MainPage"; // MainPage import
// import ReviewPage from "./pages/ReviewPage";

// function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

// function App() {
//   const navigate = useNavigate();

//   const handleNavigate = (page: string) => {
//     if (page === "main") navigate("/main");
//     else if (page === "login") navigate("/login");
//     else if (page === "mypage") navigate("/mypage");
//     else if (page === "admin") navigate("/admin");
//     else if (page === "reviews") navigate("/reviews");

//   };

//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/main" replace />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/main" element={<MainPage />} /> {/* MainPage 라우트 추가 */}
//       <Route path="/mypage" element={<MyPage onNavigate={handleNavigate} />} />
//       <Route path="/admin" element={<AdminPage onNavigation={handleNavigate} onBack={() => navigate("/mypage")} />} />
//         <Route path="/reviews" element={<ReviewPage  movies={[]} // 실제 영화 데이터 넣거나 빈 배열로 시작
//       onMovieClick={(movie) => console.log("Clicked:", movie)}
//       onBack={() => navigate(-1)}
//       onNavigation={handleNavigate} />} />
//     </Routes>
//   );
// }

// export default AppWrapper;

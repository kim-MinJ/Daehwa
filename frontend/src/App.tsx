// App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import ReviewPage from "./components/ReviewPage"
import { Page } from "./components/types";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  // onNavigate를 통해 페이지 이동 관리
const handleNavigate = (page: Page) => {
  switch(page) {
    case "main": navigate("/"); break;
    case "login": navigate("/login"); break;
    case "mypage": navigate("/mypage"); break;
    case "reviews":navigate("/reviews"); break;
  }
};

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage onNavigate={handleNavigate} />} />
      {/* 메인 페이지는 나중에 추가 가능 */}
      {/* <Route path="/" element={<MainPage onNavigate={handleNavigate} />} /> */}
      <Route path="/reviews" element={<ReviewPage  movies={[]} // 실제 영화 데이터 넣거나 빈 배열로 시작
      onMovieClick={(movie) => console.log("Clicked:", movie)}
      onBack={() => navigate(-1)}
      onNavigation={handleNavigate} />} />
    </Routes>
  );
}

export default AppWrapper;

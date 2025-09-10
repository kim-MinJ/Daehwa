import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import { AdminPage } from "./pages/AdminPage";
import MainPage from "./pages/MainPage"; // MainPage import

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (page === "main") navigate("/main");
    else if (page === "login") navigate("/login");
    else if (page === "mypage") navigate("/mypage");
    else if (page === "admin") navigate("/admin");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} /> {/* MainPage 라우트 추가 */}
      <Route path="/mypage" element={<MyPage onNavigate={handleNavigate} />} />
      <Route path="/admin" element={<AdminPage onNavigation={handleNavigate} onBack={() => navigate("/mypage")} />} />
    </Routes>
  );
}

export default AppWrapper;

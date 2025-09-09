import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import {AdminPage} from "./pages/AdminPage"; // AdminPage import

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  // 페이지 이동 관리
  const handleNavigate = (page: string) => {
    if (page === "main") navigate("/");        
    else if (page === "login") navigate("/login");
    else if (page === "mypage") navigate("/mypage");
    else if (page === "admin") navigate("/admin"); // 추가
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage onNavigate={handleNavigate} />} />
      <Route path="/admin" element={<AdminPage onNavigation={handleNavigate} onBack={() => navigate("/mypage")} />} />
    </Routes>
  );
}

export default AppWrapper;
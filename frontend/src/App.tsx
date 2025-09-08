import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";

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
  const handleNavigate = (page: string) => {
    if (page === "main") navigate("/");        // 메인 페이지는 아직 미구현
    else if (page === "login") navigate("/login");
    else if (page === "mypage") navigate("/mypage");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />  {/* / 접속 시 /login으로 리디렉트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mypage" element={<MyPage onNavigate={handleNavigate} />} />
      {/* 메인 페이지는 나중에 추가 가능 */}
      {/* <Route path="/" element={<MainPage onNavigate={handleNavigate} />} /> */}
    </Routes>
  );
}

export default AppWrapper;

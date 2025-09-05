import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* App.jsx의 '/' 경로와 App.tsx의 '/login' 경로는 동일한 LoginPage를 렌더링하므로 둘 다 유지합니다. */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App.tsx의 MyPage 경로는 그대로 유지합니다. */}
          <Route path="/mypage" element={<MyPage />} />

          {/* App.jsx의 주석을 반영하여 나중에 메인 페이지를 '/' 경로에 추가할 수 있음을 명시합니다. */}
          {/* 나중에 메인 페이지를 만들면 위쪽의 path="/" element를 MainPage 컴포넌트로 교체하면 됩니다. */}

          {/* 잘못된 경로로 접근 시 로그인 페이지로 이동시키는 Navigate 기능은 유지합니다. */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
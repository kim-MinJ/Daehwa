// src/pages/MainPage.tsx
import { useAuth } from "../hooks/useAuth";

export function MainPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate("login");
  };

  return (
    <div className="main-page">
      <h1>메인페이지</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

// src/pages/LoginPage.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { login, register, logout, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isLogin) {
        await login(userId, password);
        setLoggedIn(true);
        setMessage("로그인 성공!");
      } else {
        await register(userId, password, username);
        setMessage("회원가입 성공!");
        setIsLogin(true);
      }
      setUserId("");
      setPassword("");
      setUsername("");
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setMessage("로그아웃 되었습니다.");
  };

  return (
    <div className="w-screen h-screen bg-gray-50 relative">
      {/* 메인 버튼: 로그인 박스와 완전히 별개, 좌측 상단 고정 */}
      <Button
        variant="outline"
        className="fixed top-4 left-4 flex items-center gap-1 z-10"
        onClick={() => onNavigate("main")}
      >
        <ArrowLeft size={18} /> 메인
      </Button>

      {/* 로그인 박스: 화면 중앙 정사각형 */}
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-80 h-80 p-6 shadow-lg flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "로그인" : "회원가입"}
          </h1>

          {message && <p className="text-red-600 mb-4 text-center">{message}</p>}

          {!loggedIn ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {!isLogin && (
                <Input
                  placeholder="이름"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}
              <Input
                placeholder="아이디"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <Input
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="mt-2">
                {isLogin ? "로그인" : "회원가입"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={handleLogout}>로그아웃</Button>
              <Button onClick={() => onNavigate("mypage")}>마이페이지</Button>
            </div>
          )}

          <Button
            variant="link"
            className="mt-2 text-center"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
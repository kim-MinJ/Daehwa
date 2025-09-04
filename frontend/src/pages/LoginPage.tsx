// src/pages/LoginPage.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login, register, logout, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // 이전 메시지 초기화
    try {
      if (isLogin) {
        await login(userId, password);
        setMessage("로그인 성공!");
        setLoggedIn(true);
      } else {
        await register(userId, password, username);
        setMessage("회원가입 성공!");
        setIsLogin(true); // 회원가입 후 로그인 모드로 전환
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
    <Card className="p-6 max-w-md mx-auto mt-20">
      <h1 className="text-2xl mb-4">{isLogin ? "로그인" : "회원가입"}</h1>
      {message && <p className="text-red-600 mb-4">{message}</p>}

      {!loggedIn ? (
        <>
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
            <Button type="submit" disabled={loading}>
              {isLogin ? "로그인" : "회원가입"}
            </Button>
          </form>

          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
          </Button>
        </>
      ) : (
        <Button onClick={handleLogout} className="mt-4">
          로그아웃
        </Button>
      )}
    </Card>
  );
}
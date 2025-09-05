import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function LoginPage() {
  const { login, register, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        await login(userId, password);
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

  return (
    <div className="w-screen h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-80 p-6 shadow-lg bg-white flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "로그인" : "회원가입"}
        </h1>

        {message && <p className="text-red-600 text-center">{message}</p>}

        {!isLoggedIn ? (
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
            <Button type="submit">
              {isLogin ? "로그인" : "회원가입"}
            </Button>

            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col gap-2">
            <Button onClick={logout}>로그아웃</Button>
            <Button onClick={() => navigate("/mypage")}>마이페이지</Button>
          </div>
        )}
      </div>
    </div>
  );
}

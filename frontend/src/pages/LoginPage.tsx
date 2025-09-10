import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export function LoginPage() {
  const { login, register, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLogin(!isLoggedIn);
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        await login(userId, password);
        setMessage("로그인 성공!");
      } else {
        await register(userId, username, password);
        await login(userId, password);
        setMessage("회원가입 후 로그인 완료!");
      }

      setUserId("");
      setPassword("");
      setUsername("");

      navigate("/main");
    } catch (e: any) {
      setMessage(e.message || "오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/80">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* 배경 이미지 + 검은색 반투명 overlay */}
      <img
        src="/path-to-your-background.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70"></div>

      {/* 로그인 카드 */}
      <Card className="w-full max-w-md z-10 p-8 bg-black/80 backdrop-blur-md rounded-lg text-white shadow-xl">
        <CardContent className="p-0">
          {/* 로고/제목 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">MovieInfo</h1>
            <p className="text-gray-300">
              {!isLoggedIn
                ? isLogin
                  ? "계정에 로그인하세요"
                  : "새 계정을 만드세요"
                : "로그인 완료"}
            </p>
          </div>

          {/* 로그인/회원가입 토글 */}
          <div className="flex mb-6 bg-black/50 rounded-lg p-1">
            <Button
              type="button"
              variant={isLogin ? "default" : "ghost"}
              size="sm"
              className="flex-1 bg-red-600"
              onClick={() => setIsLogin(true)}
            >
              로그인
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "ghost"}
              size="sm"
              className="flex-1 bg-gray-700"
              onClick={() => setIsLogin(false)}
            >
              회원가입
            </Button>
          </div>

          {message && <p className="text-pink-500 text-center mb-2">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  이름
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-900 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="userId" className="text-gray-300">
                이메일
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
  id="userId"
  type="text" // 기존: "email" → 자유로운 텍스트
  placeholder="아이디를 입력하세요"
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  className="pl-10 bg-gray-900 text-white placeholder-gray-400"
  required
/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-900 text-white placeholder-gray-400"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  로그인 상태 유지
                </label>
                <a href="#" className="hover:underline text-red-600">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            )}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              {isLogin ? "로그인" : "계정 만들기"}
            </Button>
          </form>

          {!isLogin && (
            <p className="text-xs text-gray-400 text-center mt-6">
              계정을 만들면{" "}
              <a href="#" className="text-red-600 hover:underline">
                이용약관
              </a>{" "}
              과{" "}
              <a href="#" className="text-red-600 hover:underline">
                개인정보처리방침
              </a>{" "}
              에 동의하는 것입니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

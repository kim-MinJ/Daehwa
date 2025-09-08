import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";

export function LoginPage() {
  const { login, register, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // 로그인폼 표시 여부
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // 로그인 상태에 따라 화면 동기화
  useEffect(() => {
    if (isLoggedIn) {
      setIsLogin(false); // 로그인 상태면 버튼 화면
    } else {
      setIsLogin(true); // 로그아웃 상태면 로그인폼
    }
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
        await login(userId, password); // 회원가입 후 자동 로그인
        setMessage("회원가입 후 로그인 완료!");
      }

      setUserId("");
      setPassword("");
      setUsername("");
    } catch (e: any) {
      setMessage(e.message || "오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10"></div>

      {/* 메인 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-6 left-6 z-10"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        메인으로 돌아가기
      </Button>

      {/* 카드 */}
      <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-card/80 backdrop-blur">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">MovieInfo</h1>
            <p className="text-muted-foreground">
              {!isLoggedIn
                ? isLogin
                  ? "계정에 로그인하세요"
                  : "새 계정을 만드세요"
                : "로그인 완료"}
            </p>
          </div>

          {!isLoggedIn || isLogin ? (
            <>
              {/* 로그인/회원가입 토글 */}
              <div className="flex mb-6 bg-muted rounded-lg p-1">
                <Button
                  type="button"
                  variant={isLogin ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsLogin(true)}
                >
                  로그인
                </Button>
                <Button
                  type="button"
                  variant={!isLogin ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsLogin(false)}
                >
                  회원가입
                </Button>
              </div>

              {message && <p className="text-red-600 text-center mb-2">{message}</p>}

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">이름</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 bg-input-background"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="userId">아이디</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="userId"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10 bg-input-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-input-background"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      로그인 상태 유지
                    </label>
                    <a href="#" className="text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </a>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  {isLogin ? "로그인" : "계정 만들기"}
                </Button>
              </form>
            </>
          ) : (
            // 로그인 상태일 때 버튼 화면
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  logout(); // 상태 갱신
                }}
              >
                로그아웃
              </Button>
              <Button onClick={() => navigate("/mypage")}>마이페이지</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

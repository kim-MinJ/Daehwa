// src/pages/LoginPage.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(userId, password);
      } else {
        await register(userId, password, username);
      }
      onNavigate("main");
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{isLogin ? "로그인" : "회원가입"}</h1>
            <Button variant="outline" size="sm" onClick={() => onNavigate("main")}>
              <ArrowLeft className="mr-2 w-4 h-4" /> 메인
            </Button>
          </div>

          {message && <p className="text-red-600 mb-2">{message}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <Label>이름</Label>
                <Input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label>아이디</Label>
              <Input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div>
              <Label>비밀번호</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {isLogin ? "로그인" : "회원가입"}
            </Button>
          </form>

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "회원가입으로 전환" : "로그인으로 전환"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

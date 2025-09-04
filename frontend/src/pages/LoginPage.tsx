import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(""); // 성공 메시지 표시

  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(userId, password);
        setMessage("로그인 성공!");
      } else {
        await register(userId, password, username);
        setMessage("회원가입 성공!");
        setIsLogin(true); // 회원가입 후 로그인 모드로 전환
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMyPage = () => {
    navigate("/mypage"); // 임시 마이페이지 이동
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardContent>
          <h1>{isLogin ? "로그인" : "회원가입"}</h1>
          {message && (
            <Input value={message} readOnly className="mb-4 text-center" />
          )}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Label>이름</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </>
            )}
            <Label>아이디</Label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Label>비밀번호</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {isLogin ? "로그인" : "회원가입"}
            </Button>
          </form>
          {message === "로그인 성공!" && (
            <Button type="button" onClick={handleMyPage} className="mt-2">
              마이페이지 이동
            </Button>
          )}
          <Button type="button" onClick={() => setIsLogin(!isLogin)} className="mt-2">
            {isLogin ? "회원가입으로" : "로그인으로"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

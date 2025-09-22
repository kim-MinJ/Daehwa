import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const { login, register, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 🎬 포스터 슬라이드
  const [posters, setPosters] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);

useEffect(() => {
    if (isLoggedIn) setIsLogin(true);
}, [isLoggedIn]);

  useEffect(() => {
    async function fetchPosters() {
      try {
        const res = await axios.get("/api/movies/popular?count=8");
        const posterBase = "https://image.tmdb.org/t/p/w500";
        const posterUrls = res.data.map((movie: any) => posterBase + movie.posterPath);
        setPosters(posterUrls);
      } catch (e) {
        console.error("포스터 불러오기 실패:", e);
      }
    }
    fetchPosters();
  }, []);

  useEffect(() => {
    if (posters.length === 0) return;
    let animationFrame: number;
    const speed = 1;

    const animate = () => {
      setOffset(prev => {
        const totalWidth = posters.length * window.innerWidth;
        const next = prev + speed;
        return next >= totalWidth ? 0 : next;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [posters]);    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        await login(userId, password, rememberMe);
        setMessage("로그인 성공!");
      } else {
        await register(userId, username, password);
        await login(userId, password, rememberMe);  
        setMessage("회원가입 후 로그인 완료!");
      }

      setUserId("");
      setPassword("");
      setUsername("");

      navigate("/");
    } catch (e: any) {
      setMessage(e.message || "오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black/80">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 슬라이드 이미지 */}
      <div
        className="absolute top-0 left-0 h-screen flex"
  style={{
    transform: `translateX(-${offset}px)`,
    transition: "transform 0.05s linear",
  }}
>
 {[...posters, ...posters].map((poster, idx) => (
    <img
      key={idx}
      src={poster}
      alt="poster"
            className="h-screen object-cover flex-shrink-0"
    />
  ))}
</div>

      {/* 검은색 overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* 로그인 카드 */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Card className="w-full max-w-md p-8 rounded-lg bg-black/40 backdrop-blur-md shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] text-white">
  <CardContent className="p-0 space-y-4 text-white">
    <div className="text-center mb-6">
      <h6 className="text-xl font-bold text-red-400 mb-4">MovieSSG</h6>
      <p className="text-gray-300">
        {!isLoggedIn
          ? isLogin
            ? "계정에 로그인하세요"
            : "새 계정을 만드세요"
          : "로그인 완료"}
      </p>
    </div>

    {/* 로그인/회원가입 탭 버튼 */}
    <div className="flex mb-6 bg-black/50 rounded-lg p-1">
      <Button
        type="button"
        variant={isLogin ? "default" : "ghost"}
        size="sm"
        className="flex-1 bg-red-600/70 hover:bg-red-600 transition"
        onClick={() => setIsLogin(true)}
      >
        로그인
      </Button>
      <Button
        type="button"
        variant={!isLogin ? "default" : "ghost"}
        size="sm"
        className="flex-1 bg-gray-700/70 hover:bg-gray-700 transition"
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
            type="text"
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
            <input
  type="checkbox"
  className="mr-2"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
            로그인 상태 유지
          </label>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-red-600/70 hover:bg-red-600 transition"
      >
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
    </div>
  );
}

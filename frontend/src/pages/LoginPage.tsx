import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "./LoginPage.css";

export function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [posters, setPosters] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  const { login, register, logout, loading, error } = useAuth();

  // TMDB API 백엔드 호출
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        const urls = data.results.map((movie: any) => `https://image.tmdb.org/t/p/original${movie.poster_path}`);
        setPosters(urls);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosters();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % posters.length);
    }, 150000);
    return () => clearInterval(interval);
  }, [posters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isLogin) {
        await login(email, password);
        setMessage("로그인 성공!");
      } else {
        await register(email, password, name);
        setMessage("회원가입 성공!");
        setIsLogin(true);
      }
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      if (!isLogin && err.message.includes("exists")) {
        setMessage("이미 존재하는 ID입니다.");
      } else {
        setMessage(error || "실패했습니다.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    setMessage("로그아웃 되었습니다.");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="login-page">
      <h1>MOVIE SSG</h1>
      <div>
        <button onClick={() => setIsLogin(true)}>로그인</button>
        <button onClick={() => setIsLogin(false)}>회원가입</button>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button type="submit" disabled={loading}>
          {isLogin ? "로그인" : "계정 만들기"}
        </button>
      </form>
      {isLogin && <button onClick={handleLogout}>로그아웃</button>}
      {message && <p>{message}</p>}
    </div>
  );
}

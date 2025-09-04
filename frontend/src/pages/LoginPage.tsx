import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
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

  const { login, register, logout, loading, error } = useAuth();

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
    <div className="relative min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* 로그인 카드 */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">MOVIE SSG</h1>
          <button
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => onNavigate("main")}
          >
            <ArrowLeft className="w-5 h-5 mr-1" /> 메인
          </button>
        </div>

        <p className="mb-4 text-gray-600">{isLogin ? "계정에 로그인하세요" : "새 계정을 만드세요"}</p>

        {message && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>}

        <div className="flex mb-4 gap-2">
          <button
            className={`flex-1 py-2 rounded ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </button>
          <button
            className={`flex-1 py-2 rounded ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-1">이름</label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">비밀번호</label>
            <div className="flex items-center border rounded">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 rounded-l"
              />
              <button
                type="button"
                className="px-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLogin ? "로그인" : "계정 만들기"}
          </button>
        </form>

        {isLogin && message === "로그인 성공!" && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
}

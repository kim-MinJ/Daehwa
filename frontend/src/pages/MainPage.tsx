import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  userId: string;
  username: string;
  token: string;
}

export function MainPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data: UserInfo = await res.json();
      setUser(data);
    } catch (e: any) {
      localStorage.removeItem("token");
      setError("세션이 만료되었습니다. 다시 로그인 해주세요.");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">환영합니다, {user.username}님!</h1>
      <p>아이디: {user.userId}</p>
      <p>토큰: {user.token}</p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}

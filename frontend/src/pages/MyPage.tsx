import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function MyPage() {
  const navigate = useNavigate();
  const { getUserInfo, logout, token } = useAuth();
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate, token, getUserInfo]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="w-screen h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-80 p-6 shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">마이페이지</h1>
        {userInfo && (
          <div className="flex flex-col gap-2">
            <p>이름: {userInfo.username}</p>
            <p>이메일: {userInfo.email}</p>
            <Button onClick={handleLogout}>로그아웃</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

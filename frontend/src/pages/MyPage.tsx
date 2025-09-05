import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function MyPage() {
  const navigate = useNavigate();
  const { getUserInfo, logout, updateUser, token } = useAuth();

  const [userInfo, setUserInfo] = useState<{ username: string } | null>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 마운트 시 1번만 조회
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const data: { username: string } = await getUserInfo();
        setUserInfo(data);
        setNewUsername(data.username || ""); // **초기값 세팅**
      } catch (e: any) {
        setError(e.message || "사용자 정보를 가져올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, navigate, getUserInfo]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      const updated: { username: string } = await updateUser(newUsername);
      setUserInfo(updated);
      setSuccess("이름이 수정되었습니다 ✅");
    } catch (e: any) {
      setError(e.message || "수정 실패");
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;
  if (error && !userInfo) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="w-screen h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-80 p-6 shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">마이페이지</h1>

        {userInfo && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">이름</label>
            <Input
  value={newUsername}
  onChange={(e) => setNewUsername(e.target.value)}
/>

            <Button onClick={handleUpdate}>수정하기</Button>
            <Button variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>

            {success && <p className="text-green-600 text-center">{success}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export function MyPage() {
  const { token, userInfo } = useAuth();
  const [movie, setMovie] = useState<any>(null); // 랜덤 영화 한 개
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError("");

    axios.get("http://localhost:8080/api/movies/random", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setMovie(res.data);
    })
    .catch(err => {
      console.error(err);
      if (err.response?.status === 403) {
        setError("권한이 없습니다. 다시 로그인 해주세요.");
        navigate("/login");
      } else {
        setError("영화 데이터를 불러오는데 실패했습니다.");
      }
    })
    .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* 상단 메인 버튼 */}
      <div className="absolute top-4 left-4">
        <Button onClick={() => navigate("/")}>메인페이지</Button>
      </div>

      {/* 로그인박스 UI */}
      <Card className="w-[400px] p-4 shadow-lg">
        <CardHeader>
          <CardTitle>{userInfo?.username}님, 오늘의 추천 영화</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && movie && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              className="w-[300px] rounded-lg shadow-md"
            />
          )}
          {!loading && !error && !movie && <p>추천 영화가 없습니다.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

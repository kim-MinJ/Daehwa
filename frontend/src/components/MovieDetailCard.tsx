import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Calendar, Heart, Users } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MovieDetailCardProps {
  title?: string;
  year?: string;
  rating?: string;
  genre?: string[];
  director?: string;
  cast?: string[];
  description?: string;
  posterUrl?: string;
  userRating?: number;
  movieIdx?: number; // 필수: 북마크용
  token: string | null;// JWT 토큰 필요
}

export function MovieDetailCard({
  title = "영화 제목",
  year = "2023",
  rating = "15세 이상 관람가",
  genre = ["액션", "드라마", "스릴러"],
  director = "김감독",
  cast = ["배우1", "배우2", "배우3"],
  description = "줄거리 정보 없음",
  posterUrl, 
  userRating = 4.5,
  movieIdx,
  token,
}: MovieDetailCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const authHeader = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  // 1️⃣ 초기 북마크 상태 확인
  useEffect(() => {
    if (!movieIdx) return;
    axios
      .get("/api/bookmarks", { headers: authHeader })
      .then((res) => {
        const exists = res.data.some((b: any) => b.movieIdx === movieIdx);
        setBookmarked(exists);
      })
      .catch(console.error);
  }, [movieIdx, token]);

  // 2️⃣ 북마크 토글
  // 2️⃣ 북마크 토글
const toggleBookmark = async () => {
  if (!token) {
    alert("로그인해야 찜할 수 있어요!");
    return;
  }
  if (!movieIdx) return;
    try {
      if (bookmarked) {
        // DB에서 해당 북마크 찾아서 삭제
        const res = await axios.get("/api/bookmarks", { headers: authHeader });
        const bm = res.data.find((b: any) => b.movieIdx === movieIdx);
        if (bm) {
          await axios.delete(`/api/bookmarks/${bm.bookmarkIdx}`, { headers: authHeader });
        }
        setBookmarked(false); // UI 즉시 반영
      } else {
        // 북마크 추가
        await axios.post("/api/bookmarks", null, { params: { movieIdx }, headers: authHeader });
        setBookmarked(true); // UI 즉시 반영
      }
    } catch (err) {
      console.error(err);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  // 3️⃣ 공유하기
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 복사되었습니다!");
  };

  return (
    <Card className="p-6 w-full">
      <div className="flex gap-8">
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={posterUrl}
            alt={title}
            className="w-64 h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{year}</span>
              </div>
              <Badge variant="outline">{rating}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(userRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2">{userRating}/10.0</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3>장르</h3>
            <div className="flex gap-2">
              {genre.map((g, idx) => (
                <Badge key={idx} variant="secondary">{g}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3>감독</h3>
              <p className="text-muted-foreground">{director}</p>
            </div>
            <div>
              <h3>주요 출연진</h3>
              <p className="text-muted-foreground">{cast.join(", ")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3>줄거리</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="flex gap-3 pt-4">
            {/* 평가하기 버튼 */}
            <Button className="flex items-center gap-2"
            onClick={() => movieIdx && navigate(`/movies/${movieIdx}/review`)}
            >
              <Users className="w-4 h-4" /> 평가하기
            </Button>

            {/* 북마크 */}
            <Button className="flex items-center gap-2" onClick={toggleBookmark}>
  <Heart
    className="w-4 h-4"
    fill={bookmarked ? "white" : "none"}   // 채움 여부
    stroke={bookmarked ? "white" : "currentColor"} // 테두리 색
  /> 
  {bookmarked ? "찜안해!" : "찜하기"}
</Button>

            {/* 공유하기 */}
            <Button variant="outline" onClick={copyLink}>
              공유하기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// src/components/cards/DetailCard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Star, Users, Heart } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../imageFallback/ImageWithFallback";
import axios from "axios";

export interface DetailCardProps {
  title?: string;
  year?: string;
  adultText?: string;        // 청소년 관람불가 문구
  genre?: string[];
  director?: string;
  runtime?: string;
  description?: string;
  posterUrl?: string;
  userRating?: number;       // 0~10 범위
  movieIdx?: number;         // 북마크/리뷰용
  token?: string | null;     // JWT 토큰
}

export function DetailCard({
  title,
  year,
  adultText,
  genre,
  director,
  runtime,
  description,
  posterUrl,
  userRating = 0,
  movieIdx,
  token
}: DetailCardProps) {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const genreList = genre ?? [];
  const authHeader = token ? { Authorization: `Bearer ${token}` } : undefined;

  // 초기 북마크 상태 확인
  useEffect(() => {
    if (!movieIdx || !token) return;
    axios
      .get("/api/bookmarks", { headers: authHeader })
      .then(res => {
        const exists = res.data.some((b: any) => b.movieIdx === movieIdx);
        setBookmarked(exists);
      })
      .catch(console.error);
  }, [movieIdx, token]);

  // 북마크 토글
  const toggleBookmark = async () => {
    if (!token) {
      alert("로그인해야 찜할 수 있어요!");
      return;
    }
    if (!movieIdx) return;
    try {
      if (bookmarked) {
        const res = await axios.get("/api/bookmarks", { headers: authHeader });
        const bm = res.data.find((b: any) => b.movieIdx === movieIdx);
        if (bm) await axios.delete(`/api/bookmarks/${bm.bookmarkIdx}`, { headers: authHeader });
        setBookmarked(false);
      } else {
        await axios.post("/api/bookmarks", null, { params: { movieIdx }, headers: authHeader });
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
      alert("북마크 처리 중 오류가 발생했습니다.");
    }
  };

  // 공유하기
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 복사되었습니다!");
  };

  // 별 5개로 별점 10점 단위로 표시 (반별 가능)
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(userRating); // 10점 단위 정수
    for (let i = 1; i <= 5; i++) {
      const starValue = i * 2; // 별 하나 = 2점
      let fillClass = "text-gray-300";
      let isHalf = false;

      if (rating >= starValue) {
        fillClass = "fill-yellow-400 text-yellow-400"; // 꽉 찬 별
      } else if (rating >= starValue - 1) {
        isHalf = true; // 반별
      }

      stars.push(
        <span key={i} className="relative w-5 h-5">
          <Star className={`w-5 h-5 ${fillClass}`} />
          {isHalf && (
            <Star
              className="w-5 h-5 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          )}
        </span>
      );
    }
    return stars;
  };

  return (
    <Card className="p-6 w-full">
      <div className="flex gap-8">
        {/* 포스터 */}
        {posterUrl && (
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={posterUrl}
              alt={title}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* 상세 정보 */}
        <div className="flex-1 space-y-6">
          {(title || year || runtime || adultText) && (
            <div className="space-y-3">
              {title && <h1 className="text-3xl">{title}</h1>}

              <div className="flex items-center gap-4 text-muted-foreground">
                {year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{runtime}</span>
                  </div>
                )}
                {adultText && <Badge variant="outline">{adultText}</Badge>}
              </div>

              {/* 평점 */}
              {userRating > 0 && (
                <div className="flex items-center gap-2">
                  {renderStars()}
                  <span className="ml-2">{userRating.toFixed(1)}/10</span>
                </div>
              )}
            </div>
          )}

          {/* 장르 */}
          {genreList.length > 0 && (
            <div className="space-y-2">
              <h3>장르</h3>
              <div className="flex gap-2">
                {genreList.map((g, index) => (
                  <Badge key={index} variant="secondary">{g}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* 감독 */}
          {director && (
            <div className="space-y-4">
              <h3>감독</h3>
              <p className="text-muted-foreground">{director}</p>
            </div>
          )}

          {/* 줄거리 */}
          {description && (
            <div className="space-y-2">
              <h3>줄거리</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            {/* 평가하기 */}
            <Button
              className="flex items-center gap-2"
              onClick={() => movieIdx && navigate(`/movie/${movieIdx}/review`)}
            >
              <Users className="w-4 h-4" /> 평가하기
            </Button>

            {/* 북마크 */}
            <Button className="flex items-center gap-2" onClick={toggleBookmark}>
              <Heart
                className="w-4 h-4"
                fill={bookmarked ? "white" : "none"}
                stroke={bookmarked ? "white" : "currentColor"}
              />
              {bookmarked ? "찜하기" : "찜하기"}
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

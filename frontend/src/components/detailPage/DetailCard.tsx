import { Calendar, Clock, Star, Users } from "lucide-react";
import { ImageWithFallback } from "../imageFallback/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export interface DetailCardProps {
  title?: string;
  year?: string;
  adultText?: string;        // 청소년 관람불가 문구
  genre?: string[];
  director?: string;
  runtime?: string;
  description?: string;
  posterUrl?: string;
  userRating?: number;
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
  userRating = 0
}: DetailCardProps) {
  const genreList = genre ?? [];

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
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(userRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2">{userRating.toFixed(1)}/5.0</span>
                  </div>
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
                  <Badge key={index} variant="secondary">
                    {g}
                  </Badge>
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
            <Button className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              평가하기
            </Button>
            <Button variant="outline">찜하기</Button>
            <Button variant="outline">공유하기</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

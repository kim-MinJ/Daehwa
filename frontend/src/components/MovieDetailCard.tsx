import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, Calendar, Clock, Users } from "lucide-react";

interface MovieDetailCardProps {
  title?: string;
  year?: string;
  rating?: string;
  genre?: string[];
  director?: string;
  cast?: string[];
  runtime?: string;
  description?: string;
  posterUrl?: string;
  userRating?: number;
}

export function   MovieDetailCard({ 
  title = "영화 제목", 
  year = "2023", 
  rating = "15세 이상 관람가",
  genre = ["액션", "드라마", "스릴러"],
  director = "김감독",
  cast = ["배우1", "배우2", "배우3"],
  runtime = "120분",
  description = "이곳에는 선택된 영화의 상세한 줄거리와 정보가 표시됩니다. 영화의 배경, 주요 갈등, 캐릭터들의 관계 등이 자세히 설명됩니다.",
  posterUrl = "https://images.unsplash.com/photo-1618410321132-9f4cebb2f7f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYSUyMGZpbG18ZW58MXx8fHwxNzU2NDU2NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  userRating = 4.5
}: MovieDetailCardProps) {
  return (
    <Card className="p-6 w-full">
      <div className="flex gap-8">
        {/* 포스터 영역 */}
        <div className="flex-shrink-0">
          <ImageWithFallback 
            src={posterUrl}
            alt={title}
            className="w-64 h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        {/* 영화 상세 정보 영역 */}
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{runtime}</span>
              </div>
              <Badge variant="outline">{rating}</Badge>
            </div>
            
            {/* 평점 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2">{userRating}/5.0</span>
              </div>
            </div>
          </div>
          
          {/* 장르 */}
          <div className="space-y-2">
            <h3>장르</h3>
            <div className="flex gap-2">
              {genre.map((g, index) => (
                <Badge key={index} variant="secondary">{g}</Badge>
              ))}
            </div>
          </div>
          
          {/* 감독 및 출연진 */}
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
          
          {/* 줄거리 */}
          <div className="space-y-2">
            <h3>줄거리</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex gap-3 pt-4">
            <Button className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              평가하기
            </Button>
            <Button variant="outline">
              찜하기
            </Button>
            <Button variant="outline">
              공유하기
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
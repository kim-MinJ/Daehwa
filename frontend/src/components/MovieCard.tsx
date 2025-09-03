import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MovieCardProps {
  title?: string;
  year?: string;
  rating?: string;
  description?: string;
  posterUrl?: string;
}

export function MovieCard({ 
  title = "영화 제목", 
  year = "2023", 
  rating = "15세 이상",
  description = "영화에 대한 간단한 설명이 들어갑니다.",
  posterUrl = "https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
}: MovieCardProps) {
  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex gap-6">
        {/* 포스터 영역 */}
        <div className="flex-shrink-0">
          <ImageWithFallback 
            src={posterUrl}
            alt={title}
            className="w-48 h-72 object-cover rounded-lg"
          />
        </div>
        
        {/* 영화 정보 영역 */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl">{title}</h2>
            <div className="flex gap-4 text-muted-foreground">
              <span>{year}</span>
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3>줄거리</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex gap-2">
            <Button className="bg-primary text-primary-foreground">
              (이전, 다음 버튼)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
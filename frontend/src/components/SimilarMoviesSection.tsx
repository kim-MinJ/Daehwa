import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SimilarMovie {
  id: number;
  title: string;
  year: string;
  genre: string[];
  rating: number;
  posterUrl: string;
  matchReason: string;
}

interface SimilarMoviesSectionProps {
  movies?: SimilarMovie[];
}

export function SimilarMoviesSection({ movies }: SimilarMoviesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const defaultMovies: SimilarMovie[] = [
    {
      id: 1,
      title: "비슷한 영화 1",
      year: "2022",
      genre: ["액션", "드라마"],
      rating: 4.2,
      posterUrl: "https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBmaWxtJTIwcG9zdGVyfGVufDF8fHx8MTc1NjM5OTg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      matchReason: "같은 감독"
    },
    {
      id: 2,
      title: "비슷한 영화 2",
      year: "2023",
      genre: ["스릴러", "액션"],
      rating: 4.5,
      posterUrl: "https://images.unsplash.com/photo-1620153850780-0883dd907257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGZpbG18ZW58MXx8fHwxNzU2MzYxMTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      matchReason: "비슷한 장르"
    },
    {
      id: 3,
      title: "비슷한 영화 3",
      year: "2021",
      genre: ["드라마", "액션"],
      rating: 3.8,
      posterUrl: "https://images.unsplash.com/photo-1696366167365-77b4bcb5f1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBwb3N0ZXJ8ZW58MXx8fHwxNzU2NDU2MjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      matchReason: "같은 주연배우"
    },
    {
      id: 4,
      title: "비슷한 영화 4",
      year: "2023",
      genre: ["액션", "스릴러"],
      rating: 4.1,
      posterUrl: "https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBmaWxtJTIwcG9zdGVyfGVufDF8fHx8MTc1NjM5OTg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      matchReason: "비슷한 테마"
    },
    {
      id: 5,
      title: "비슷한 영화 5",
      year: "2022",
      genre: ["드라마", "스릴러"],
      rating: 4.3,
      posterUrl: "https://images.unsplash.com/photo-1620153850780-0883dd907257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGZpbG18ZW58MXx8fHwxNzU2MzYxMTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      matchReason: "제작사 추천"
    }
  ];

  const displayMovies = movies || defaultMovies;
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, displayMovies.length - itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2>비슷한 키워드 영화 추천</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {displayMovies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-1/4 min-w-0">
                <div className="group cursor-pointer space-y-3">
                  <div className="relative overflow-hidden rounded-lg">
                    <ImageWithFallback 
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* 매치 이유 배지 */}
                    <Badge className="absolute top-2 left-2 text-xs bg-primary/90">
                      {movie.matchReason}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="line-clamp-1">{movie.title}</h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {movie.genre.slice(0, 2).map((g, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
import { Star, Play, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Movie } from '../types/movie';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedMovieCardProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
}

export function FeaturedMovieCard({ movie, onMovieClick }: FeaturedMovieCardProps) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* 영화 포스터 */}
        <div className="flex-shrink-0">
          <div className="relative w-48 h-72 mx-auto lg:mx-0">
            <ImageWithFallback
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={movie.rating >= 8 ? "default" : "secondary"} className="bg-black/70 text-white">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {movie.rating}
              </Badge>
            </div>
          </div>
        </div>

        {/* 영화 정보 */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                대도 엄마 재단
              </Badge>
              <Badge variant="secondary">
                {movie.genre}
              </Badge>
            </div>
            <h2 className="text-2xl mb-2">{movie.title}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.director}</span>
              <span>•</span>
              <span>{movie.duration}분</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {movie.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => onMovieClick(movie)} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              재생하기
            </Button>
            <Button variant="outline" onClick={() => onMovieClick(movie)} className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              상세 정보
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">평점 {movie.rating}/10</span>
            </div>
            <div className="text-sm text-muted-foreground">
              리뷰 {Math.floor(Math.random() * 1000 + 100)}개
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
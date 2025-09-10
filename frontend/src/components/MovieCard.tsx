import { Star, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Movie, TrendingMovie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  isTrending?: boolean;
}

export function MovieCard({ movie, onClick, isTrending = false }: MovieCardProps) {
  const trendingMovie = movie as TrendingMovie;
  const showTrendRank = isTrending && 'trendRank' in movie;

  const getTrendIcon = () => {
    if (!showTrendRank) return null;
    switch (trendingMovie.trendChange) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'new':
        return <Badge variant="secondary" className="text-xs px-2 py-1">NEW</Badge>;
      default:
        return <div className="w-4 h-4" />; // placeholder for same
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {showTrendRank && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="default" className="text-sm font-bold">
              #{trendingMovie.trendRank}
            </Badge>
          </div>
        )}
        
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {getTrendIcon()}
        </div>
        
        <ImageWithFallback
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{movie.rating}</span>
            </div>
            <Button variant="secondary" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              찜하기
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          {movie.titleEn && (
            <p className="text-sm text-muted-foreground line-clamp-1">{movie.titleEn}</p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{movie.year}</span>
            <span>{movie.genre.slice(0, 2).join(', ')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{movie.rating}</span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
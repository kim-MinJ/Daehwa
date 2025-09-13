import { Trophy, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Movie } from '../types/movie';

interface BoxOfficeRankingProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export function BoxOfficeRanking({ movies, onMovieClick }: BoxOfficeRankingProps) {
  const rankedMovies = movies
    .filter(movie => movie.boxOfficeRank)
    .sort((a, b) => (a.boxOfficeRank || 999) - (b.boxOfficeRank || 999));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankChange = () => {
    // Mock rank change data
    const changes = ['up', 'down', 'same', 'new'];
    return changes[Math.floor(Math.random() * changes.length)];
  };

  const getRankChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'new':
        return <Badge variant="secondary" className="text-xs px-1 py-0">NEW</Badge>;
      default:
        return <div className="w-4 h-4" />; // placeholder for same
    }
  };

  return (
    <section id="ranking" className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">박스오피스 순위</h2>
        </div>
        
        <div className="grid gap-4">
          {rankedMovies.map((movie, index) => {
            const rankChange = getRankChange();
            return (
              <Card 
                key={movie.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onMovieClick(movie)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-20 h-full flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        {getRankIcon(movie.boxOfficeRank!)}
                        <div className="text-xs text-muted-foreground mt-1">
                          {getRankChangeIcon(rankChange)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Movie Poster */}
                    <div className="flex-shrink-0 w-20 h-28 overflow-hidden">
                      <ImageWithFallback
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Movie Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{movie.title}</h3>
                          {movie.titleEn && (
                            <p className="text-sm text-muted-foreground mb-2">{movie.titleEn}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{movie.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{movie.year}</span>
                            <span className="text-sm text-muted-foreground">{movie.country}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {movie.genre.slice(0, 3).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            감독: {movie.director} | 
                            주연: {movie.cast.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        
                        {/* Additional Stats */}
                        <div className="text-right space-y-1">
                          <div className="text-sm text-muted-foreground">
                            상영시간: {movie.duration}분
                          </div>
                          {movie.reviews && (
                            <div className="text-sm text-muted-foreground">
                              리뷰 {movie.reviews.length}개
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {rankedMovies.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">박스오피스 데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
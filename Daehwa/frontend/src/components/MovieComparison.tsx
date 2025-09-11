import { useState } from 'react';
import { Swords, Star, Clock, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Movie } from '../types/movie';
import { mockMovies } from '../data/movies';

interface MovieComparisonProps {
  onMovieClick: (movie: Movie) => void;
}

export function MovieComparison({ onMovieClick }: MovieComparisonProps) {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([mockMovies[0], mockMovies[1]]);

  const handleMovieSelect = (movie: Movie, index: number) => {
    const newSelectedMovies = [...selectedMovies];
    newSelectedMovies[index] = movie;
    setSelectedMovies(newSelectedMovies);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 mb-6">
          <Swords className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">영화 비교</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {selectedMovies.map((movie, index) => (
            <Card key={`${movie.id}-${index}`} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <ImageWithFallback
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                    {movie.titleEn && (
                      <p className="text-sm text-gray-200">{movie.titleEn}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{movie.rating}</span>
                      <span className="text-muted-foreground">/ 10</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      박스오피스 #{movie.boxOfficeRank || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{movie.duration}분</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{movie.country}</span>
                    </div>
                    <div className="text-muted-foreground">
                      감독: {movie.director}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">장르</p>
                    <div className="flex flex-wrap gap-1">
                      {movie.genre.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">주요 출연진</p>
                    <p className="text-sm">{movie.cast.slice(0, 3).join(', ')}</p>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onMovieClick(movie)}
                    >
                      상세 정보 보기
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      {mockMovies.filter(m => m.id !== movie.id).slice(0, 2).map((altMovie) => (
                        <Button
                          key={altMovie.id}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleMovieSelect(altMovie, index)}
                        >
                          {altMovie.title}로 변경
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* VS Indicator */}
        <div className="flex justify-center my-8">
          <div className="bg-primary text-primary-foreground rounded-full p-4 font-bold text-xl">
            VS
          </div>
        </div>
        
        {/* Quick Comparison */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">빠른 비교</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">항목</th>
                    <th className="text-center py-2">{selectedMovies[0].title}</th>
                    <th className="text-center py-2">{selectedMovies[1].title}</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">평점</td>
                    <td className="py-2 text-center font-semibold">
                      {selectedMovies[0].rating > selectedMovies[1].rating ? '🏆 ' : ''}
                      {selectedMovies[0].rating}
                    </td>
                    <td className="py-2 text-center font-semibold">
                      {selectedMovies[1].rating > selectedMovies[0].rating ? '🏆 ' : ''}
                      {selectedMovies[1].rating}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">상영시간</td>
                    <td className="py-2 text-center">{selectedMovies[0].duration}분</td>
                    <td className="py-2 text-center">{selectedMovies[1].duration}분</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">개봉년도</td>
                    <td className="py-2 text-center">{selectedMovies[0].year}</td>
                    <td className="py-2 text-center">{selectedMovies[1].year}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">박스오피스</td>
                    <td className="py-2 text-center">
                      {(selectedMovies[0].boxOfficeRank || 999) < (selectedMovies[1].boxOfficeRank || 999) ? '🏆 ' : ''}
                      #{selectedMovies[0].boxOfficeRank || 'N/A'}
                    </td>
                    <td className="py-2 text-center">
                      {(selectedMovies[1].boxOfficeRank || 999) < (selectedMovies[0].boxOfficeRank || 999) ? '🏆 ' : ''}
                      #{selectedMovies[1].boxOfficeRank || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}